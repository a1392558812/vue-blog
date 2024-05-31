<template>
  <div class="relative width100 height100 flex flex-direction-row">
    <div class="width100 height100 overflow-y-auto">
      <div class="relative flex flex-direction-column align-items-center justify-content-center model-wrap">
        <model1 style="margin-bottom: 30px"></model1>
        <model2></model2>
      </div>
    </div>
  </div>
</template>
<script setup>
import model1 from './components/model1.vue'
import model2 from './components/model2.vue'
</script>
<style scoped lang="scss">
.model-wrap{
  padding-top: 80px;
}
</style>
