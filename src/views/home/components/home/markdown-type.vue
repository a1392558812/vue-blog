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
    const markdownContentMinWidth = ref('550px') // markdown编辑器最小宽度
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
            scrollContainer: $('.markdown-content')[0]
          })
        }
        heading = null
      }
    }
  },
  render() {
    return (
      <div class="w-[100%] h-[100%] relative overflow-hidden flex flex-col">
        <div
          style={(() => {
            if (this.ifLarger) {
              if (this.articleTitles.length) {
                return {
                  minWidth: `calc(${this.markdownContentMinWidth} + ${this.markdownTitleWidth})`
                }
              }
              return { minWidth: this.markdownContentMinWidth }
            }
            return {}
          })()}
          class="w-[100%] bg-style flex shrink-0 items-center justify-center title"
        >
          {this.title}
        </div>
        {!this.loading ? (
          <div class="w-[100%] h-[100%] relative flex overflow-auto markdown-content">
            <div
              class="w-[100%] h-0"
              style={this.ifLarger ? { minWidth: this.markdownContentMinWidth } : {}}
            >
              <div style="padding-bottom: 100px">
                <v-md-preview
                  class="w-[100%]"
                  ifLarger={this.ifLarger}
                  onGetVMdPreviewRef={(valueRef) => {
                    this.preview = valueRef
                  }}
                  text={this.htmlMarkStr}
                />
              </div>
            </div>
            {this.ifLarger && this.articleTitles.length ? (
              <navigator-title
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
              class="w-[100%] h-[100%] flex items-center justify-center"
            >
              加载中...
            </div>
          </loadingComponent>
        )}
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
.title {
  box-sizing: border-box;
  color: var(--global-text-color);
  padding: 20px 30px;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid var(--global-border-color);
  box-shadow: 0px 0px 1px 0px var(--global-border-color);
  z-index: 1;
}
</style>
