<template>
    <div class="load-string">
        <div :style="{ fontWeight: 'bold', color: '#FB7299' }" class="content">在线字符串解析为vue模板演示</div>
        <button v-if="!refreshinput" class="display-block" @click="createRender">在下方textarea输入<i style="color: red">***.vue格式</i>代码,点击生成组件</button>
        <textarea v-if="!refreshinput" class="display-block textarea" v-model="inputTemplate"></textarea>
        <div>
            <component v-if="refreshinput" :is="'customComponent'"></component>
        </div>
    </div>
</template>
<script>
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'
import errorString from './error-string.vue'

const templateStr = '<template>' +
    '\n' + '    <div>test-demo</div>' + '\n' +
'</template>' +
'\n' +
'<script>' +
'\n' +
"import { ref } from 'vue'" +
'\n' +
'export default {' +
'\n' + '\n' +
'}' +
'\n' +
'<style scoped>' +
'\n' +
'\n' +
'</style>'

let inputValue = ''
export default {
  components: {
    customComponent: Vue.defineAsyncComponent(() => {
      const result = loadModule('myStringComponent.vue', {
        moduleCache: {
          vue: Vue
        },
        getFile () {
          return Promise.resolve(inputValue)
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
        // 自定义处理模块
        handleModule (type, source, path, options) {
          source().then(() => {
            options.moduleCache[path].promise.then(moduleCacheRes => {
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
      result.then(res => { console.log('完成解析', res) })
      return result
    })
  },
  setup (props, { emit }) {
    const inputTemplate = Vue.ref(templateStr)
    const refreshinput = Vue.ref(false)
    return {
      inputTemplate,
      refreshinput,
      createRender: () => {
        inputValue = inputTemplate.value
        refreshinput.value = true
      }
    }
  }
}
</script>
<style scoped lang="scss">
.load-string{
    width: 550px;
    padding: 10px;
    border: 1px solid #000;
    font-size: 16px;
    margin-bottom: 20px;
}
.content{
    padding: 10px;
    border: 1px solid #000;
    margin-bottom: 10px;
}

.textarea{
    padding: 10px;
    width: 500px;
    height: 200px;
    resize: none;
}
</style>
