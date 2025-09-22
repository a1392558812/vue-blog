<template>
  <div class="load-string">
    <!-- 标题区域 -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg mb-6 shadow-md">
      在线字符串解析为vue模板演示
    </div>

    <!-- 内容区域 -->
    <div class="space-y-6">
      <!-- 初始状态：输入框 -->
      <div v-if="!refreshinput" class="space-y-4">
        <button @click="createRender"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:shadow-lg">
          在下方textarea输入<i style="color: #FFD700">***.vue格式</i>代码,点击生成组件
        </button>

        <div class="relative">
          <textarea v-model="inputTemplate"
            class="box-content w-[calc(100%-20px*2)] px-[20px] h-[250px] py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-3 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-gray-50 resize-none"
            placeholder="请输入Vue组件代码..."></textarea>
          <div class="absolute bottom-3 right-3 text-xs text-gray-500">
            {{ inputTemplate.length }} 字符
          </div>
        </div>
      </div>

      <!-- 结果状态：组件预览 -->
      <div v-else class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">解析结果</h3>
        <div class="min-h-[300px] bg-gray-50 p-6 rounded-lg border border-gray-200">
          <component :is="'customComponent'" v-if="isLoading"></component>
          <div v-else class="text-center text-gray-500">加载中...</div>
        </div>

        <!-- 重新生成按钮 -->
        <button @click="resetRender"
          class="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all duration-200">
          重新生成
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'
import errorString from './error-string.vue'

const templateStr =
  '<template>' +
  '\n' +
  '    <div>test-demo</div>' +
  '\n' +
  '</template>' +
  '\n' +
  '<script>' +
  '\n' +
  "import { ref } from 'vue'" +
  '\n' +
  'export default {' +
  '\n' +
  '\n' +
  '}' +
  '\n' +
  '<style scoped>' +
  '\n' +
  '\n' +
  '</style>'

let inputValue = ''
export default {
  name: 'load-vue-file-load-string',
  components: {
    customComponent: Vue.defineAsyncComponent(() => {
      const result = loadModule('myStringComponent.vue', {
        moduleCache: {
          vue: Vue
        },
        getFile() {
          return Promise.resolve(inputValue)
        },
        addStyle(textContent) {
          const style = Object.assign(document.createElement('style'), { textContent })
          const ref = document.head.getElementsByTagName('style')[0] || null
          document.head.insertBefore(style, ref)
        },
        log(type, ...args) {
          if (type === 'error') {
            console.log('✍✍error ---> args', ...args)
            alert('组件解析发生意外，请打开控制台查看')
          }
        },
        // 自定义处理模块
        handleModule(type, source, path, options) {
          source().then(() => {
            options.moduleCache[path].promise.then((moduleCacheRes) => {
              if (Object.keys(moduleCacheRes).length) {
                return Promise.resolve(moduleCacheRes)
              } else {
                Object.assign(moduleCacheRes, errorString)
                return Promise.resolve(moduleCacheRes)
              }
            })
          })
        }
      })
      return result
    })
  },
  setup(props, { emit }) {
    const inputTemplate = Vue.ref(templateStr)
    const refreshinput = Vue.ref(false)
    const isLoading = Vue.ref(true)

    const createRender = () => {
      inputValue = inputTemplate.value
      refreshinput.value = true
      // 添加加载状态效果
      isLoading.value = false
      setTimeout(() => {
        isLoading.value = true
      }, 100)
    }

    const resetRender = () => {
      refreshinput.value = false
    }

    return {
      inputTemplate,
      refreshinput,
      isLoading,
      createRender,
      resetRender
    }
  }
}
</script>
<style scoped lang="scss">
.load-string {
  width: 100%;
  max-width: 800px;
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

.content {
  padding: 10px;
  border: 1px solid #000;
  margin-bottom: 10px;
}

.textarea {
  padding: 10px;
  width: 500px;
  height: 200px;
  resize: none;
}
</style>
