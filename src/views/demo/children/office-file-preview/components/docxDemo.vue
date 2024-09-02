<template>
  <PreviewWrapper
    accept=".docx"
    placeholder="请输入docx文件地址"
    :default-src="`${baseUrl}demo-static/excel-preview-edit/mock-file/01test.docx`"
  >
    <template v-slot="slotProps">
      <VueOfficeDocx :src="slotProps.src" style="flex: 1; height: 0" />
    </template>
  </PreviewWrapper>
</template>
<script setup>
import VueOfficeDocx from '@vue-office/docx'
import PreviewWrapper from './previewWrapper.vue'
import '@vue-office/docx/lib/index.css'

defineOptions({ name: 'office-file-preview-docx' })

defineProps({
  baseUrl: String
})
</script>

<style scoped>
.operate-area {
  display: flex;
  margin: 10px;
  align-items: center;
}
</style>
