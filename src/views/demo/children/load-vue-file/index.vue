<template>
  <div class="box-content h-[calc(100vh-40px*2)] py-[40px] overflow-auto bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="max-w-7xl mx-auto">
      <!-- 组件容器 -->
      <div class="space-y-12">
        <loadFile class="bg-white rounded-xl shadow-lg p-6" />
        <loadString class="bg-white rounded-xl shadow-lg p-6" />
        <toggleLoad class="bg-white rounded-xl shadow-lg p-6" />
        <nestedComponents class="bg-white rounded-xl shadow-lg p-6" />
      </div>
    </div>
  </div>
</template>
<script setup>
import loadFile from './components/load-file.vue'
import loadString from './components/load-string.vue'
import toggleLoad from './components/toggle-load.vue'
import nestedComponents from './components/nested-components.vue'

defineOptions({ name: 'view-demo-load-vue-file' })
</script>
<style scoped lang="scss">
/* 自定义滚动条样式 */
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
  background: #a1a1a1;
}
</style>
