<template>
  <div class="async-view" ref="target">
    <div @click="onClick">123-{{ value1 }}-{{ state }}</div>

    <button @click="onLoadMarkdown">onLoadMarkdown</button>

    <comp1></comp1>
    <comp2></comp2>

    <template v-if="markdownComponent">
      <div v-for="item in fileList" :key="item.path">
        <markdownComponent :text="computedContent(item)" />
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, computed, shallowRef } from 'vue';
import comp1 from './components/comp-1/index.vue'
import comp2 from './components/comp-2/index.vue'
import { testFunction, useState } from '../static/hooks/index.js'
import { defaultProps } from '../static/hooks/props.js'
const props = defineProps(defaultProps)
const markdownComponent = shallowRef('')

testFunction()

const { state } = useState()

const target = ref(null)
const value1 = ref(1)
const computedContent = computed(() => (item) => {
  return `
  👉 ${item.path}
  ${'```' + item.suffix + '\n' + item.content + '\n' + '```'}
  `
})


const onLoadMarkdown = () => {
  !markdownComponent.value && (markdownComponent.value = props.markdownComponent())
}

const onClick = () => {
  state.value = state.value + 1
  value1.value = (value1.value + 1) % 4
}
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