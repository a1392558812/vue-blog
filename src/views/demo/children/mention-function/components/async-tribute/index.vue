<template>
  <div>
    <div class="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md">
      <div v-html="'<请求数据为模拟生成的:输入： @xxx 触发>'"></div>
    </div>

    <div class="">
      <div class=" bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200 shadow-sm">
        <label class="block text-gray-700 font-medium mb-2">异步提及输入框</label>
        <vue-tributeVue :options="tributeOption">
          <div
            class="w-[calc(100%-20px*2)] h-auto px-[20px] py-3 border-2 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-sans text-gray-800 bg-white overflow-auto tribute-input"
            type="text" />
        </vue-tributeVue>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="p-3 bg-indigo-100 rounded-lg">
          <div class="block tribute-btn text-indigo-800 font-medium">
            <span>异步加载</span>
            <span v-if="searchText" class="text-indigo-600">,加载text内容为:{{ searchText }}</span>
          </div>
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
/* 自定义滚动条样式 */
.tribute-input::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tribute-input::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tribute-input::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tribute-input::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
