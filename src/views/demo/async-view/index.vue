<template>
  <div>
    <component :is="customComponent" :fileList="fileList" :markdownComponent="markdownComponent" />
  </div>
</template>
<script setup lang="jsx">
import { loadModule } from 'vue3-sfc-loader'
import * as Vue from 'vue'
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

const errorComponentData = Vue.reactive({
  title: '',
  errorMessage: ''
})

/**
 * interface {
 *   path: string,
 *   suffix: string,
 *   content: string
 * }
 */
const fileList = Vue.ref([])

console.log('useRouteStore', path)

const errorComponent = () => (<div style="background: rgba(0, 0, 0, 0.7); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 30px; color: red; word-break: break-all; padding: 0 60px;">
  <div>{errorComponentData.title}</div>
  <div>{errorComponentData.errorMessage}</div>
</div>)


const getTargetPathFileListIndex = (path) => {
  return fileList.value.findIndex(item => item.path === path)
}

const pushFileList = ({ path, suffix, content }) => {
  const index = getTargetPathFileListIndex(path)
  if (index === -1) {
    fileList.value.push({
      path,
      suffix,
      content
    })
  }
}
const getVueFile = () => {
  return loadModule(`./async-demo/${path}/index.vue`, {
    moduleCache: {
      vue: Vue
    },
    getFile(url) {
      const suffix = url.split('.').pop()
      return new Promise((resolve, reject) => {
        const index = getTargetPathFileListIndex(url)
        console.log('index', index)
        const promise = (index === -1) ? axios.get(url) : Promise.resolve({ data: fileList.value[index].content })

        promise.then((res) => {
          console.log('res.data', { url, data: res.data })
          if (res.data) {
            if (suffix === 'js') {
              pushFileList({
                path: url,
                suffix,
                content: res.data
              })

              return resolve({
                getContentData: (asBinary) => {
                  return res.data;
                },
                type: ".mjs",
              })
            }

            pushFileList({
              path: url,
              suffix: 'html',
              content: res.data
            })
            return resolve(res.data)
          }

          reject(`获取文件失败: ${url}--${res}`)
        })
      })
    },
    async processStyles(cssContent, lang, filename, options) {
      console.log('processStyles', { cssContent, lang, filename, options })
      if (!lang) return cssContent
      if (lang !== 'scss') throw new Error(`不支持该语言${lang}处理器`)

      let content = cssContent
      const useUrlRegex = /@use\s+(?:url\s*\(\s*["']([^"']+)['"]\s*\)|["']([^"']+)["'])/gi;
      const urlList = content.match(useUrlRegex)

      console.log('urlList', urlList)

      if (urlList && urlList.length) {
        let url = urlList[0].split('@use')[1].trim().replace(/["']/g, '')

        if (url) {
          const index = getTargetPathFileListIndex(url)
          let result
          if (index !== -1) {
            result = fileList.value[index].content
          } else {
            const res = await axios.get(url)
            if (!res.data) throw new Error(`获取${url}失败`)
            result = res.data
            pushFileList({
              path: url,
              suffix: 'scss',
              content: res.data
            })
          }
          content = content.replace(useUrlRegex, result)
        }
      }

      const cssStr = compileString(content, { style: 'expanded' })

      if (cssStr.css) {
        return cssStr.css
      }
      throw new Error('scss compile error')
    },
    addStyle(textContent) {
      console.log('addStyle', textContent)
      const style = Object.assign(document.createElement('style'), { textContent })
      const ref = document.head.getElementsByTagName('style')[0] || null
      document.head.insertBefore(style, ref)
    },
    log(type, ...args) {
      console[type](args)
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
    // handleModule(type, source, path, options) {
    //   console.log('handleModule', { type, source, path, options })
    // }
  }).catch((err) => {
    errorComponentData.title = '编译失败'
    errorComponentData.errorMessage = (err instanceof Error) ? err.toString() : String(err)
    console.error('getVueFile-fail', err)
    throw err
  })
}

const getLoadingFile = () => {
  console.log('getLoadingFile', loading)
  return (<loading showModal={true} style="position: fixed" />)
}

const customComponent = Vue.defineAsyncComponent({
  loader: getVueFile,
  errorComponent,
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