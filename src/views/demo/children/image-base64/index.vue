<template>
  <div class="flex items-center justify-center gap-[20px]">
    <div class="w-[600px] h-[600px] border-[1px] border-solid border-[#000]">
      <img v-if="imageSrc" :src="imageSrc" alt="" class="w-full h-[500px] object-contain" />
      <button v-if="imageSrc" @click="uploadClick">换一张</button>
      <div>
        <div>支持粘贴图片，支持点击选择图片</div>
        <input
          ref="uploadRef"
          v-show="!imageSrc"
          type="file"
          accept="image/*"
          @change="onUploadImage"
        />
      </div>
    </div>
    <div
      class="w-[600px] h-[600px] border-[1px] border-solid border-[#000] flex flex-col justify-center gap-[20px]"
    >
      <div class="w-full h-[500px] break-all overflow-auto">{{ imageSrc }}</div>
      <div>
        <button class="h-[25px] mb-[10px]" @click="onCopy">全部复制</button>
        <div class="h-[25px]">原先size: {{ originSize }}</div>
        <div class="h-[25px]">当前size: {{ currentSize }}</div>
      </div>
    </div>
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
<style lang="scss" scoped></style>
