<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8 flex items-center justify-center">
    <div class="container max-w-7xl mx-auto">
      <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800 text-center mb-10">图片转Base64工具</h1>

      <div class="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
        <!-- 图片预览区域 -->
        <div class="w-full max-w-[600px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="p-[20px] h-[calc(100%-20px*2)] box-content">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">图片预览</h2>
            <div
              class="h-[500px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 relative">
              <img v-if="imageSrc" :src="imageSrc" alt="预览图片"
                class="max-w-full max-h-[400px] object-contain rounded-md shadow-sm" />
              <button v-if="imageSrc" @click="uploadClick"
                class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-medium">
                换一张
              </button>
              <div v-else class="text-center">
                <div class="text-gray-500 mb-4">支持粘贴图片，支持点击选择图片</div>
                <label for="file-upload"
                  class="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
                  选择图片
                </label>

              </div>
            </div>
          </div>
        </div>

        <!-- Base64编码显示区域 -->
        <div class="w-full max-w-[600px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="p-[20px]">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Base64编码</h2>
            <div class="relative">
              <div
                class="h-[400px] break-all overflow-auto p-4 bg-gray-800 text-gray-100 rounded-lg text-sm font-mono shadow-sm">
                {{ imageSrc || 'Base64编码将显示在这里...' }}
              </div>
              <button v-if="imageSrc" @click="onCopy"
                class="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <button v-if="imageSrc" @click="onCopy"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 font-medium">
                全部复制
              </button>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div class="bg-blue-50 p-3 rounded-lg">
                  <span class="text-sm text-gray-500">原始大小:</span>
                  <span class="font-semibold text-blue-700 ml-1">{{ formatFileSize(originSize) }}</span>
                </div>
                <div class="bg-purple-50 p-3 rounded-lg">
                  <span class="text-sm text-gray-500">Base64大小:</span>
                  <span class="font-semibold text-purple-700 ml-1">{{ formatFileSize(currentSize) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input id="file-upload" ref="uploadRef" v-show="!imageSrc" type="file" accept="image/*" @change="onUploadImage"
      class="sr-only z-[-1]" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { fileToBase64Async } from '@/common/util/methods'
import { useClipboard } from '@vueuse/core'

const imageSrc = ref('')

const { text, copy, copied, isSupported } = useClipboard({ source: imageSrc })

const originSize = ref(0)
const currentSize = ref(0)
const uploadRef = ref(null)

function getUTF8ByteSizeManual(str) {
  let size = 0
  for (let i = 0; i < str.length; i++) {
    const codePoint = str.codePointAt(i)

    // 处理代理对（surrogate pair）
    if (codePoint > 0xffff) {
      i++ // 跳过代理对的第二个代码单元
    }

    if (codePoint <= 0x7f) {
      size += 1
    } else if (codePoint <= 0x7ff) {
      size += 2
    } else if (codePoint <= 0xffff) {
      size += 3
    } else {
      size += 4
    }
  }
  return size
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const onUploadImage = (e) => {
  const file = e.target.files[0]
  if (!file) return
  originSize.value = file.size
  fileToBase64Async(file).then((res) => {
    imageSrc.value = res
    currentSize.value = getUTF8ByteSizeManual(res)
  })
}

const onCopy = () => {
  copy(imageSrc.value).then(() => {
    console.log('复制成功', text, copied, isSupported)
  })
}

const uploadClick = () => {
  uploadRef.value.click()
}

const onPaste = (event) => {
  event.preventDefault()
  const clipboardData = event.clipboardData || window.clipboardData
  if (clipboardData.types && clipboardData.types.length) {
    if (
      clipboardData.types.includes('Files') &&
      clipboardData.files &&
      clipboardData.files.length
    ) {
      const file = clipboardData.files[0]

      if (file.type.indexOf('image') === -1) {
        return
      }

      originSize.value = file.size
      const reader = new FileReader()
      reader.onload = (e) => {
        imageSrc.value = e.target.result
        currentSize.value = getUTF8ByteSizeManual(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}

onMounted(() => {
  document.addEventListener('paste', onPaste)
})
</script>
<style lang="scss" scoped>
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
