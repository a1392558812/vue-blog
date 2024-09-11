<template>
  <div class="sticky flex-shrink-0 height100 markdown-title">
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
export default {
  name: 'NavigatorTitle',
  props: {
    markdownTitleWidth: {
      type: String,
      default: '10px'
    },
    articleTitles: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    return {
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
  top: 0;
  right: 0;
  border-left: 1px solid var(--global-border-color);
  z-index: 1;
  .markdown-title-inner {
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
      padding: 10px 15px;
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
