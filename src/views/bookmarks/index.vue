<!--
 * @Author: Awen 1392558812@qq.com
 * @Date: 2022-06-17 10:43:38
 * @LastEditors: Awen 1392558812@qq.com
 * @LastEditTime: 2022-06-17 13:37:24
 * @FilePath: \vue-blog\src\views\bookmarks.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div v-loading="str === ''" class="bg-white width100 height100 overflow-auto bookmarks">
    <div v-if="!ifDestroy" class="display-none html-str" v-html="str" />
    <div class="tips">Ctrl+F 即可进行搜索</div>
    <div class="tips">
      <span class="cursor-pointer" @click="spreadOut">{{ `[${ifShowAll ? '关闭' : ''}全部展开]` }}</span>
    </div>
    <book-marks-item :data="htmlJson" />
  </div>
</template>

<script>
import { nextTick, ref, watch } from 'vue'

import axios from '@/common/axios.js'
import { htmlToJson } from '@/common/methods'
import leftSidebarProps from '@/common/left-sidebar-props'
import throttle from '@/common/util/throttle'
import bookMarksItem from './components/bookmarks/item'

export default {
  name: 'Bookmarks',
  components: {
    bookMarksItem
  },
  props: {
    ...leftSidebarProps
  },
  setup (props) {
    const str = ref('')
    const ifDestroy = ref(false)
    const ifShowAll = ref(false) // 是否展开全部
    const htmlJson = ref({})
    const spreadOutCallBack = (data) => {
      return new Promise(resolve => {
        (() => {
          if (![
            Object.prototype.hasOwnProperty.call(data, 'child'),
            Object.prototype.hasOwnProperty.call(data, 'ifShow'),
            Object.prototype.hasOwnProperty.call(data, 'ifRender')
          ].includes(false)) {
            data.ifRender = true
            data.ifShow = !ifShowAll.value
            data.child.forEach((item, index) => {
              spreadOutCallBack(data.child[index]).then()
            })
          }
        })()
        resolve('end')
      })
    }
    const spreadOut = () => throttle(() => {
      spreadOutCallBack(htmlJson.value).then(_ => {
        ifShowAll.value = !ifShowAll.value
      })
    }, 200)

    axios.get('./bookmarks.html').then(res => { str.value = res.data })

    watch(str, () => nextTick().then(() => {
      htmlJson.value = htmlToJson($('.html-str').children('dl').children('dt'), true, true)
      console.log('htmlJson', htmlJson.value)
      ifDestroy.value = true
    }))

    return {
      str,
      ifDestroy,
      htmlJson,
      ifShowAll,
      spreadOut
    }
  }
}
</script>

<style scoped lang="scss">
.bookmarks {
  .tips {
    padding: 10px 5px;
    font-size: 16px;
    font-weight: bold;
    color: var(--global-text-color);
  }
}
</style>
