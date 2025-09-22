<template>
  <div>
    <div class="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md">
      <div v-html="'<视图不会主动更新>'"></div>
    </div>

    <div class="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
      <p class="text-gray-700 font-medium mb-2">测试数据：</p>
      <div class="bg-white p-3 rounded-md border border-gray-200">
        <span class="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mx-1 my-1">@test1</span>
        <span class="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mx-1 my-1">@test2</span>
        <span class="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mx-1 my-1">@test3</span>
        <span class="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mx-1 my-1">@test4</span>
        <span class="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mx-1 my-1">@t****</span>
      </div>
    </div>

    <div class="flex items-start space-y-6 md:space-y-0 md:space-x-6">
      <div class="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <label class="block w-full text-gray-700 font-medium mb-2">同步提及输入框</label>
        <div class="w-full">
          <vue-tributeVue :options="tributeOption" @initTribute="initTribute">
            <div ref="vueTributeVue"
              class="w-[calc(100%-20px*2)] h-auto px-[20px] py-3 border-2 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-sans text-gray-800 bg-white overflow-auto tribute-input"
              type="text" @tribute-replaced="(e) => customTribute('tribute-replaced', e)"
              @tribute-active-true="(e) => customTribute('tribute-active-true', e)"
              @tribute-active-false="(e) => customTribute('tribute-active-false', e)"
              @tribute-no-match="(e) => customTribute('tribute-no-match', e)" />
          </vue-tributeVue>
          <div
            class="overflow-y-auto bg-white p-4 rounded-lg border border-gray-200 mt-4 max-h-[300px] tribute-innerHtml"
            v-show="vueTributeVueInnerHtml">
            <p class="text-sm text-indigo-600 font-medium mb-2">
              所选取的值赋值于span标签的 data-*属性上，解析data-*拼接字符串即可
            </p>
            <pre class="font-mono text-sm text-gray-800 whitespace-pre-wrap">
              {{ vueTributeVueInnerHtml }}
            </pre>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <p class="text-gray-700 font-medium mb-3">操作按钮</p>
        <div class="space-y-3">
          <button
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 tribute-btn"
            @click="handleClick">
            主动触发@菜单
          </button>
          <button
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 tribute-btn"
            @click="handleAddClick1">
            2500ms后添加新数据方式
          </button>
          <button
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 tribute-btn"
            @click="handleAddClick2">
            显示视图内容
          </button>
        </div>
      </div>
    </div>

    <toast ref="toastRefDom"></toast>
  </div>
</template>

<script>
import vueTributeVue from '../vue-tribute.vue'
import toast from '@/components/toast/index.vue'
import debounce from '@/common/util/debounce'
import { ref } from 'vue'
import { selectTemplate, noMatchTemplate, menuItemTemplate } from '../tribute-utill'
export default {
  name: 'mention-function-tribute',
  components: {
    vueTributeVue,
    toast
  },
  setup() {
    const vueTributeVue = ref(null)
    let tribute // new Tribute实例
    const toastRefDom = ref(null)
    const vueTributeVueInnerHtml = ref('')
    let newIndex = 0
    const newListCreate = () => {
      newIndex++
      const addList = []
      for (let i = newIndex; i < newIndex + 3; i++) {
        addList.push({
          key: `新数据${i}`,
          value: `新数据${i}-id`,
          phone: 'xxx',
          avatar_url: new URL(
            `@/assets/images/mention-function/0${(i % 4) + 1}.png`,
            import.meta.url
          ).href
        })
      }
      newIndex = newIndex + 2
      return addList
    }
    return {
      toastRefDom,
      vueTributeVue,
      vueTributeVueInnerHtml,
      handleClick: () => {
        tribute.showMenuForCollection(vueTributeVue.value)
      },
      customTribute: (type, e) => {
        toastRefDom.value.addToast({
          content: `事件${type},回调参${e}`
        })
      },
      handleAddClick1: () => {
        debounce(
          () => {
            tribute.append(0, newListCreate())
          },
          2500,
          false
        )
      },
      handleAddClick2: () => {
        vueTributeVueInnerHtml.value = vueTributeVue.value.innerHTML
      },
      initTribute: (result) => {
        tribute = result
      },
      tributeOption: {
        values: [
          {
            key: 'test1',
            value: 'test1-id',
            phone: '001',
            avatar_url: new URL('@/assets/images/mention-function/01.png', import.meta.url).href
          },
          {
            key: 'test2',
            value: 'test2-id',
            phone: '002',
            avatar_url: new URL('@/assets/images/mention-function/02.png', import.meta.url).href
          },
          {
            key: 'test3',
            value: 'test3-id',
            phone: '003',
            avatar_url: new URL('@/assets/images/mention-function/03.png', import.meta.url).href
          },
          {
            key: 'test4',
            value: 'test4-id',
            phone: '004',
            avatar_url: new URL('@/assets/images/mention-function/04.png', import.meta.url).href
          }
        ],
        itemClass: 'tribute-list-item',
        selectTemplate,
        noMatchTemplate,
        menuItemTemplate
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 自定义滚动条样式 */
.tribute-input::-webkit-scrollbar,
.tribute-innerHtml::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tribute-input::-webkit-scrollbar-track,
.tribute-innerHtml::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tribute-input::-webkit-scrollbar-thumb,
.tribute-innerHtml::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tribute-input::-webkit-scrollbar-thumb:hover,
.tribute-innerHtml::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
