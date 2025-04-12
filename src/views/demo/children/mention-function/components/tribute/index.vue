<template>
  <div>
    <div v-html="'<视图不会主动更新>'"></div>
    <div>测试数据：（@test1）（@test2）（@test3）（@test4）（@t****）</div>
    <div class="flex">
      <div>
        <vue-tributeVue :options="tributeOption" @initTribute="initTribute">
          <div
            ref="vueTributeVue"
            class="lh-none tribute-input"
            type="text"
            @tribute-replaced="(e) => customTribute('tribute-replaced', e)"
            @tribute-active-true="(e) => customTribute('tribute-active-true', e)"
            @tribute-active-false="(e) => customTribute('tribute-active-false', e)"
            @tribute-no-match="(e) => customTribute('tribute-no-match', e)"
          />
        </vue-tributeVue>
        <div class="overflow-y-auto tribute-innerHtml" v-show="vueTributeVueInnerHtml">
          <p style="color: cadetblue">
            所选取的值赋值于span标签的 data-*属性上，解析data-*拼接字符串即可
          </p>
          <p>{{ vueTributeVueInnerHtml }}</p>
        </div>
      </div>
      <div>
        <button class="block tribute-btn" @click="handleClick">主动触发@菜单</button>
        <button class="block tribute-btn" @click="handleAddClick1">2500ms后添加新数据方式</button>
        <button class="block tribute-btn" @click="handleAddClick2">显示视图内容</button>
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
            console.log('???')
            tribute.append(0, newListCreate())
          },
          2500,
          false
        )
      },
      handleAddClick2: () => {
        console.log('tribute实例', tribute)
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
.tribute-input {
  width: 500px;
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0.5em;
}
.tribute-innerHtml {
  width: 500px;
  max-height: 500px;
  word-break: break-all;
}
.tribute-btn {
  margin: 0 0 1em 1em;
  padding: 0.5em;
}
</style>
