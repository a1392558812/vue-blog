<template>
  <div>
    <component :is="customComponent" :fileList="fileList" :markdownComponent="markdownComponent" />
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
import { isArray, isObject } from '@/common/util/typeCheck'

defineOptions({
  name: 'async-view'
})

const useRouteStore = useRoute()
let path = useRouteStore.path.split('/demo')[1]
path = path.split('/')[1]

/**
 * interface {
 *   path: string,
 *   suffix: string,
 *   content: string
 * }
 */
const fileList = Vue.ref([])

console.log('useRouteStore', path)

/**
* 处理字符串中的SCSS样式标签，执行回调并移除lang="scss"属性
* @param {string} vueString - 包含style标签的字符串
* @param {Function} callback - 处理样式内容的回调函数，接收参数: content(内容), isScoped(是否scoped), index(索引)
* @returns {string} 处理后的字符串
* @throws {Error} 如果第一个参数不是字符串或第二个参数不是函数，则抛出错误
*/
const processScssStyles = async (vueString, callback) => {

  if (typeof vueString !== 'string' || typeof callback !== 'function') {
    throw new Error('第一个参数必须是字符串，第二个参数必须是函数');
  }

  const scssStyleRegex = /<style\s+(?=(?:[^>]*?\s+)?lang\s*=\s*"scss")([\s\S]*?)>([\s\S]*?)<\/style>/gi;
  const useUrlRegex = /@use\s+(?:url\s*\(\s*["']([^"']+)['"]\s*\)|["']([^"']+)["'])/gi;

  let result = vueString;
  let match;
  let index = 0;
  const matches = [];

  while ((match = scssStyleRegex.exec(vueString)) !== null) {
    // 提取属性部分并清理
    let attrs = match[1].trim();
    // 判断是否包含scoped属性（忽略中间的注释和空格）
    const isScoped = /\bscoped\b/.test(attrs.replace(/\/\*[\s\S]*?\*\//g, ''));

    // 移除lang="scss"属性（包括可能的空格和引号变化）
    const cleanedAttrs = attrs
      .replace(/lang\s*=\s*"scss"\s*/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    matches.push({
      fullMatch: match[0],
      originalAttrs: attrs,
      cleanedAttrs: cleanedAttrs,
      content: match[2],
      isScoped: isScoped,
      index: match.index,
      length: match[0].length
    });
  }

  // 反向处理匹配结果，避免替换后索引偏移
  for (let i = matches.length - 1; i >= 0; i--) {
    const { fullMatch, cleanedAttrs, content, isScoped, index: matchIndex } = matches[i];
    let resContent = content

    if (useUrlRegex.test(content)) {
      const url = content.match(useUrlRegex)[0].split('@use')[1].trim().replace(/["']/g, '')
      console.log('url', url)
      if (url) {
        const res = await axios.get(url)
        fileList.value.push({
          path: url,
          suffix: 'scss',
          content: res.data
        })
        resContent = content.replace(useUrlRegex, res.data)
      }
    }

    console.log('resContent', resContent)
    const processedContent = callback(resContent, isScoped, index);
    index++;

    const newStyleTag = cleanedAttrs
      ? `<style ${cleanedAttrs}>${processedContent}</style>`
      : `<style>${processedContent}</style>`;

    result = result.substring(0, matchIndex) +
      newStyleTag +
      result.substring(matchIndex + fullMatch.length);
  }
  console.log('result', result)
  return result;
}

const getFileErrorContentTemplate = (title, errorMessage) => `
<template>
  <div style="background: rgba(0, 0, 0, 0.7); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 30px; color: red; word-break: break-all; padding: 0 60px;">
    <div>${title}</div>
    <div>${errorMessage}</div>
  </div>
</template>
`
const getVueFile = () => {
  return loadModule(`./async-demo/${path}/index.vue`, {
    moduleCache: {
      vue: Vue
    },
    getFile(url) {
      return new Promise((resolve, reject) => {
        axios.get(url).then((res) => {
          let processScssStylesResultFlag = true
          let errorMessage = ''
          console.log('res.data', url, res.data)
          fileList.value.push({
            path: url,
            suffix: 'html',
            content: res.data
          })
          if (res.data) {
            return processScssStyles(res.data, (content, isScoped, index) => {
              try {
                const cssStr = compileString(content, { style: 'expanded' })
                if (cssStr.css) {
                  processScssStylesResultFlag = true
                  return cssStr.css
                }

                processScssStylesResultFlag = false
                errorMessage = 'scss编译失败为空'
                return ''

              } catch (error) {
                console.error('compileString', error)
                processScssStylesResultFlag = false
                errorMessage = (isArray(error) || isObject(error)) ? JSON.stringify(error) : error
                return ''
              }
            }).then((vueContent) => {
              vueContent = processScssStylesResultFlag ? vueContent : getFileErrorContentTemplate('scss编译失败', errorMessage)
              console.log('vueContent', vueContent)
              resolve(vueContent)
            }).catch((err) => {
              console.error('processScssStyles-error', err)
              const content = getFileErrorContentTemplate('解析编译失败', (isArray(err) || isObject(err)) ? JSON.stringify(err) : err)
              resolve(content)
            })
          }

          reject(res)
        }).catch((err) => {
          console.error('res', err)
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
        console.error('✍✍error ---> args', ...args)
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

const markdownComponent = () => Vue.defineAsyncComponent(() => import('@/components/v-md-preview/index.jsx'))

</script>
<style lang="scss">
html,
body,
#app,
#page {
  overflow: auto;
  padding: 0;
  margin: 0;
  height: auto;
}
</style>