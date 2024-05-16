<template>
    <div class="width100 overflow-y-auto markdown-priview-vuecode">
        <div style="min-width: 1000px">
            <div class="vuepress-markdown-body">
                <p>拓展markdown语法，解析里面的vue代码演示功能</p>
                <p>vue解析器为异步懒加载，可通过配置地址栏参数<code>url?delay=3000</code>来主动延时vue解析器加载时间，<code>F5</code>刷新浏览器，并配合<code>F12</code>查看(单位：毫秒)</p>
                <p>具体的markdown文件可通过<code>F12</code>打开控制台查看</p>
                <p><a href="/demo-static/markdown-priview-vuecode/markdown.md">源文件markdown</a>字符串👇👇👇:</p>
                <pre class="pre-code scroll-bar-y scroll-bar-x overflow-y-auto overflow-x-auto">
                    <code> {{ markdowmText }} </code>
                </pre>
                <p>下面是自定义markdown解析: 👇👇👇</p>
            </div>
            <markdownPriview title="markdown.md" :loading="loading" :html-m-d="htmlMD" />
        </div>
    </div>
</template>
<script setup lang="jsx">
import { ref, nextTick, createApp, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { asyncLoadJs } from '@/common/util/async-load'
import { baseUrlFun } from '@/common/methods.js'
import axios from '@/common/axios.js'

import markdownPriview from '@/components/markdown-priview/index.vue'
import playgroundPlane from '@/components/playground-plane/index.vue'

const htmlMD = ref('')
const markdowmText = ref('')
const loading = ref(true)

const route = useRoute()

const delay = route.query.delay ? +route.query.delay : 0

const instanceList = []
let codeTimer = null
let createTimer = null

const destroy = () => {
  clearTimeout(codeTimer)
  clearTimeout(createTimer)
  codeTimer = null
  createTimer = null
  if (instanceList.length) {
    instanceList.forEach(item => {
      if (item.app && item.app.unmount) {
        item.app.unmount()
      }
    })
    instanceList.length = 0
  }
}

const loadMarkdown = (urlLink) => {
  loading.value = true
  axios.get('/demo-static/markdown-priview-vuecode/markdown.md')
    .then((response) => {
      destroy()
      const vue3SfcList = []

      markdowmText.value = response.data

      htmlMD.value = window.$('vue3-sfc').parse(response.data).replaceWith((i1, item) => {
        const str = window.$(item).html()
        const id = `playground-${i1}`
        vue3SfcList.push({ str, idSelector: `#${id}`, componentsFiles: {} })
        codeTimer = setTimeout(() => {
          window.$('vue3-file').parse(str).each((i2, obj2) => {
            const file = window.$(obj2)
            let fileName = file.attr('name')
            if (fileName.toLowerCase() === 'app.vue') {
              fileName = 'App.vue'
            }
            const fileStr = file.html()
            vue3SfcList[i1].componentsFiles[fileName] = fileStr
          })
        }, 0)
        return `<div style="margin: 0.85em 0" id="${id}"></div>`
      }).printHtml()

      console.log('vue3SfcList', vue3SfcList)

      loading.value = false
      nextTick(() => {
        vue3SfcList.forEach(item => {
          const divNode = document.createElement('div')

          createTimer = setTimeout(() => {
            const app = createApp(playgroundPlane, {
              name: item.idSelector,
              componentsFiles: item.componentsFiles,
              playGroundPlaneWidth: '100%',
              playGroundPlaneReplHeight: '500px',
              key: item.idSelector
            })

            app.mount(divNode)
            $(item.idSelector).append(divNode)
            instanceList.push({ app })
          }, delay)
        })
      })
    })
    .catch(e => {
      htmlMD.value = '网络寄了，我哭哭~~'
      loading.value = false
      console.log('loadMarkdown-error', e)
    })
}

asyncLoadJs(baseUrlFun() + 'demo-static/markdown-priview-vuecode/xiyueta/index.js').then(() => {
  loadMarkdown()
})

onUnmounted(() => {
  destroy()
})

</script>
<style scoped lang="scss">
    .markdown-priview-vuecode {
      max-height: 100vh;
      .pre-code {
        width: 500px;
        height: 300px;
      }
    }
</style>
