<template>
  <div>
    <div v-if="!isSupported" style="width: 600px; height: 600px" class="flex align-items-center justify-content-center">
        浏览器不支持
    </div>
    <div v-else>
      <div class="flex">
        <div class="video-player-wrap">
            <div class="video-label flex align-items-center">
                <span style="margin-right: 10px">录制预览</span>
                <button @click="enabled ? stopRecorderVideo() : startRecorderVideo()">{{ enabled ? '结束录制' : '开始录制' }}</button>
            </div>
            <video class="display-block video-player" ref="videoRef" muted download autoplay controls></video>
        </div>
        <div class="video-player-wrap">
            <div class="video-label flex align-items-center">
                <span>预览：<a :href="videoDownloadSrc" download>{{ videoDownloadSrc }}</a></span>
            </div>
            <video class="display-block video-player" :src="videoDownloadSrc" muted download :autoplay="false" preload="auto" controls></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import { useDisplayMedia } from '@vueuse/core'

const { isSupported, enabled, stream, start, stop } = useDisplayMedia()

const videoRef = ref(null)

const videoDownloadSrc = ref(null)

let mediaRecorder

const revokeVideoDownloadSrc = () => {
  if (videoDownloadSrc.value) {
    URL.revokeObjectURL(videoDownloadSrc.value)
    videoDownloadSrc.value = null
  }
}

const startRecorderVideo = () => {
  revokeVideoDownloadSrc()
  start().then(() => {
    console.log('stream start', stream.value)
    mediaRecorder = new MediaRecorder(stream.value, { mimeType: 'video/webm' })
    mediaRecorder.start()
  })
}

const stopRecorderVideo = () => {
  mediaRecorder.stop()
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      console.log('stream stop')
      videoDownloadSrc.value = URL.createObjectURL(new Blob([e.data], { type: 'video/mp4' }))
      mediaRecorder = null
    }
  }
  stop()
}

watchEffect(() => {
  if (videoRef.value) {
    videoRef.value.srcObject = stream.value
  }
})

onBeforeUnmount(() => {
  mediaRecorder.stop()
  stop()
  revokeVideoDownloadSrc()
  mediaRecorder = null
})

</script>

<style scoped lang="scss">
.video-player-wrap {
    margin-right: 20px;
    border: 1px solid #000;
    .video-label {
        height: 40px;
        padding: 10px;
        border-bottom: 1px solid #000;
    }
    .video-player {
        width: calc(1920px / 3);
        height: calc(1080px / 3);
    }
}

</style>
