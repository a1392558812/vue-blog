<template>
  <div class="w-[100%] overflow-y-auto markdown-priview-vuecode">
    <div style="min-width: 1000px">
      <div class="vuepress-markdown-body">
        <h1>拓展markdown功能，解析里面的vue代码演示功能</h1>
        <p>vue演练场为异步懒加载，且在挂载编译过程中加入了2s的防抖，防止过快生成组件实例</p>
        <p>具体的markdown文件可通过<code>F12</code>打开控制台查看</p>
        <p>
          <a href="/demo-static/markdown-priview-vuecode/markdown.md">源文件markdown</a
          >字符串👇👇👇:
        </p>
        <div class="code-textarea-wrap" v-if="!loading">
          <textarea class="h-[100%] w-[100%] block code-textarea" v-model="htmlMD"></textarea>
        </div>
        <p>下面是自定义markdown解析: 👇👇👇</p>
      </div>
      <markdownPriview title="markdown.md" :loading="loading" :html-m-d="htmlMD" />
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import axios from '@/common/axios/index.js'
import markdownPriview from './components/markdown-priview/index.vue'

defineOptions({ name: 'view-demo-markdown-priview-vuecode' })

const htmlMD = ref('')
const loading = ref(true)

const loadMarkdown = (urlLink = '/demo-static/markdown-priview-vuecode/markdown.md') => {
  loading.value = true
  axios
    .get(urlLink)
    .then((response) => {
      htmlMD.value = response.data
      loading.value = false
    })
    .catch((e) => {
      htmlMD.value = '网络寄了，我哭哭~~'
      loading.value = false
      console.log('loadMarkdown-error', e)
    })
}
loadMarkdown()
</script>
<style scoped lang="scss">
.markdown-priview-vuecode {
  max-height: 100vh;
  .code-textarea-wrap {
    margin: 0.85rem 0;
    border-radius: 6px;
    height: 350px;
    .code-textarea {
      resize: none;
      box-sizing: border-box;
      min-width: 100%;
      max-width: 100%;
      max-height: 100%;
      min-height: 100%;
      color: #fff;
      font-size: 14px;
      padding: 1.25rem 1.5rem;
      line-height: 1.4;
      background-color: #282c34;
      border-radius: 6px;
    }
  }
}
</style>
