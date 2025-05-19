<template>
  <div
    class="sticky shrink-0 h-[100%] top-[0] right-[0] [border-left:1px_solid_var(--global-border-color)] box-border bg-[var(--global-background-color)] markdown-title"
  >
    <div
      class="w-[100%] h-[100%] overflow-y-auto overflow-x-hidden [word-wrap:break-word] break-all"
    >
      <div
        class="w-[100%] text-center px-[0] py-[20px] text-[20px] text-[#f5662e] [font-weight:600] [border-bottom:1px_solid_var(--global-border-color)]"
      >
        标题导航
      </div>
      <div
        class="h-[400px] px-[5px] py-[15px] [border-bottom:1px_solid_var(--global-border-color)]"
      >
        <div
          class="overflow-y-hidden h-[100%] relative pl-[10px] pr-[15px] py-[0] box-border"
          ref="listContentRef"
        >
          <div class="pb-[15px]">
            <div
              v-for="(anchor, index) in articleTitles"
              :key="index"
              class="cursor-pointer"
              :style="{ padding: `10px 0 10px ${anchor.indent * 10}px` }"
            >
              <a
                class="cursor-pointer text-[var(--global-primary-color)]"
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
  width: v-bind(markdownTitleWidth);
}
</style>
