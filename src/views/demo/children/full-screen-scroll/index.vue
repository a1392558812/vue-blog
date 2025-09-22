<template>
  <div>
    <div class="fixed flex flex-row-reverse items-center w-[100%] fullpage-header">
      <button class="lh-none block fullpage-header-btn" @click="handle1">向上滚1屏幕</button>
      <button class="lh-none block fullpage-header-btn" @click="handle2">
        移动到5屏第3个slide
      </button>
    </div>
    <div id="fullpage" class="relative">
      <div class="h-[100%] flex items-center justify-center section">第1屏</div>
      <div class="h-[100%] flex items-center justify-center section">第2屏</div>
      <div class="h-[100%] flex items-center justify-center section">第3屏</div>
      <div class="h-[100%] flex items-center justify-center section">第4屏</div>
      <div class="h-[100%] overflow-auto section">
        <div class="flex items-center justify-center slide" data-anchor="slide1">抽象屏 1</div>
        <div class="flex items-center justify-center slide" data-anchor="slide2">抽象屏 2</div>
        <div class="flex items-center justify-center slide" data-anchor="slide3">抽象屏 3</div>
        <div class="flex items-center justify-center slide" data-anchor="slide4">抽象屏 4</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import '@/static/fullPage/dist/fullpage.extensions.min.js'
import '@/static/fullPage/dist/fullpage.css'

console.log('fullpage', window.fullpage)

let fullpageResult
const initFullpage = () => {
  fullpageResult = new window.fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    licenseKey: '',
    scrollHorizontally: true,
    loopTop: true,
    showActiveTooltip: true,
    parallax: true,
    navigationPosition: 'right',
    slidesNavigation: true,
    dragAndMove: true,
    slidesNavPosition: 'bottom',
    loopBottom: true,
    credits: { enabled: false, label: '', position: 'right' },
    beforeLeave: function (origin, destination, direction, trigger) {
      console.log('beforeLeave', origin, destination, direction, trigger)
    },
    onLeave: function (origin, destination, direction, trigger) {
      console.log('onLeave', origin, destination, direction, trigger)
    },
    afterLoad: function (origin, destination, direction, trigger) {
      console.log('afterLoad', origin, destination, direction, trigger)
    },
    afterRender: function () {
      console.log('afterRender')
    },
    afterResize: function (width, height) {
      console.log('afterResize', width, height)
    },
    afterReBuild: function () {
      console.log('afterReBuild')
    },
    afterResponsive: function (isResponsive) {
      console.log('afterResponsive', isResponsive)
    },
    afterSlideLoad: function (section, origin, destination, direction, trigger) {
      console.log('afterSlideLoad', section, origin, destination, direction, trigger)
    },
    onSlideLeave: function (section, origin, destination, direction, trigger) {
      console.log('onSlideLeave', section, origin, destination, direction, trigger)
    },
    onScrollOverflow: function (section, slide, position, direction) {
      console.log('onScrollOverflow', section, slide, position, direction)
    }
  })
  console.log('fullpageResult', fullpageResult)
}
onMounted(() => {
  initFullpage()
})

onUnmounted(() => {
  fullpageResult && fullpageResult.destroy()
})

const handle1 = () => {
  fullpageResult.moveSectionUp()
}

const handle2 = () => {
  fullpageResult.moveTo(5)
  fullpageResult.moveTo(5, 2)
}
</script>

<style lang="scss" scoped>
.fullpage-header {
  height: 70px;
  z-index: 10;
  border-bottom: 1px solid #000;
  background: #fff;
  top: 0;

  .fullpage-header-btn {
    padding: 3px 10px;
    margin-right: 20px;
  }
}

#fullpage {
  height: 100vh;

  .section {
    font-size: 90px;
    font-weight: bolder;
    letter-spacing: 15px;
  }

  ::v-deep(.fp-slidesNav) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::v-deep(.fp-prev) {
    border-width: 38.5px 34px 38.5px 0;
    border-color: transparent #7bfa04 transparent transparent;
  }

  ::v-deep(.fp-next) {
    border-width: 38.5px 0 38.5px 34px;
    border-color: transparent transparent transparent #7bfa04;
  }
}
</style>
