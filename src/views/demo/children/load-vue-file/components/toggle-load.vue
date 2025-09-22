<template>
  <div class="toggle-load">
    <!-- 标题区域 -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg mb-6 shadow-md">
      模块切换演示
    </div>

    <!-- 输入区域 -->
    <div class="space-y-6">
      <!-- A组件输入 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">请编辑a组件内容:</h3>
        <textarea
          class="w-[calc(100%-20px*2)] box-content h-[120px] px-[20px] py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white resize-none"
          v-model="inputValue1"></textarea>
      </div>

      <!-- B组件输入 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">请编辑b组件内容:</h3>
        <textarea
          class="w-[calc(100%-20px*2)] box-content h-[120px] px-[20px] py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white resize-none"
          v-model="inputValue2"></textarea>
      </div>

      <!-- 操作区域 -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">组件预览</h3>

        <div v-if="ifShowComponents" class="space-y-4">
          <!-- 切换按钮 -->
          <button @click="toggleCurrentComponent"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md">
            切换组件 (当前: {{ currentComponent.toUpperCase() }})
          </button>

          <!-- 当前组件信息 -->
          <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p class="text-gray-700">当前dynamic component: 【<span class="font-semibold text-indigo-600">{{
              currentComponent }}</span>】</p>
          </div>

          <!-- 组件预览区域 -->
          <div
            class="min-h-[120px] bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-center justify-center transition-all duration-300"
            :key="currentComponent">
            <component :is="comp" v-if="isLoading" class="w-full"></component>
            <div v-else class="text-center text-gray-500">加载中...</div>
          </div>
        </div>

        <!-- 生成组件按钮 -->
        <div v-else class="text-center py-6">
          <p class="mb-4 text-gray-600">编写完点击生成</p>
          <button @click="generateComponents"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
            生成组件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'
export default {
  name: 'load-vue-file-toggle-load',
  setup() {
    const currentComponent = Vue.ref('a')
    const inputValue1 = Vue.ref(
      '<template><div class="test-a">a组件字符串内容</div></template><style scoped>.test-a{ color: red; font-size: 18px; padding: 20px; border: 2px solid red; border-radius: 8px; text-align: center; }</style>'
    )
    const inputValue2 = Vue.ref(
      '<template><div class="test-b">b组件字符串内容</div></template><style scoped>.test-b{ color: green; font-size: 18px; padding: 20px; border: 2px solid green; border-radius: 8px; text-align: center; }</style>'
    )
    const isLoading = Vue.ref(true)

    const comp = Vue.computed(() => {
      const loadUrl = `/${currentComponent.value}.vue` // hack写法，否则无法进行响应式
      const result = Vue.defineAsyncComponent(() =>
        loadModule(loadUrl, {
          moduleCache: {
            vue: Vue
          },
          getFile(url) {
            return (
              {
                '/a.vue': inputValue1.value,
                '/b.vue': inputValue2.value
              }[url] || Promise.reject(new Error('error status'))
            )
          },
          addStyle(textContent) {
            const style = Object.assign(document.createElement('style'), { textContent })
            const ref = document.head.getElementsByTagName('style')[0] || null
            document.head.insertBefore(style, ref)
          }
        })
      )
      return result
    })

    const toggleCurrentComponent = () => {
      isLoading.value = false
      setTimeout(() => {
        currentComponent.value = currentComponent.value === 'a' ? 'b' : 'a'
        isLoading.value = true
      }, 100)
    }

    const generateComponents = () => {
      ifShowComponents.value = true
    }

    const ifShowComponents = Vue.ref(false)

    return {
      toggleCurrentComponent,
      currentComponent,
      inputValue1,
      inputValue2,
      ifShowComponents,
      generateComponents,
      comp,
      isLoading
    }
  }
}
</script>
<style scoped lang="scss">
.toggle-load {
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
