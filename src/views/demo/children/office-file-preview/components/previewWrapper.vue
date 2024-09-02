<template>
  <div class="preview-wrapper">
    <div class="operate-area">
      <div style="margin-right: 10px">
        <button v-if="type === 'upload'" value="url" @click="type = 'url'">远程文件地址</button>
        <button v-if="type === 'url'" value="upload" @click="type = 'upload'">上传本地文件</button>
      </div>
      <div v-if="type === 'url'">
        <input
          v-model="inputSrc"
          :placeholder="props.placeholder"
          style="width: 600px; margin-left: 10px"
        />
        <button type="primary" style="margin-left: 10px" @click="src = inputSrc">预览</button>
      </div>
      <div v-if="type !== 'url'">
        <input :accept="accept" type="file" @change="beforeUpload" />
      </div>
    </div>
    <slot :src="src"></slot>
  </div>
</template>

<script setup>
import usePreview from '@/hook/office-file-preview/usePreview.js'

defineOptions({ name: 'office-file-preview-preview-wrapper' })

const props = defineProps({
  accept: String,
  placeholder: String,
  defaultSrc: String
})

const { type, inputSrc, src, beforeUpload } = usePreview(props.defaultSrc)
</script>

<style scoped>
.preview-wrapper {
  min-height: 600px;
  display: flex;
  flex-direction: column;
}
.operate-area {
  display: flex;
  margin: 10px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
