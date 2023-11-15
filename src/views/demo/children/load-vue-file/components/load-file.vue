<template>
    <div class="load-vue-file">
        <div :style="{ fontWeight: 'bold', color: '#FB7299' }" class="content">远程加载vue文件演示,请求内容可打开F12控制台[网络]看</div>
        <div class="flex align-items-center justify-content-center">
            <div class="content" style="margin-right: 20px">
                <div>父组件</div>
                <div>在此输入传入远程组件的值：<input style="padding: 5px 10px" v-model="inputValue"/></div>
                <div>此处显示子组件emit的值： {{ emitValue }}</div>
            </div>
            <div class="content">
                <div>远程加载的子组件</div>
                <component :is="'customComponent'" :inputValue="inputValue" @loadFileValue="loadFileValue"></component>
            </div>
        </div>
    </div>
</template>

<script>
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'
import notFind from './404.vue'

import { baseUrlFun } from '@/common/methods.js'
import axios from 'axios'

export default {
  components: {
    customComponent: Vue.defineAsyncComponent(() => {
      const result = loadModule('demo-static/load-vue-file/myComponent.vue', {
        moduleCache: {
          vue: Vue
        },
        getFile (url) {
          return new Promise((resolve, reject) => {
            const fileUrl = baseUrlFun() + url
            axios.get(fileUrl).then(res => {
              resolve(res.data)
            }).catch(err => {
              resolve(err)
            })
          })
        },
        addStyle (textContent) {
          const style = Object.assign(document.createElement('style'), { textContent })
          const ref = document.head.getElementsByTagName('style')[0] || null
          document.head.insertBefore(style, ref)
        },
        log (type, ...args) {
          if (type === 'error') {
            console.log('✍✍error ---> args', ...args)
            alert('组件解析发生意外，请打开控制台查看')
          }
        },
        compiledCache: {
          set (key, str) {
            // naive storage space management
            for (;;) {
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
          get (key) {
            return window.localStorage.getItem(key)
          }
        },
        // 自定义处理模块
        handleModule (type, source, path, options) {
          if (source && source()) {
            if (type === '.vue') {
              return Promise.resolve(options.moduleCache[options.path])
            }
          }
          return notFind
        }
      })
      console.log('result', result.then(res => { console.log('res', res) }))
      return result
    })
  },
  setup () {
    const inputValue = Vue.ref('')
    const emitValue = Vue.ref('')
    return {
      inputValue,
      emitValue,
      loadFileValue: (val) => {
        emitValue.value = val
      }
    }
  }
}
</script>
<style scoped lang="scss">
.load-vue-file{
    font-size: 16px;
    width: 400px;
}
.content{
    padding: 10px;
    border: 1px solid #000;
    margin-bottom: 10px;
}
</style>
