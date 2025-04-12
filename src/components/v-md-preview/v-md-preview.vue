<script lang="jsx">
import {
  ref,
  watch,
  nextTick,
  createApp,
  onBeforeUnmount,
  render,
  createVNode,
  defineAsyncComponent
} from 'vue'

import Prism from 'prismjs'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'

import loadingComponent from '@/components/loading/loading.vue'

const escapeHTML = (text) => {
  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  }
  return text.replace(/[&<>"']/g, (match) => escape[match])
}

VMdPreview.use(vuepressTheme, { Prism })
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createLineNumbertPlugin())
VMdPreview.xss.extend({
  // 拓展xss规则
  onIgnoreTag: (tag, html, options) => {
    if (tag === 'iframe') {
      return `<div>${html}</div>`
    }
    return escapeHTML(html)
  }
})

const playgroundWrapLoadingClassName = 'playground-wrap-loading'
export default {
  name: 'components-v-md-preview',
  components: {
    VMdPreview
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    ifLarger: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const vMdPreviewRef = ref(null)

    const markdowmText = ref('')

    let vue3SfcList = []
    let instanceList = []

    let createTimer
    let ifInitRenderPlayground = true

    // 获取loading组件html
    const loadingHtmlStr = (() => {
      let loadingHtmlNode = $('<div></div>')
      // 渲染loading组件
      render(
        createVNode(
          <loadingComponent style="font-weight: bold; font-size: 12px; background: transparent">
            <div class="w-[100%] h-[100%] flex items-center justify-center">加载中...</div>
          </loadingComponent>,
          { showModal: true }
        ),
        loadingHtmlNode[0]
      )
      // 获取loading组件html
      const loadingHtmlStr = loadingHtmlNode.html()
      loadingHtmlNode = null
      return loadingHtmlStr
    })()

    // 销毁实例
    const destroy = () => {
      clearTimeout(createTimer)
      if (instanceList.length) {
        instanceList.forEach((item) => {
          if (item.app && item.app.unmount) {
            item.app.unmount()
            item.app = null
          }
        })
      }
      createTimer = null
      instanceList = []
      vue3SfcList = []
    }

    // 渲染playground
    const renderPlayGround = () => {
      nextTick(() => {
        let playgroundWrapLoadingNode = $(`.${playgroundWrapLoadingClassName}`)
        playgroundWrapLoadingNode.css('display', 'block')
        createTimer = setTimeout(
          () => {
            vue3SfcList.length = 1

            vue3SfcList.forEach((item, index) => {
              let mountNode = $(`#${item.idSelector}`)
              // 没有渲染容器
              if (!mountNode[0]) {
                mountNode.html(
                  '<div style="font-size: 16px; font-weight: blod; height: 100%" class="flex items-center justify-center">组件解析失败，请刷新重试...</div>'
                )
                mountNode = null
                return
              }

              const app = createApp(
                defineAsyncComponent(() => import('@/components/playground-plane/index.jsx')),
                {
                  // 实例化 playgroundPlane 组件
                  name: item.idSelector,
                  key: new Date(),
                  componentsFiles: ((componentsFiles = {}) => {
                    // 解析vue3-file标签生成组件字符串
                    window
                      .$('vue3-file')
                      .parse(item.str, false)
                      .each((i2, obj2) => {
                        const file = window.$(obj2)
                        let fileName = file.attr('name')
                        if (fileName.toLowerCase() === 'app.vue') {
                          fileName = 'App.vue'
                        }
                        componentsFiles[fileName] = file.html()
                      })
                    return componentsFiles
                  })(),
                  playGroundPlaneWidth: '100%',
                  playGroundPlaneReplHeight: '100%',
                  customCode: {
                    importCode: '',
                    useCode: 'console.log("customCode--🥵")'
                  }
                }
              )
              app.mount(mountNode[0])

              // 保存实例
              instanceList.push({ app })
              mountNode = null
              console.log('playground组件生成完成')
            })

            playgroundWrapLoadingNode.css('display', 'none')
            playgroundWrapLoadingNode = null
            ifInitRenderPlayground = false
          },
          ifInitRenderPlayground ? 0 : 2000
        )
      })
    }

    const watchFun = (newV, oldV) => {
      if (newV !== oldV && newV) {
        destroy()
        // 解析markdown中vue3-sfc标签
        const analysisMarkdowmText = window
          .$('vue3-sfc')
          .parse(newV, false)
          .replaceWith((i1, item) => {
            const str = window.$(item).html()
            const id = `playground-${i1}`
            vue3SfcList.push({ str, idSelector: id })
            return `<div style="position: relative; height: 600px; margin: 0.85em 0;">
              <div class=${playgroundWrapLoadingClassName} style="width: 100%; height: 100%; z-index: 0; position: absolute; left: 0; top: 0">${loadingHtmlStr}</div>
              <div style="position: relative; height: 100%; z-index: 1; display: block; transform: translateZ(0px); transform-style: preserve-3d;" id="${id}"></div>
            </div>`
          })
          .printHtml()

        // 没有解析到组件
        if (!vue3SfcList.length) {
          markdowmText.value = newV
          console.log('解析完成--不需要生成playground组件')
          return
        }

        markdowmText.value = analysisMarkdowmText
        console.log('解析完成--需要生成playground组件')
        // 渲染playground
        renderPlayGround()
      }
    }

    const getVMdPreviewRef = (valueRef) => {
      vMdPreviewRef.value = valueRef
      emit('getVMdPreviewRef', valueRef)
    }

    const onHandleCopyCodeSuccess = (code) => {
      console.log('复制成功奥利给！！！', { code })
      emit('copy-code-success', code)
    }

    const onHandelClick = (e) => {
      let target = $(e.target)
      if (target.hasClass('v-md-copy-code-btn')) {
        let oldNode = target.html()
        target.css({ whiteSpace: 'nowrap' })

        let oldStyle = {
          width: target.width(),
          height: target.height(),
          lineHeight: target.css('line-height'),
          whiteSpace: 'nowrap'
        }
        target.html('复制成功')
        target.css({ width: '5em', height: '2em', lineHeight: '1.5em', transition: 'all 0.3s' })
        setTimeout(() => {
          target.css(oldStyle)
          target.html(oldNode)
          target = null
          oldNode = null
          oldStyle = null
        }, 1000)
      } else {
        target = null
      }
      emit('click', e)
    }

    watch(() => props.text, watchFun, { immediate: true })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      vMdPreviewRef,
      markdowmText,
      getVMdPreviewRef,
      onHandleCopyCodeSuccess,
      onHandelClick
    }
  },
  render() {
    return (
      <VMdPreview
        ref={this.getVMdPreviewRef}
        text={this.markdowmText}
        {...this.$attrs}
        onCopy-code-success={(code) => this.onHandleCopyCodeSuccess(code)}
        onClick={(e) => {
          this.onHandelClick(e)
        }}
      />
    )
  }
}
</script>
<style scoped lang="scss">
.v-md-editor-preview {
  ::v-deep(.vuepress-markdown-body) {
    color: var(--global-markdown-body-text-color);
    background-color: var(--global-background-color);
    tr:nth-child(2n) {
      background-color: var(--global-2n-tr-color);
    }
    code {
      background-color: var(--global-code-text-bg);
    }
    .copy-code-mode .v-md-copy-code-btn {
      background-color: #3d3d3d;
    }
    * {
      word-break: break-all;
    }
  }
}
</style>
