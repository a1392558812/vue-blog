<template>
  <div class="sticky flex-shrink-0 height100 markdown-title">
    <div class="width100 height100 overflow-y-auto overflow-x-hidden; markdown-title-inner">
      <div class="width100 text-align-center markdown-title-navigator">标题导航</div>
      <div class="markdown-title-wrap">
        <div class="overflow-y-hidden height100 relative markdown-title-main" ref="listContentRef">
          <div class="markdown-title-list">
            <div
              v-for="(anchor, index) in articleTitles"
              :key="index"
              class="cursor-pointer markdown-title-item"
              :style="{ padding: `10px 0 10px ${anchor.indent * 10}px` }"
            >
              <a
                class="cursor-pointer"
                :title="anchor.title"
                href="/"
                @click="
                  function (e) {
                    handleAnchorClick(e, anchor)
                  }
                "
                >{{ anchor.title }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onUnmounted } from 'vue'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
BScroll.use(ObserveDOM)

defineOptions({ name: 'NavigatorTitle' })

const props = defineProps({
  markdownTitleWidth: {
    type: String,
    default: '10px'
  },
  articleTitles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['handleAnchorClick'])

const bestScroll = ref(null)
const listContentRef = ref(null)

// 初始化滚动
const initScroll = () => {
  bestScroll.value = new BScroll(listContentRef.value, {
    click: true,
    observeDOM: true,
    bounce: false,
    scrollbar: {
      fade: false,
      interactive: true,
      scrollbarTrackClickable: true
    },
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 300
    }
  })
  console.log('initScroll', props.articleTitles.length, listContentRef.value, bestScroll.value)
}

// 销毁滚动
const destroyScroll = () => {
  console.log('destroyScroll')
  if (bestScroll.value) {
    bestScroll.value.destroy()
  }
  bestScroll.value = null
}

const handleAnchorClick = (event, anchor) => {
  event.preventDefault()
  emit('handleAnchorClick', anchor)
}

watch(
  () => props.articleTitles,
  () => {
    destroyScroll()
    nextTick().then(() => {
      initScroll()
    })
  },
  { immediate: true }
)

onUnmounted(() => {
  destroyScroll()
})
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
      padding: 15px 5px;
      border-bottom: 1px solid var(--global-border-color);
      .markdown-title-main {
        padding: 0 15px 0 10px;
        box-sizing: border-box;
        .markdown-title-list {
          padding-bottom: 15px;
          .markdown-title-item {
            a {
              color: var(--global-primary-color);
            }
          }
        }
      }
    }
  }
}
</style>
