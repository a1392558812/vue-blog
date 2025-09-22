<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800 mb-2">CSS 转 UnoCSS 工具</h1>
        <p class="text-gray-500">将普通CSS代码转换为UnoCSS类名</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h2 class="font-semibold text-gray-700">输入CSS代码</h2>
          </div>
          <div class="p-[20px]">
            <textarea v-model="cssCode"
              class="w-[calc(100%-15px*2)] h-[600px] p-[15px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none font-mono text-sm"
              placeholder="请输入CSS代码..." />
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h2 class="font-semibold text-gray-700">输出UnoCSS代码</h2>
          </div>
          <div class="p-4">
            <div
              class="w-full h-[600px] p-3 border border-gray-300 rounded-lg overflow-auto font-mono text-sm bg-gray-50">
              <div class="mb-4" style="word-wrap: break-word">
                {{ result[0] }}
              </div>
              <button @click="onCopy(result[0])"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                复制代码
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <toast ref="toastRefDom" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as unocssTransform from 'transform-to-unocss-core'
import toast from '@/components/toast/index.vue'
import { useClipboard } from '@vueuse/core'

const { copy, copied, isSupported } = useClipboard()
const toastRefDom = ref(null)

const cssCode = ref(`
.content-body {
  width: 23rpx;
  height: 12rpx;
  
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 500;
  font-size: 12rpx;
  color: #FFFFFF;
  line-height: 12rpx;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
`)

const result = computed(() => {
  try {
    const conversionResult = unocssTransform.toUnocssClass(cssCode.value)
    if (conversionResult) {
      return conversionResult
    } else {
      return ['代码输入格式有误']
    }
  } catch (e) {
    return ['代码输入格式有误']
  }
})

const onCopy = (toCopyStr) => {
  if (!isSupported) {
    return alert('浏览器不支持复制功能')
  }
  copy(toCopyStr).then(() => {
    toastRefDom.value.addToast({
      contentWrapStyle: { background: 'rgba(0, 0, 0, 0.8)', color: '#fff' },
      contentStyle: { color: '#fff' },
      content: copied.value ? `复制成功` : `复制失败`
    })
  })
}
</script>

<style lang="scss" scoped></style>