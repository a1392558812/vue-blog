<template>
  <div class="async-view" ref="target">
    <div @click="value1 = value1 + 1">123-{{ value1 }}</div>
    <div v-for="item in fileList" :key="item.path">
      <markdownComponent :text="computedContent(item)" />
    </div>
    <comp1></comp1>
    <comp2></comp2>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import comp1 from './components/comp-1/index.vue'
import comp2 from './components/comp-2/index.vue'

const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  },
  markdownComponent: {
    type: Function,
    default: () => { }
  }
})

const markdownComponent = props.markdownComponent()


const target = ref(null)
const value1 = ref(1)
const computedContent = computed(() => (item) => {
  return `
  👉 ${item.path}
  ${'```' + item.suffix + '\n' + item.content + '\n' + '```'}
  `
})
</script>

<style>
.async-view {
  width: 100%;
}
</style>

<style scoped>
.async-view {
  width: 100%;
}
</style>

<style scoped lang="scss">
@use './async-demo/static/scss/theme.scss';

.async-view {
  width: 100%;
  min-height: 100vh;
  color: $color;
  background: #fff;
}
</style>