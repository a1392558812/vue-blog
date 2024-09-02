<template>
  <div
    v-if="articleTitles.length"
    :style="{
      right: `${barWidth}px`,
      height: articleTitlesHeight + 'px'
    }"
    class="fixed flex-shrink-0 markdown-title"
  >
    <div class="width100 height100 markdown-title-inner">
      <div class="width100 text-align-center markdown-title-navigator">标题导航</div>
      <div class="markdown-title-wrap">
        <div class="overflow-y-auto height100 markdown-title-main">
          <div
            v-for="(anchor, index) in articleTitles"
            :key="index"
            class="markdown-title-item"
            :style="{ padding: `10px 0 10px ${anchor.indent * 10}px` }"
          >
            <a style="cursor: pointer" @click="handleAnchorClick(anchor)">{{ anchor.title }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
export default {
  name: 'NavigatorTitle',
  props: {
    ifLarger: {
      type: Boolean,
      default: true
    },
    markdownTitleWidth: {
      type: String,
      default: '10px'
    },
    articleTitles: {
      type: Array,
      default: () => []
    },
    headerH: {
      type: String,
      default: '70px'
    }
  },
  setup(props, { emit }) {
    const barWidth = ref(0) // 浏览器滚动条宽度

    const articleTitlesHeight = ref(0) // 标题区高度
    // 获取浏览器滚动条宽度
    const getBarWidth = () => {
      const outDiv = document.createElement('div')
      outDiv.style.width = '100px'
      outDiv.style.position = 'absolute'
      outDiv.style.top = '-9999px'
      document.body.appendChild(outDiv)
      const widthnobar = outDiv.offsetWidth

      outDiv.style.overflow = 'scroll'

      const innerDiv = document.createElement('div')
      innerDiv.style.width = '100%'
      outDiv.appendChild(innerDiv)
      const widthbar = innerDiv.offsetWidth

      document.body.removeChild(outDiv)

      return widthnobar - widthbar
    }
    onMounted(() => {
      barWidth.value = props.ifLarger ? getBarWidth() : 0
      articleTitlesHeight.value = $('.home').height()
    })
    return {
      barWidth,
      articleTitlesHeight,
      handleAnchorClick: (anchor) => {
        emit('handleAnchorClick', anchor)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-title {
  box-sizing: border-box;
  width: v-bind(markdownTitleWidth);
  background-color: var(--global-background-color);
  top: v-bind(headerH);
  border-left: 1px solid var(--global-border-color);
  z-index: 999;
  .markdown-title-inner {
    $widht: calc(864px / 5.5);
    $height: calc(836px / 5.5);
    overflow-y: auto;
    overflow-x: hidden;
    word-wrap: break-word;
    word-break: break-all;
    .markdown-title-navigator {
      padding: 20px 0;
      font-size: 20px;
      color: #f5662e;
      font-weight: bold;
      border-bottom: 1px solid var(--global-border-color);
    }
    .markdown-title-wrap {
      height: 400px;
      padding: 0 5px 0 15px;
      border-bottom: 1px solid var(--global-border-color);
      .markdown-title-main {
        padding-bottom: 15px;
        box-sizing: border-box;
        .markdown-title-item {
          a {
            color: var(--global-primary-color);
          }
        }
      }
    }
  }
}
</style>
