<script lang="jsx">
import { ref, watch, nextTick } from 'vue'

import Prism from 'prismjs'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'

VMdPreview.use(vuepressTheme, { Prism })
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createLineNumbertPlugin())

const escapeHTML = (text) => {
  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  }
  return text.replace(/[&<>"']/g, match => escape[match])
}

// 拓展xss规则
VMdPreview.xss.extend({
  onIgnoreTag: (tag, html, options) => {
    if (tag === 'iframe') {
      return `<div>${html}</div>`
    }
    return escapeHTML(html)
  }
})

export default {
  name: 'Markdown',
  components: {
    VMdPreview
  },
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    htmlMD: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const preview = ref(null) // markdown引用
    const htmlMarkStr = ref(props.htmlMD)

    // 美化滚动条
    watch(() => props.htmlMD, (val) => {
      htmlMarkStr.value = props.htmlMD
      nextTick().then(() => {
        $('.v-md-pre-wrapper pre[class*=v-md-prism-]')[val ? 'addClass' : 'removeClass']('scroll-bar-x')
      })
    }, { immediate: true })

    return {
      preview,
      htmlMarkStr,
      handelClick: (e) => {
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
      },
      handleCopyCodeSuccess: (code) => {
        console.log('复制成功奥利给！！！', code)
      }
    }
  },
  render () {
    return (
      <>
        <div class='title flex align-items-center justify-content-center'>
          { this.title }
        </div>
        <div class='relative markdown' v-loading={this.loading}>
            {
                this.loading
                  ? null
                  : <v-md-preview
                      class='width100'
                      onClick={this.handelClick}
                      onCopy-code-success={this.handleCopyCodeSuccess}
                      ref='preview'
                      text={this.htmlMarkStr}/>
            }
        </div>
      </>
    )
  }
}
</script>

<style scoped lang="scss">
  .markdown{
    width: 100%;
    padding-bottom: 100px;
  }
  .title{
    box-sizing: border-box;
    color: var(--global-text-color);
    padding: 20px 30px;
    font-size: 18px;
    font-weight: 600;
  }
</style>
