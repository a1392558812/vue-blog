<template>
  <div
    v-loading="loading"
    ref="scrollWrapRef"
    :class="loading ? '' : 'overflow-y-auto'"
    class="relative scroll-video-wrap"
  >
    <div style="left: 0; top: 0" class="fixed">
      <div>github-page资源访问较慢，这里做2.5s缓冲</div>
    </div>
    <div ref="scrollRef" class="relative scroll-target"></div>
    <video
      ref="scrollVideoRef"
      preload
      autobuffer
      :controls="false"
      :autoplay="false"
      :src="videoUrl"
      width="1096"
      class="fixed align-center scroll-video"
    />
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useScroll } from '@vueuse/core'
import { baseUrlFun } from '@/common/util/methods'

export default {
  name: 'view-demo-video-scroll',
  setup() {
    const loading = ref(true)

    const scrollVideoRef = ref(null)
    const scrollWrapRef = ref(null)
    const scrollRef = ref(null)
    const videoUrl = `${baseUrlFun()}demo-static/filmstrip/video/video.mp4`

    let duration = 0
    let scrollpos = 0
    let targetscrollpos = 0 // scrollTop占滚动距离比例
    let accel = 0
    let lastY = 0 // 上一次Y距离
    const accelamount = 0.75 // 视频将以多快的速度试图赶上目标位置
    const bounceamount = 0.21 // 来回反弹弹性的程度

    const { y } = useScroll(scrollWrapRef, {
      onScroll: () => {
        const scrollRefHeight = scrollRef.value.offsetHeight - scrollWrapRef.value.offsetHeight
        targetscrollpos = y.value / scrollRefHeight
      }
    })
    const drawVideo = () => {
      setInterval(() => {
        if (lastY === y.value) return
        if (!duration) {
          duration = scrollVideoRef.value.duration
        }
        if (duration) {
          // 将以accel速度达到目标比例scrollpos
          accel += (targetscrollpos - scrollpos) * accelamount

          // 平滑速度不要过快，在一个固定范围变动，以免视频播放速度抽搐
          if (accel > 1) accel = 1
          if (accel < -1) accel = -1

          // 根据加速度和bounceamount弹性程度移动视频到滚动位置
          scrollpos = +(
            (scrollpos + accel) * bounceamount +
            targetscrollpos * (1 - bounceamount)
          ).toFixed(5)
          const currentTime = scrollpos * duration

          // 归零最小播放时间
          if (scrollpos < 0) scrollpos = 0

          scrollVideoRef.value.currentTime = currentTime
          scrollVideoRef.value.pause()
          lastY = y.value
        }
      }, 60)
    }

    onMounted(() => {
      scrollVideoRef.value.pause()
      setTimeout(() => {
        scrollVideoRef.value.currentTime = 0.1 // 视频第一帧
        loading.value = false
        drawVideo()
      }, 2500)
    })
    return {
      scrollVideoRef,
      scrollWrapRef,
      scrollRef,
      videoUrl,
      loading
    }
  }
}
</script>
<style scoped lang="scss">
.scroll-video-wrap {
  height: 100vh;
  .scroll-target {
    z-index: 2;
    height: 600vh;
  }
  .scroll-video {
    z-index: 1;
  }
}
</style>
