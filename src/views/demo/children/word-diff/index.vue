<template>
  <div class="diff-warp min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 overflow-auto">
    <!-- 操作提示 -->
    <div
      class="w-[calc(1500px-20px*2)] mx-auto bg-white/80 backdrop-blur-sm mb-4 rounded-lg px-[20px] py-4 border border-indigo-100">
      <div class="text-gray-600 text-sm">
        <div class="font-medium mb-1">操作说明：</div>
        <div>• 修改左侧或中间的文本，右侧将实时显示两段文本的差异</div>
        <div>• <span class="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded">绿色</span> 表示在第二段新增的内容
        </div>
        <div>• <span class="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded">红色</span> 表示在第一段删除的内容</div>
      </div>
    </div>

    <!-- 主内容容器 -->
    <div class="w-[1500px] mx-auto">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-3 gap-4">
          <!-- 左侧：str1 -->
          <div class="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
            <div class="mb-3 text-center font-semibold text-indigo-700">str1（编辑）:</div>
            <textarea
              class="box-content w-[calc(100%-20px*2)] diff-textarea py-3 px-[20px] border-2 border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              v-model="str1" placeholder="请输入第一段文本..."></textarea>
            <div class="text-center py-2 font-medium text-gray-700 border-b-2 border-indigo-100 mt-3 mb-2">
              预览【 ↓ 】：
            </div>
            <div class="p-3 bg-gray-50 rounded-lg overflow-auto max-h-[350px]">
              <markdown class="markdown" style="white-space: pre-wrap" :markdownText="computedStr1" />
            </div>
          </div>

          <!-- 中间：str2 -->
          <div class="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
            <div class="mb-3 text-center font-semibold text-purple-700">str2（编辑）:</div>
            <textarea
              class="box-content w-[calc(100%-20px*2)] diff-textarea py-3 px-[20px] border-2 border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              v-model="str2" placeholder="请输入第二段文本..."></textarea>
            <div class="text-center py-2 font-medium text-gray-700 border-b-2 border-purple-100 mt-3 mb-2">
              预览【 ↓ 】：
            </div>
            <div class="p-3 bg-gray-50 rounded-lg overflow-auto max-h-[350px]">
              <markdown class="markdown" style="white-space: pre-wrap" :markdownText="computedStr2" />
            </div>
          </div>

          <!-- 右侧：对比结果 -->
          <div class="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
            <div class="mb-3 text-center font-semibold text-blue-700">str1与str2对比:</div>
            <div class="p-3 bg-gray-50 rounded-lg overflow-auto h-[650px]">
              <markdown class="markdown" style="white-space: pre-wrap" :markdownText="str3" />
            </div>
          </div>
        </div>


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
          result = result + `<span style="background: #dcfce7; color: #166534; padding: 0.5px 2px; border-radius: 2px;">${next.value.replaceAll(' ', '<span>&#8194;</span>')}</span>`
        } else if (next.removed) {
          result = result + `<span style="background: #fee2e2; color: #991b1b; padding: 0.5px 2px; border-radius: 2px;">${next.value.replaceAll(' ', '<span>&#8194;</span>')}</span>`
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
    height: 200px;
    resize: none;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.7);
}
</style>
