<template>
  <div>
    <div v-html="'<请求数据为模拟生成的:输入： @xxx 触发>'"></div>
    <div class="flex">
      <vue-tributeVue :options="tributeOption">
        <div class="line-height-1 tribute-input" type="text" />
      </vue-tributeVue>
      <div>
        <div class="display-block tribute-btn">
          <span>异步加载</span>
          <span v-if="searchText">,加载text内容为:{{ searchText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueTributeVue from '../vue-tribute.vue'
import { selectTemplate, noMatchTemplate, menuItemTemplate } from '../tribute-utill'
import { ref } from 'vue'
export default {
  name: 'async-tribute',
  components: {
    vueTributeVue
  },
  setup() {
    let newIndex = 0
    let ifLoading = false // 是否加载数据中
    const searchText = ref('')
    const loadingTemplate = () => '<div class="tribute-list-item-inner">加载中...</div>'
    const beforeLoadingTemplate = () => null
    const featchData = (text) => {
      return new Promise((resolve) => {
        const loadingIndex = parseInt(Math.random() * 9 + 2)
        // if (loadingIndex % 2) {
        //   return [{ noData: true, key: '', value: '' }]
        // }
        const addList = []
        for (let i = 0; i < loadingIndex + 3; i++) {
          addList.push({
            key: `🐮${text}-${i}`,
            value: `🐮${text}-${i}-id`,
            phone: `🐮x${i}`,
            avatar_url: new URL(
              `@/assets/images/mention-function/0${((loadingIndex + i) % 4) + 1}.png`,
              import.meta.url
            ).href
          })
        }
        newIndex = newIndex + 2
        setTimeout(() => {
          resolve(addList)
        }, 2000)
      })
    }
    return {
      searchText,
      tributeOption: {
        itemClass: 'tribute-list-item',
        searchDebounce: 500,
        noMatchTemplate: () => {
          if (ifLoading) {
            return loadingTemplate()
          }
          return noMatchTemplate()
        },
        selectTemplate: (item) => {
          if (item.original.loading) {
            return ''
          }
          if (item.original.noData) {
            return noMatchTemplate()
          }
          if (item.original.beforeLoading) {
            return ''
          }
          return selectTemplate(item)
        },
        menuItemTemplate: (item) => {
          if (item.original.loading) {
            return loadingTemplate()
          }
          if (item.original.noData) {
            return noMatchTemplate()
          }
          if (item.original.beforeLoading) {
            return beforeLoadingTemplate()
          }
          return menuItemTemplate(item)
        },
        values: (text, callback) => {
          if (!text) {
            return callback((() => [{ beforeLoading: true, key: '', value: '' }])())
          }
          if (ifLoading) return
          ifLoading = true
          searchText.value = text
          callback((() => [{ loading: true, key: text, value: '' }])())
          featchData(text).then((res) => {
            ifLoading = false
            callback(res)
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tribute-input {
  width: 500px;
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0.5em;
}
.tribute-btn {
  margin: 0 0 1em 1em;
  font-size: 16px;
  padding: 0.5em;
}
</style>
