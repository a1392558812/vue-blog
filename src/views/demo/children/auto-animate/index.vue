<template>
  <div class="flex flex-direction-column align-items-center justify-content-center">
    <div class="title">auto-animate自动过渡动画</div>
    <test1 style="margin-bottom: 20px; width: 500px" />
    <test2 style="margin-bottom: 20px; width: 500px" />
    <test3 style="margin-bottom: 20px; width: 500px" />
  </div>
</template>
<script setup>
import test1 from './components/test1.vue'
import test2 from './components/test2.vue'
import test3 from './components/test3.vue'

defineOptions({ name: 'view-demo-auto-animate' })
</script>
<style scoped lang="scss">
.title {
  font-size: 16px;
  padding: 10px 20px;
}
</style>
