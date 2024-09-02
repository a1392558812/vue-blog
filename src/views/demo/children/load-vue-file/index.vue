<template>
  <div style="height: 100vh" class="overflow-y-auto">
    <div
      style="padding: 100px 0 180px 0"
      class="flex flex-direction-column align-items-center justify-content-center"
    >
      <loadFile style="margin-bottom: 40px" />
      <loadString style="margin-bottom: 40px" />
      <toggleLoad style="margin-bottom: 40px" />
      <nestedComponents style="margin-bottom: 40px" />
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
<style scoped lang="scss"></style>
