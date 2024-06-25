<template>
  <div class="overflow-auto excel-preview-edit">
    <div style="margin: 20px" class="flex flex-direction-column">
      <div>
        <div class="loading-status" v-if="loadScript === 0 || loadCss === 0">
          加载excel解析组件中...
        </div>
        <excel-lucky-sheet
          class="excel-lucky-sheet"
          v-if="loadScript === 1 && loadCss === 1"
        ></excel-lucky-sheet>
        <div class="loading-status" v-if="loadScript === -1">
          组件script脚本加载错误,请刷新重新尝试加载
        </div>
        <div class="loading-status" v-if="loadCss === -1">
          组件css加载错误,请刷新重新尝试加载
        </div>
      </div>
      <pre class="overflow-auto code-demo">
        {{ htmlStr }}
      </pre>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue'
import excelLuckySheet from './components/index.vue'
import { useScriptTag } from '@vueuse/core'
import { baseUrlFun, asyncLoadCss } from '@/common/util/methods.js'
import htmlStr from './html'
export default {
  components: {
    excelLuckySheet
  },
  setup () {
    const loadScript = ref(0) // 0加载中  ,1 加载完成  -1加载失败
    const loadCss = ref(0)
    const baseUrl = baseUrlFun()
    let scriptList = [] // 卸载异步script方法list

    // 异步加载script
    ;(async () => {
      const scriptList = [
        useScriptTag(
          `${baseUrl}demo-static/excel-preview-edit/plugins/js/plugin.js`,
          () => {},
          { manual: true }
        ),
        useScriptTag(
          `${baseUrl}demo-static/excel-preview-edit/luckysheet.umd.js`,
          () => {},
          { manual: true }
        )
      ]
      const resultList = []
      for (let i = 0; i < scriptList.length; i++) {
        await scriptList[i].load()
        resultList.push(scriptList[i].unload)
      }
      loadScript.value = 1
      return resultList
    })().then(res => {
      scriptList = res
    })

    // 异步加载css
    Promise.all((() => {
      const cssListLoad = []
      ;[
        'plugins/css/pluginsCss.css',
        'plugins/plugins.css',
        'css/luckysheet.css',
        'assets/iconfont/iconfont.css'
      ].forEach((item) => {
        cssListLoad.push(
          asyncLoadCss(`${baseUrl}demo-static/excel-preview-edit/${item}`)
        )
      })
      return cssListLoad
    })()).then(
      (_) => {
        loadCss.value = 1
      },
      (e) => {
        loadCss.value = -1
      }
    )

    onBeforeUnmount(() => {
      scriptList.forEach(unload => {
        unload()
      })
    })
    return {
      loadScript,
      loadCss,
      htmlStr
    }
  }
}
</script>

<style lang="scss" scoped>
.excel-preview-edit {
  height: 100vh;
  background: #eee;
  .loading-status {
    font-size: 22px;
    font-weight: bolder;
    margin-bottom: 20px;
  }
  .code-demo {
    font-size: 16px;
    margin-top: 10px;
    border: 1px solid #000;
    padding: 0 20px;
    background: #fff;
    word-break: break-all;
    word-wrap: break-word;
  }
  ::v-deep(#luckysheet) {
    .luckysheet-share-logo {
      background-image: none;
    }
  }
}
</style>
