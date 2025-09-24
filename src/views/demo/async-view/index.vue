<template>
  <div>
    <component :is="customComponent" />
  </div>
</template>
<script setup lang="jsx">
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'
import notFind from '@/views/404/index.vue'
import axios from '@/common/axios/index.js'
import { useRoute } from 'vue-router'
import loading from '@/components/loading/loading.vue'
import { compileString } from 'sass'

defineOptions({
  name: 'async-view'
})

const useRouteStore = useRoute()
let path = useRouteStore.path.split('/demo')[1]
path = path.split('/')[1]

console.log('useRouteStore', path)

/**
* 处理字符串中的SCSS样式标签，执行回调并移除lang="scss"属性
* @param {string} vueString - 包含style标签的字符串
* @param {Function} callback - 处理样式内容的回调函数，接收参数: content(内容), isScoped(是否scoped), index(索引)
* @returns {string} 处理后的字符串
* @throws {Error} 如果第一个参数不是字符串或第二个参数不是函数，则抛出错误
*/
const processScssStyles = (vueString, callback) => {
  if (typeof vueString !== 'string' || typeof callback !== 'function') {
    throw new Error('第一个参数必须是字符串，第二个参数必须是函数');
  }

  const scssStyleRegex = /<style\s+((?:scoped\s+)?)(?:lang="scss"\s*)?>([\s\S]*?)<\/style>/gi;

  let result = vueString;
  let match;
  let index = 0;
  const matches = [];

  // 收集所有匹配结果
  while ((match = scssStyleRegex.exec(vueString)) !== null) {
    matches.push({
      fullMatch: match[0],
      attrs: match[1].trim(), // 提取scoped属性(如果有)
      content: match[2],
      isScoped: match[1].includes('scoped'),
      index: match.index
    });
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const { fullMatch, attrs, content, isScoped } = matches[i];

    const processedContent = callback(content, isScoped, index);
    index++;

    // 构建新的style标签 移除lang="scss"
    const newStyleTag = `<style${attrs ? ` ${attrs}` : ''}>${processedContent}</style>`;

    // 替换原标签
    result = result.substring(0, matches[i].index) +
      newStyleTag +
      result.substring(matches[i].index + fullMatch.length);
  }

  return result;
}

const getVueFile = () => {
  return loadModule(`./async-demo/${path}/index.vue`, {
    moduleCache: {
      vue: Vue
    },
    getFile(url) {
      return new Promise((resolve, reject) => {
        const fileUrl = url
        axios.get(fileUrl).then((res) => {
          const vueContent = processScssStyles(res.data || '', (content, isScoped, index) => {
            const cssStr = compileString(content, { style: 'expanded' })
            console.log('content', { content, isScoped, index, cssStr })
            return compileString(content, { style: 'expanded' }).css || ''
          })
          console.log('res', res.data)
          resolve(vueContent)
        }).catch((err) => {
          reject(err)
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
    // compiledCache: {
    //   set(key, str) {
    //     // naive storage space management
    //     for (; ;) {
    //       try {
    //         // doc: https://developer.mozilla.org/en-US/docs/Web/API/Storage
    //         window.localStorage.setItem(key, str)
    //         break
    //       } catch (ex) {
    //         // handle: Uncaught DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'XXX' exceeded the quota
    //         window.localStorage.removeItem(window.localStorage.key(0))
    //       }
    //     }
    //   },
    //   get(key) {
    //     return window.localStorage.getItem(key)
    //   }
    // },
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
}

const getLoadingFile = () => {
  console.log('getLoadingFile', loading)
  return (<loading showModal={true} style="position: fixed" />)
}

const getErrorFile = () => {
  console.log('getLoadingFile', notFind)
  return (<notFind />)
}

const customComponent = Vue.defineAsyncComponent({
  loader: getVueFile,
  errorComponent: getErrorFile,
  loadingComponent: getLoadingFile
})

</script>
<style lang="scss">
html,
body,
#app,
#page {
  overflow: auto;
  padding: 0;
  margin: 0;
}
</style>