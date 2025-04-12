<template>
  <div class="relative w-[100%] h-[100%] flex flex-row">
    <div class="w-[100%] h-[100%] overflow-y-auto">
      <div class="relative flex flex-col items-center justify-center model-wrap">
        <model1 style="margin-bottom: 30px"></model1>
        <model2></model2>
      </div>
    </div>
  </div>
</template>
<script setup>
import model1 from './components/model1.vue'
import model2 from './components/model2.vue'

defineOptions({ name: 'view-demo-bingdwendwen' })
</script>
<style scoped lang="scss">
.model-wrap {
  padding-top: 80px;
}
</style>
