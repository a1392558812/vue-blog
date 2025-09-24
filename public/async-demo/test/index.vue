<template>
  <div class="async-view" ref="target">
    <div @click="value1 = value1 + 1">123-{{ value1 }}</div>
    <comp1></comp1>
    <comp2></comp2>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import comp1 from './components/comp-1/index.vue'
import comp2 from './components/comp-2/index.vue'
const target = ref(null)
const value1 = ref(1)
</script>
<style scoped lang="scss">
$color: rgba(248, 223, 253, 0.5);

.async-view {
  width: 100%;
  min-height: 100vh;
  background: $color;
}
</style>