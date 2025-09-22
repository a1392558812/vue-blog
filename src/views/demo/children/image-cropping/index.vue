<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center">
    <div class=" mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">图片裁剪工具</h1>
        <div class="flex items-center mb-8">
          <span class="text-gray-600 mr-4">选择一张图片</span>
          <label
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer">
            上传图片
            <input type="file" accept="image/*" @change="onSelectFile" class="hidden" />
          </label>
        </div>
        <imageCropper v-model:fileList="fileList" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import imageCropper from './components/cropping/index.vue'

const fileList = ref([])

const onSelectFile = (e) => {
  const file = e.target.files[0]
  const type = file.type.split('/')[0]
  if (type !== 'image') return
  fileList.value.forEach((item) => {
    window.URL.revokeObjectURL(item)
  })
  fileList.value = [
    {
      path: window.URL.createObjectURL(file),
      type: file.type
    }
  ]
}
</script>
<style lang="scss" scoped></style>