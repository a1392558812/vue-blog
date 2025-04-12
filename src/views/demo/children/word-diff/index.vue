<template>
  <div class="diff-warp overflow-y-auto">
    <div class="flex justify-between">
      <div class="flex-1 flex-col items-center justify-center">
        <p class="text-center">str1（编辑）:</p>
        <textarea class="w-[100%] diff-textarea" v-model="str1" />
        <div style="border-bottom: 1px solid #000">预览【 ↓ 】：</div>
        <markdown class="markdown" style="white-space: pre-wrap" :markdownText="computedStr1" />
      </div>
      <div
        class="flex-1 flex-col items-center justify-center"
        style="border-left: 1px solid #000; border-right: 1px solid #000"
      >
        <p class="text-center">str2（编辑）:</p>
        <textarea class="w-[100%] diff-textarea" v-model="str2" />
        <div style="border-bottom: 1px solid #000">预览【 ↓ 】：</div>
        <markdown class="markdown" style="white-space: pre-wrap" :markdownText="computedStr2" />
      </div>
      <div class="flex-1 flex-col items-center justify-center">
        <p class="text-center">str1与str2对比:</p>
        <textarea class="w-[100%] diff-textarea" disabled />
        <div style="border-bottom: 1px solid #000">预览【 ↓ 】：</div>
        <markdown class="markdown" style="white-space: pre-wrap" :markdownText="str3" />
      </div>
    </div>
  </div>
</template>
<script>
import { diffChars } from 'diff'
import { ref, computed } from 'vue'
import markdown from './components/markdown.vue'
export default {
  name: 'view-demo-word-diff',
  components: {
    markdown
  },
  setup() {
    const str1 = ref(`let array = [1, 2, 3, 4, 5, 6, 7]
array.reduce((accumulate, item, index, metaArray   ) => {
  console.log("累积器：", accumulate)
  console.log("当前项：", item)
  console.log("当前索引：", index)
  console.log("原数组：", metaArray)
  return accumulate + item2
 }, 9)
`)
    const str2 = ref(`  let array = [1, 2, 3, 4, 5, 6, 7]
array.reduce((accumulate,     item, index, metaArray) => {
  console.log("累积器1：", accumulate)
   console.log("当前项1：", item)
 console.log("当前索引:", index)
  console.log("原数组1：", metaArray)
  return accumulate + item
}, 9)
`)
    const computedStr1 = computed(() => str1.value.replaceAll(' ', '<span>&#8194;</span>'))
    const computedStr2 = computed(() => str2.value.replaceAll(' ', '<span>&#8194;</span>'))
    const str3 = computed(() =>
      [''].concat(diffChars(str1.value, str2.value)).reduce((total, next) => {
        let result = total
        if (next.added) {
          result =
            result +
            `<span style="background: green;">${next.value.replaceAll(' ', '<span>&#8194;</span>')}</span>`
        } else if (next.removed) {
          result =
            result +
            `<span style="background: red">${next.value.replaceAll(' ', '<span>&#8194;</span>')}</span>`
        } else {
          result = result + next.value.replaceAll(' ', '<span>&#8194;</span>')
        }
        return result
      })
    )

    return {
      computedStr1,
      computedStr2,
      str1,
      str2,
      str3
    }
  }
}
</script>
<style scoped lang="scss">
.diff-warp {
  height: 100vh;
  .diff-textarea {
    min-height: 350px;
    resize: none;
  }
}
</style>
