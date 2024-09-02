<script lang="jsx">
import { ref, watch, nextTick, onMounted, defineAsyncComponent } from 'vue'
import navigatorTitle from './navigator-title.vue'
import loadingComponent from '@/components/loading/loading.vue'

export default {
  name: 'home-markdown-type',
  components: {
    navigatorTitle,
    loadingComponent,
    vMdPreview: defineAsyncComponent(() => import('@/components/v-md-preview/index.jsx'))
  },
  props: {
    headerH: {
      type: String,
      default: '70px'
    },
    loading: {
      type: Boolean,
      default: true
    },
    ifLarger: {
      type: Boolean,
      default: true
    },
    htmlMD: {
      type: String,
      default: ''
    },
    markdownTitleWidth: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const preview = ref(null) // markdown引用
    const articleTitles = ref([]) // markdown编辑器预览锚点标题
    const markdownContentMinWidth = ref('850px') // markdown编辑器最小宽度
    const markdownMinHeight = ref('calc(100% - 170px)') // markdown区域的高度
    const htmlMarkStr = ref('')

    // 锚点标题动态设定
    const articleTitlesInit = () => {
      if (preview.value) {
        const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6')
        const previewTitles = Array.from(anchors).filter((title) => !!title.innerText.trim())
        if (!previewTitles.length) {
          articleTitles.value = []
          return
        }
        const hTags = Array.from(new Set(previewTitles.map((title) => title.tagName))).sort()
        articleTitles.value = previewTitles.map((el) => ({
          title: el.innerText,
          lineIndex: el.getAttribute('data-v-md-line'),
          indent: hTags.indexOf(el.tagName)
        }))
      } else {
        setTimeout(() => {
          articleTitlesInit()
        })
      }
    }

    // markdown部分高度动态设定
    const setMarkdownMinHeight = () => {
      console.log('markdown部分高度动态设定')
      markdownMinHeight.value = `calc(100% - ${100 + $('.home .title').outerHeight()}px)`
    }

    // 锚点标题动态设定
    watch(
      () => props.htmlMD,
      (newV, oldV) => {
        if (newV !== oldV && newV) {
          htmlMarkStr.value = newV
          nextTick().then(() => {
            articleTitlesInit()
          })
        }
      },
      { immediate: true }
    )

    // markdown部分高度动态设定
    watch(
      () => props.title,
      () => {
        setMarkdownMinHeight()
      }
    )

    // 初始化markdown部分高度动态设定
    onMounted(setMarkdownMinHeight)

    return {
      preview,
      htmlMarkStr,
      articleTitles,
      markdownMinHeight,
      markdownContentMinWidth,
      handleAnchorClick: (anchor) => {
        const { lineIndex } = anchor
        console.log('preview', preview, preview.value)
        let heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
        if (heading) {
          preview.value.scrollToTarget({
            target: heading,
            scrollContainer: $('.home')[0]
          })
        }
        heading = null
      }
    }
  },
  render() {
    return (
      <>
        <div
          style={(() => {
            const styleMap = {}
            if (this.ifLarger) {
              if (this.articleTitles.length) {
                styleMap.width = `calc(100% - ${this.markdownTitleWidth})`
                styleMap.minWidth = `calc(${this.markdownContentMinWidth} - ${this.markdownTitleWidth})`
              } else {
                styleMap.width = '100%'
                styleMap.minWidth = `${this.markdownContentMinWidth}`
              }
            } else {
              styleMap.width = '100%'
            }
            return styleMap
          })()}
          class="title flex align-items-center justify-content-center"
        >
          {this.title}
        </div>
        <div
          class="relative markdown"
          style={{
            minHeight: this.markdownMinHeight,
            ...(this.ifLarger ? { minWidth: this.markdownContentMinWidth } : {})
          }}
        >
          {!this.loading ? (
            <div
              style={(() => {
                const styleMap = {}
                if (this.ifLarger) {
                  if (this.articleTitles.length) {
                    styleMap.minWidth = `calc(${this.markdownContentMinWidth} - ${this.markdownTitleWidth})`
                    styleMap.paddingRight = `${this.markdownTitleWidth}`
                  } else {
                    styleMap.minWidth = `calc(${this.markdownContentMinWidth})`
                    styleMap.paddingRight = 0
                  }
                }
                return styleMap
              })()}
              class="flex height100"
            >
              <div class="width100">
                <v-md-preview
                  class="width100"
                  ifLarger={this.ifLarger}
                  onGetVMdPreviewRef={(valueRef) => {
                    this.preview = valueRef
                  }}
                  text={this.htmlMarkStr}
                />
              </div>
              {this.ifLarger ? (
                <navigator-title
                  ifLarger={this.ifLarger}
                  markdownTitleWidth={this.markdownTitleWidth}
                  articleTitles={this.articleTitles}
                  onHandleAnchorClick={(anchor) => {
                    this.handleAnchorClick(anchor)
                  }}
                />
              ) : null}
            </div>
          ) : (
            <loadingComponent style="background-color: transparent" showModal={true}>
              <div
                style="font-weight: bold"
                class="width100 height100 flex align-items-center justify-content-center"
              >
                加载中...
              </div>
            </loadingComponent>
          )}
        </div>
      </>
    )
  }
}
</script>

<style scoped lang="scss">
.markdown {
  width: 100%;
  padding-bottom: 100px;
  z-index: 0;
}
.title {
  box-sizing: border-box;
  color: var(--global-text-color);
  padding: 20px 30px;
  font-size: 18px;
  font-weight: 600;
}
</style>
