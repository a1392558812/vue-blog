<template>
  <div
    v-loading="loading"
    ref="scrollWrapRef"
    :class="loading ? '' : 'overflow-y-auto'"
    class="relative scroll-canvas-wrap"
  >
    <div style="left: 0; top: 0" class="fixed">
      <div>github-page资源访问较慢，这里做2.5s缓冲</div>
    </div>
    <div ref="scrollRef" class="relative scroll-target"></div>
    <canvas
      ref="scrollCanvasRef"
      width="1096"
      height="724"
      class="fixed align-center scroll-canvas"
    />
  </div>
</template>
<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useScroll } from '@vueuse/core'
import { baseUrlFun } from '@/common/util/methods'

export default {
  name: 'view-demo-canvas-scroll',
  setup() {
    const loading = ref(true)

    const scrollCanvasRef = ref(null)
    const scrollWrapRef = ref(null)
    const scrollRef = ref(null)

    const canvas2dContext = () => scrollCanvasRef.value.getContext('2d')
    const currentFrame = (i) =>
      `${baseUrlFun()}demo-static/canvas-scroll/large_${i.toString().padStart(4, '0')}.jpg`

    const imageList = ref(
      (() => {
        const list = []
        for (let i = 0; i <= 121; i++) {
          const url = currentFrame(i)
          const imageDom = new Image()
          imageDom.src = url
          const currentImg = {
            url,
            imageDom,
            ifLoad: false
          }
          list.push(currentImg)
          imageDom.onload = () => {
            imageList.value[i].ifLoad = true
            imageDom.onload = null
          }
        }
        return list
      })()
    )

    const drawImage = (index) => {
      const target = imageList.value[index]
      if (target.ifLoad === false) {
        const imageDom = new Image()
        imageDom.src = target.url
        imageDom.onload = () => {
          imageList.value[index].ifLoad = true
          imageDom.onload = null
        }
        const stopWatch = watch(
          () => imageList.value[index].ifLoad,
          (newV) => {
            console.log('watch', target)
            if (newV) {
              drawImage(index)
              stopWatch()
            }
          }
        )
        return
      }
      canvas2dContext().drawImage(imageList.value[index].imageDom, 0, 0)
    }

    const { y } = useScroll(scrollWrapRef, {
      onScroll: () => {
        const scrollRefHeight = scrollRef.value.offsetHeight - scrollWrapRef.value.offsetHeight
        let frameIndex = parseInt((y.value / scrollRefHeight) * imageList.value.length)
        frameIndex =
          frameIndex > imageList.value.length - 1 ? imageList.value.length - 1 : frameIndex
        drawImage(frameIndex)
      }
    })

    onMounted(() => {
      drawImage(0)
      setTimeout(() => {
        loading.value = false
      }, 2500)
    })

    onUnmounted(() => {
      imageList.value = []
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
    height: 400vh;
  }
  .scroll-canvas {
    z-index: 1;
  }
}
</style>
