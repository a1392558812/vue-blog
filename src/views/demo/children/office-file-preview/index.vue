<template>
  <div class="office-file-preview">
    <tabs :tabsList="[{ title: '预览docx' }, { title: '预览excel' }, { title: '预览pdf' }]">
      <DocxDemo :baseUrl="baseUrl"></DocxDemo>
      <ExcelDemo :baseUrl="baseUrl"></ExcelDemo>
      <PdfDemo :baseUrl="baseUrl"></PdfDemo>
    </tabs>
  </div>
</template>

<script>
import DocxDemo from './components/docxDemo.vue'
import ExcelDemo from './components/excelDemo.vue'
import PdfDemo from './components/pdfDemo.vue'
import tabs from './components/tabs.vue'
import { baseUrlFun } from '@/common/util/methods.js'
export default {
  name: 'view-demo-office-file-preview',
  components: {
    tabs,
    DocxDemo,
    ExcelDemo,
    PdfDemo
  },
  setup() {
    return {
      baseUrl: baseUrlFun()
    }
  }
}
</script>

<style lang="scss" scoped>
.office-file-preview {
  height: 100vh;
}
</style>
