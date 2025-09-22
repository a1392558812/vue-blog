<template>
  <div class="nested-components">
    <!-- 标题区域 -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg mb-6 shadow-md">
      组件嵌套演示
    </div>

    <!-- 提示信息 -->
    <div class="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-lg mb-6">
      <p>可F12打开控制台查看console内容</p>
    </div>

    <!-- 输入区域 -->
    <div class="space-y-6">
      <!-- Main组件输入 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">请编辑main组件内容:</h3>
        <textarea
          class="w-[calc(100%-20px*2)] box-content h-[120px] px-[20px] py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white resize-none"
          v-model="inputValue1"></textarea>
      </div>

      <!-- Foo组件输入 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">请编辑foo组件内容:</h3>
        <textarea
          class="w-[calc(100%-20px*2)] box-content h-[120px] px-[20px] py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white resize-none"
          v-model="inputValue2"></textarea>
      </div>

      <!-- Bar组件输入 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">请编辑bar组件内容:</h3>
        <textarea
          class="w-[calc(100%-20px*2)] box-content h-[120px] px-[20px] py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white resize-none"
          v-model="inputValue3"></textarea>
      </div>

      <!-- CSS输入 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">请编辑bar组件css内容:</h3>
        <textarea
          class="w-[calc(100%-20px*2)] box-content h-[120px] px-[20px] py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white resize-none"
          v-model="inputValue4"></textarea>
      </div>

      <!-- 操作区域 -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">嵌套组件预览</h3>

        <!-- 生成按钮 -->
        <div v-if="!ifShowComponents" class="text-center py-6">
          <p class="mb-4 text-gray-600">编写完点击生成</p>
          <button @click="generateComponents"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
            生成组件
          </button>
        </div>

        <!-- 组件预览 -->
        <div v-else class="min-h-[300px] bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div class="bg-white p-1 rounded-lg border border-gray-200 shadow-sm mb-4 inline-block">
            <span class="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-md">嵌套组件结构: Main &gt; Foo &gt;
              Bar</span>
          </div>

          <div class="transition-all duration-500" :key="componentKey">
            <component :is="comp" v-if="isLoading"></component>
            <div v-else class="text-center text-gray-500 py-10">加载中...</div>
          </div>

          <!-- 重新生成按钮 -->
          <button @click="resetRender"
            class="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all duration-200">
            重新生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'

const input1 =
  '<template><div style="border: 1px solid red; margin: 5px; padding: 5px"><div style="color: red;">这里是main</div><foo/></div></template>' +
  '<script>' +
  'import foo from "./foo.vue";' +
  'export default {' +
  'components: {foo,},created() {console.log("main created")},mounted() {console.log("main mounted")}}' +
  '<' +
  '/script>'
const input2 =
  '<template><div style="border: 1px solid green; margin: 5px; padding: 5px"><div style="color: green;">我是foo组件</div><bar/></div></template>' +
  '<script>' +
  'import bar from "./bar.vue";' +
  'export default {' +
  'components: {bar,},created() {console.log("foo created")},mounted() {console.log("foo mounted")}}' +
  '<' +
  '/script>'
const input3 =
  '<template><div class="bar-comp">bar组件在此</div></template>' +
  '<script>' +
  'import "./style.css";' +
  'export default {' +
  'components: {},created() {console.log("bar created")},mounted() {console.log("bar mounted")}}' +
  '<' +
  '/script>'
const styleCss = '.bar-comp { color: blue; border: 2px solid blue; margin: 10px; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; }'

export default {
  name: 'load-vue-file-nested-components',
  setup() {
    const inputValue1 = Vue.ref(input1)
    const inputValue2 = Vue.ref(input2)
    const inputValue3 = Vue.ref(input3)
    const inputValue4 = Vue.ref(styleCss)
    const ifShowComponents = Vue.ref(false)
    const isLoading = Vue.ref(true)
    const componentKey = Vue.ref(0)

    const config = Vue.computed(() => {
      return {
        files: {
          '/main.vue': inputValue1.value,
          '/foo.vue': inputValue2.value,
          '/bar.vue': inputValue3.value,
          '/style.css': inputValue4.value
        }
      }
    })

    const comp = Vue.computed(() => {
      const result = Vue.defineAsyncComponent(() =>
        loadModule('/main.vue', {
          moduleCache: {
            vue: Vue
          },
          getFile(url) {
            return config.value.files[url]
          },
          addStyle(textContent) {
            const style = Object.assign(document.createElement('style'), { textContent })
            const ref = document.head.getElementsByTagName('style')[0] || null
            document.head.insertBefore(style, ref)
          },
          handleModule: async function (type, getContentData, path, options) {
            switch (type) {
              case '.css':
                options.addStyle(await getContentData(false))
                return null
            }
          }
        })
      )
      return result
    })

    const generateComponents = () => {
      isLoading.value = false
      setTimeout(() => {
        ifShowComponents.value = true
        isLoading.value = true
        componentKey.value++
      }, 100)
    }

    const resetRender = () => {
      ifShowComponents.value = false
    }

    return {
      inputValue1,
      inputValue2,
      inputValue3,
      inputValue4,
      ifShowComponents,
      comp,
      isLoading,
      componentKey,
      generateComponents,
      resetRender
    }
  }
}
</script>
<style scoped lang="scss">
.nested-components {
  font-size: 16px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* 自定义滚动条样式 */
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
