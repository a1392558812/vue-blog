<template>
  <div class="load-vue-file">
    <!-- 标题区域 -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg mb-6 shadow-md">
      远程加载vue文件演示,请求内容可打开F12控制台[网络]查看
    </div>

    <!-- 组件内容区域 -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- 父组件控制区 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex-1">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">父组件</h3>

        <!-- 输入区域 -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">在此输入传入远程组件的值：</label>
          <input v-model="inputValue"
            class="box-content w-[calc(100%-20px*2)] px-[20px] py-2 border-2 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="请输入要传递的值..." />
        </div>

        <!-- 输出区域 -->
        <div class="bg-white p-3 rounded-lg border border-gray-200">
          <p class="text-gray-700">此处显示子组件emit的值：</p>
          <p class="text-lg font-semibold text-indigo-600 mt-1">{{ emitValue || '暂无数据' }}</p>
        </div>
      </div>

      <!-- 远程加载子组件区 -->
      <div class="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 flex-1">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">远程加载的子组件</h3>

        <!-- 组件显示区域 -->
        <div class="bg-white p-6 rounded-lg border border-gray-200 min-h-[150px] flex items-center justify-center">
          <component :is="'customComponent'" :inputValue="inputValue" @loadFileValue="loadFileValue" v-if="isLoading">
          </component>
          <div v-else class="text-gray-500">加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'
import notFind from './404.vue'

import { baseUrlFun } from '@/common/util/methods.js'
import axios from 'axios'

export default {
  name: 'load-vue-file-load-file',
  components: {
    customComponent: Vue.defineAsyncComponent(() => {
      const result = loadModule('demo-static/load-vue-file/myComponent.vue', {
        moduleCache: {
          vue: Vue
        },
        getFile(url) {
          return new Promise((resolve, reject) => {
            const fileUrl = baseUrlFun() + url
            axios
              .get(fileUrl)
              .then((res) => {
                resolve(res.data)
              })
              .catch((err) => {
                resolve(err)
              })
          })
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
        compiledCache: {
          set(key, str) {
            // naive storage space management
            for (; ;) {
              try {
                // doc: https://developer.mozilla.org/en-US/docs/Web/API/Storage
                window.localStorage.setItem(key, str)
                break
              } catch (ex) {
                // handle: Uncaught DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'XXX' exceeded the quota
                window.localStorage.removeItem(window.localStorage.key(0))
              }
            }
          },
          get(key) {
            return window.localStorage.getItem(key)
          }
        },
        // 自定义处理模块
        handleModule(type, source, path, options) {
          if (source && source()) {
            if (type === '.vue') {
              return Promise.resolve(options.moduleCache[options.path])
            }
          }
          return notFind
        }
      })
      return result
    })
  },
  setup() {
    const inputValue = Vue.ref('')
    const emitValue = Vue.ref('')
    const isLoading = Vue.ref(true)

    return {
      inputValue,
      emitValue,
      isLoading,
      loadFileValue: (val) => {
        emitValue.value = val
      }
    }
  }
}
</script>
<style scoped lang="scss">
.load-vue-file {
  font-size: 16px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* 组件加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content {
  padding: 10px;
  border: 1px solid #000;
  margin-bottom: 10px;
}
</style>
