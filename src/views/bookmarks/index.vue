<!--
 * @Author: Awen 1392558812@qq.com
 * @Date: 2022-06-17 10:43:38
 * @LastEditors: Awen 1392558812@qq.com
 * @LastEditTime: 2022-06-17 13:37:24
 * @FilePath: \vue-blog\src\views\bookmarks.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div v-loading="str === ''" class="bg-style w-[100%] h-[100%] flex flex-col">
    <div class="w-[100%]">
      <div v-if="!ifDestroy" class="w-[100%] hidden html-str" v-html="str" />
      <div
        class="px-[5px] py-[10px] [border-bottom:1px_solid_var(--global-border-color)]"
        :class="ifLarger ? '' : 'flex flex-col'"
      >
        <span class="text-[16px] font-bold text-[var(--global-text-color)]">
          【 Ctrl + F 即可进行搜索 】
        </span>
        <a
          class="text-[16px] font-bold text-[var(--global-text-color)]"
          href="./bookmarks.html"
          download="./bookmarks.html"
        >
          【 下载 】
        </a>
        <span
          class="text-[16px] font-bold text-[var(--global-text-color)] cursor-pointer"
          @click="spreadOut"
          >{{ ` 【 ${ifShowAll ? '关闭' : ''}全部展开 】 ` }}</span
        >
      </div>
    </div>
    <div style="padding: 0 20px 120px 20px" class="shrink-0 flex-1 overflow-auto">
      <book-marks-item :data="htmlJson" />
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch } from 'vue'

import axios from '@/common/axios/index.js'
import { htmlToJson } from '@/common/util/methods.js'
import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'
import throttle from '@/common/util/throttle.js'
import bookMarksItem from './components/bookmarks/item.vue'

export default {
  name: 'view-bookmarks',
  components: {
    bookMarksItem
  },
  props: {
    ...leftSidebarProps
  },
  setup() {
    const str = ref('')
    const ifDestroy = ref(false)
    const ifShowAll = ref(false) // 是否展开全部
    const htmlJson = ref({})
    const spreadOutCallBack = (data) => {
      return new Promise((resolve) => {
        ;(() => {
          if (
            ![
              Object.prototype.hasOwnProperty.call(data, 'child'),
              Object.prototype.hasOwnProperty.call(data, 'ifShow'),
              Object.prototype.hasOwnProperty.call(data, 'ifRender')
            ].includes(false)
          ) {
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
    const spreadOut = () =>
      throttle(() => {
        spreadOutCallBack(htmlJson.value).then((_) => {
          ifShowAll.value = !ifShowAll.value
        })
      }, 200)

    axios.get('./bookmarks.html').then((res) => {
      str.value = res.data
    })

    watch(str, () =>
      nextTick().then(() => {
        htmlJson.value = htmlToJson($('.html-str').children('dl').children('dt'), true, true)
        console.log('htmlJson', htmlJson.value)
        ifDestroy.value = true
      })
    )

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

<style scoped lang="scss"></style>
