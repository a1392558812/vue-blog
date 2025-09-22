<template>
  <div class="play-ground h-screen bg-gradient-to-br from-blue-50 to-violet-50 p-4 overflow-auto">
    <!-- 主容器 -->
    <div class="mx-auto" :style="{ width: `${1200 + varianceWidth}px` }">
      <!-- 标题区域 -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
          代码块演示厂
        </h1>
        <p class="text-gray-600 mt-2">Vue 组件在线编辑与预览环境</p>
      </div>

      <!-- 控制面板 -->
      <div
        class="flex flex-col items-center bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
        <div class="mb-4 text-gray-700">目前已支持vueuse，可调试查看Import Map</div>

        <div class="mb-2 font-medium text-gray-700">演示框尺寸</div>

        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <div class="flex items-center gap-2 flex-1">
            <label class="text-sm text-gray-600 min-w-[50px]">增宽:</label>
            <input type="number" v-model="varianceWidth"
              class="flex-1 px-3 py-2 border-2 border-solid border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center"
              placeholder="0" />
            <span class="text-sm text-gray-500">px</span>
          </div>

          <div class="flex items-center gap-2 flex-1">
            <label class="text-sm text-gray-600 min-w-[50px]">增高:</label>
            <input type="number" v-model="varianceHeight"
              class="flex-1 px-3 py-2 border-2 border-solid border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center"
              placeholder="0" />
            <span class="text-sm text-gray-500">px</span>
          </div>
        </div>
      </div>

      <!-- 代码编辑区域 -->
      <div class="rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl"
        :style="{ width: `${1200 + varianceWidth}px`, height: `${550 + varianceHeight}px` }">
        <!-- 代码编辑器组件 -->
        <playground-plane :defaultTemplate="defaultTemplate" :defaultNewSFC="defaultNewSFC"
          :componentsFiles="componentsFiles" playGroundPlaneWidth="100%" playGroundPlaneReplHeight="100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'

const defaultTemplate = '<template/>'

const defaultNewSFC =
  `<template></template>
<script setup lang="ts">

</` +
  `script>
<style>
</style>`

const file1 =
  `<template>
  <div class="youyuxi bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-lg shadow-md">
       <div class="flex items-center gap-2 mb-3">
         <i class="inline-block w-5 h-5 i-carbon-logo-github"></i>
         集成unocss
       </div>
       <test1 class="mb-3"/>
       <test2 class="mb-3"/>
       <test3 class="mb-3"/>
       <div class="font-medium mb-2">{{ msg }}</div>
       <div @click="count = count + 1.1" class="cursor-pointer hover:underline transition-all">
         (点击颂歌<span style="color: #fffb96">{{ count }}</span>次)
       </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Ref } from "vue"
import test1 from "./test1.vue"
import test2 from "./test2.vue"
import test3 from "./test3.vue"
const count:Ref<number> = ref(1)
const msg = ref("🥵赞美尤雨溪，赐予我们伟大的Vue")

</` +
  `script>

<style>
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>`

const file2 =
  `<template>
  <div @click="count++" class="p-2 bg-blue-100 hover:bg-blue-200 transition-colors rounded cursor-pointer">
    点击加1,当前为：{{ count }}
  </div>
</template>
<script setup>
import { ref } from "vue"
const count = ref(1)
</` + 'script>'

const file3 = '<template><div class="text-pink-500 font-medium">这个是test1组件</div></template>\n'

const file4 =
  `<template>
    <div>
        <div ref="target" class="w-[400px] h-[200px] border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div class="font-medium text-blue-800 mb-2">vueuse使用演示，目前版本控制于@10.1.0</div>
            <div class="text-sm text-gray-700">x: {{ x.toFixed(2) }}</div>
            <div class="text-sm text-gray-700">y: {{ y.toFixed(2) }}</div>
            <div class="text-sm text-gray-700">isOutside: {{ isOutside }}</div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  setup() {
    const target = ref(null)
    const { x, y, isOutside } = useMouseInElement(target)
    return {
      target,
      x,
      y,
      isOutside
    }
  }
}
</` +
  `script>
<style></style>`

const componentsFiles = {
  'App.vue': file1,
  'test1.vue': file2,
  'test2.vue': file3,
  'test3.vue': file4
}

export default {
  name: 'view-demo-playground',
  components: {
    playgroundPlane: defineAsyncComponent(() => import('@/components/playground-plane/index.jsx'))
  },
  setup() {
    return {
      varianceWidth: ref(0),
      varianceHeight: ref(0),
      defaultTemplate: ref(defaultTemplate),
      defaultNewSFC: ref(defaultNewSFC),
      componentsFiles: ref(componentsFiles)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-ground {}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.7);
}
</style>
