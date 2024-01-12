<template>
    <div v-loading="loading" ref="scrollWrapRef" :class="loading ? '' : 'overflow-y-auto'" class="relative scroll-canvas-wrap">
        <div style="left: 0; top: 0" class="fixed"><div>github-page资源访问较慢，这里做2.5s缓冲</div></div>
        <div ref="scrollRef" class="relative scroll-target"></div>
        <canvas ref="scrollCanvasRef" width="1096" height="724" class="fixed align-center scroll-canvas" />
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useScroll } from '@vueuse/core'
import { baseUrlFun } from '@/common/methods'

export default {
  setup () {
    const frameCount = 121
    const loading = ref(true)

    const scrollCanvasRef = ref(null)
    const scrollWrapRef = ref(null)
    const scrollRef = ref(null)

    const canvas2dContext = () => scrollCanvasRef.value.getContext('2d')
    const currentFrame = (i) => `${baseUrlFun()}demo-static/canvas-scroll/large_${i.toString().padStart(4, '0')}.jpg`

    const preloadImages = (frameCount) => {
      for (let i = 0; i <= frameCount; i++) {
        const img = new Image()
        img.src = currentFrame(i)
      }
    }

    const drawImage = (index) => {
      let img = new Image()
      img.src = currentFrame(index)
      img.onload = () => {
        canvas2dContext().drawImage(img, 0, 0)
        img = null
      }
    }
    const { y } = useScroll(scrollWrapRef, {
      onScroll: () => {
        const scrollRefHeight = scrollRef.value.offsetHeight - scrollWrapRef.value.offsetHeight
        let frameIndex = parseInt(y.value / scrollRefHeight * frameCount)
        frameIndex = frameIndex > frameCount ? frameCount : frameIndex
        console.log('frameIndex', frameIndex)
        requestAnimationFrame(() => drawImage(frameIndex))
      }
    })

    preloadImages(frameCount)
    onMounted(() => {
      drawImage(0)
      setTimeout(() => {
        loading.value = false
      }, 2500)
    })
    return {
      scrollCanvasRef,
      scrollWrapRef,
      scrollRef,
      loading
    }
  }
}
</script>
<style scoped lang="scss">
    .scroll-canvas-wrap {
      height: 100vh;
      .scroll-target {
        z-index: 2;
        height: 200vh;
      }
      .scroll-canvas {
        z-index: 1;
      }
    }
</style>
