<template>
  <div class="box-content h-[100%-20px*2] overflow-auto bg-gradient-to-br from-blue-50 to-violet-50 p-[20px]">
    <!-- 沙箱容器 -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <!-- 工具栏 -->
        <div
          class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-100 to-violet-100 border-b border-blue-200">
          <div class="flex items-center space-x-2">
            <div class="h-3 w-3 rounded-full bg-red-500"></div>
            <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div class="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div class="text-sm text-gray-600">支持: Vue 3, VueUse</div>
          <div class="text-sm text-gray-600">playground2</div>
        </div>

        <!-- 代码编辑器 -->
        <div class="playground2 overflow-auto">
          <codeEdit mode="edit" v-model:imports="imports" v-model:templateValue="templateValue"
            v-model:cssValue="cssValue" v-model:scriptValue="scriptValue"></codeEdit>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { baseUrlFun } from '@/common/util/methods.js'
import codeEdit from './components/playground2-plane/index.vue'

defineOptions({ name: 'view-demo-playground2' })

const baseUrl = baseUrlFun()

const imports = ref({
  vue: baseUrl + 'demo-static/playground-plane/vue@3.4.27/dist/vue.esm-browser.js',
  'vue-demi': baseUrl + 'demo-static/playground-plane/vue-demi/lib/index.mjs',
  '@vueuse/core': baseUrl + 'demo-static/playground-plane/@vueuse/core@10.1.0/index.mjs',
  '@vueuse/shared': baseUrl + 'demo-static/playground-plane/@vueuse/shared@10.1.0/index.mjs'
})

const templateValue = ref(`<div>
    <div class="test-box" @click="handleClick">
        点击我 --> num: {{ num }}
    </div>
    <div ref="target" class="">
        <div>鼠标位置检测</div>
        <div>x: {{ x.toFixed(2) }}</div>
        <div>y: {{ y.toFixed(2) }}</div>
        <div>isOutside: {{ isOutside }}</div>
    </div>
</div>`)

const cssValue = ref(`.test-box {
  transition: all 0.3s ease;
}

.test-box:hover {
  transform: translateY(-2px);
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.7);
}`)

const scriptValue = ref(`import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  setup() {
    const num = ref(1)
    const target = ref(null)
    const { x, y, isOutside } = useMouseInElement(target)
    const handleClick = () => {
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
  width: 100%;
  height: calc(100vh - 120px);
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.7);
}
</style>
