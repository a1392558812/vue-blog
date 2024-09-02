<template>
  <PreviewWrapper
    accept=".xlsx"
    placeholder="请输入xlsx文件地址"
    :default-src="`${baseUrl}demo-static/excel-preview-edit/mock-file/01test.xlsx`"
  >
    <template v-slot="slotProps">
      <VueOfficeExcel :src="slotProps.src" style="flex: 1; height: 0" />
    </template>
  </PreviewWrapper>
</template>
<script setup>
import VueOfficeExcel from '@vue-office/excel'
import PreviewWrapper from './previewWrapper.vue'
import '@vue-office/excel/lib/index.css'

defineOptions({ name: 'office-file-preview-excel' })

defineProps({
  baseUrl: String
})
</script>

<style scoped></style>
