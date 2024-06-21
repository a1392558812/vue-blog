<template>
    <div class="playground2 overflow-auto">
        <codeEdit mode="edit" v-model:imports="imports" v-model:templateValue="templateValue" v-model:cssValue="cssValue" v-model:scriptValue="scriptValue"></codeEdit>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { baseUrlFun } from '@/common/methods.js'
import codeEdit from './components/playground2-plane/index.vue'

const baseUrl = baseUrlFun()

const imports = ref({
  vue: baseUrl + 'demo-static/playground-plane/vue@3.4.27/dist/vue.esm-browser.js',
  'vue-demi': baseUrl + 'demo-static/playground-plane/vue-demi/lib/index.mjs',
  '@vueuse/core': baseUrl + 'demo-static/playground-plane/@vueuse/core@10.1.0/index.mjs',
  '@vueuse/shared': baseUrl + 'demo-static/playground-plane/@vueuse/shared@10.1.0/index.mjs'
})
const templateValue = ref(`<div>
    <div class="test-box" @click="handleClick">一个简单的沙箱环境--->num: {{ num }}</div>
    <div ref="target" style="width: 200px; height: 200px; border: 1px solid #000">
        <div>x: {{x}}</div>
        <div>y: {{y}}</div>
        <div>isOutside: {{isOutside}}</div>
    </div>
</div>`)
const cssValue = ref(`.test-box {
  border: 1px solid #eee;
  padding: 10px 20px;
  background: pink;
  border-radius: 10px;
  cursor: pointer;
}`)

const scriptValue = ref(`import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  setup() {
    const num = ref(1)
    const target = ref(null)
    const { x, y, isOutside } = useMouseInElement(target)
    const handleClick = () => {
      console.log('handleClick')
      num.value = num.value + 1
    }
    return {
      handleClick,
      num,
      target,
      x,
      y,
      isOutside
    }
  }
}`)
</script>
<style scoped>
.playground2 {
    width: 100vw;
    height: 100vh;
}
</style>
