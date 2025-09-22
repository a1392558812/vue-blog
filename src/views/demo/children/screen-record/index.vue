<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
    <div class="max-w-7xl mx-auto">
      <div v-if="!isSupported" class="flex items-center justify-center h-96 bg-white rounded-xl shadow-lg">
        <div class="text-gray-500 text-lg">您的浏览器不支持屏幕录制功能</div>
      </div>

      <div v-else class="flex flex-wrap gap-6 justify-center">
        <!-- 录制预览 -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
          <div
            class="video-label flex items-center justify-between px-4 h-[64px] bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200">
            <span class="font-medium text-indigo-800">录制预览</span>
            <button @click="enabled ? stopRecorderVideo() : startRecorderVideo()"
              class="px-4 py-2 rounded-full font-medium transition-colors"
              :class="enabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'">
              {{ enabled ? '结束录制' : '开始录制' }}
            </button>
          </div>
          <video class="block w-[500px] h-auto border-2 border-indigo-100 rounded-lg m-4" ref="videoRef" muted download
            autoplay controls></video>
        </div>

        <!-- 录制完成预览 -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
          <div
            class="video-label flex items-center px-4 h-[64px] bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200">
            <span class="font-medium text-indigo-800 mr-2">录制完成：</span>
            <a v-if="videoDownloadSrc" :href="videoDownloadSrc" download
              class="text-indigo-600 hover:text-indigo-800 hover:underline text-sm break-all max-w-[400px]">
              {{ videoDownloadSrc }}
            </a>
            <span v-else class="text-gray-500 text-sm">暂无录制内容</span>
          </div>
          <video class="block w-[500px] h-auto border-2 border-indigo-100 rounded-lg m-4" :src="videoDownloadSrc" muted
            download :autoplay="false" preload="auto" controls></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import { useDisplayMedia } from '@vueuse/core'

defineOptions({ name: 'view-demo-screen-record' })

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
    mediaRecorder = new MediaRecorder(stream.value, { mimeType: 'video/webm' })
    mediaRecorder.start()
  })
}

const stopRecorderVideo = () => {
  mediaRecorder.stop()
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
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
  if (mediaRecorder) {
    mediaRecorder.stop()
  }
  stop()
  revokeVideoDownloadSrc()
  mediaRecorder = null
})
</script>

<style scoped lang="scss">
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 视频播放器样式优化 */
video {
  transition: all 0.3s ease;
}

video:hover {
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

/* 禁用按钮样式增强 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 进度条样式优化 */
video::-webkit-media-controls-timeline {
  background-color: rgba(79, 70, 229, 0.2);
  border-radius: 3px;
}

video::-webkit-media-controls-volume-slider {
  background-color: rgba(79, 70, 229, 0.2);
  border-radius: 3px;
}
</style>
