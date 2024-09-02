<template>
  <PreviewWrapper
    accept=".pdf"
    placeholder="请输入pdf文件地址"
    :default-src="`${baseUrl}demo-static/excel-preview-edit/mock-file/01test.pdf`"
  >
    <template v-slot="slotProps">
      <VueOfficePdf :src="slotProps.src" style="flex: 1; height: 0" />
    </template>
  </PreviewWrapper>
</template>
<script setup>
import VueOfficePdf from '@vue-office/pdf'
import PreviewWrapper from './previewWrapper.vue'

defineOptions({ name: 'office-file-preview-pdf' })

defineProps({
  baseUrl: String
})
</script>

<style scoped></style>
