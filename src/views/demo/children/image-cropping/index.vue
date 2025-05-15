<template>
  <div>
    <div>
      <span class="mr-[20px]">选择一张图片</span>
      <input type="file" accept="image/*" @change="onSelectFile" />
    </div>
    <imageCropper v-model:fileList="fileList" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import imageCropper from './components/cropping/index.vue'

const fileList = ref([])

const onSelectFile = (e) => {
  const file = e.target.files[0]
  console.log('onSelectFile', file)
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
