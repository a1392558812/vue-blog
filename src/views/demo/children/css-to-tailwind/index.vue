<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">CSS 转 Tailwind 工具</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 输入CSS代码区域 -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div class="bg-blue-600 text-white px-4 py-3 font-medium">
            输入CSS代码
          </div>
          <textarea
            class="w-full h-[600px] p-4 border-0 focus:ring-2 focus:ring-blue-200 resize-none outline-none text-gray-800"
            v-model="cssCode" placeholder="请输入CSS代码..." />
        </div>

        <!-- 输入主题代码区域 -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div class="bg-purple-600 text-white px-4 py-3 font-medium">
            输入主题配置（JSON）
          </div>
          <textarea
            class="w-full h-[600px] p-4 border-0 focus:ring-2 focus:ring-purple-200 resize-none outline-none text-gray-800"
            v-model="customTheme" placeholder='请输入JSON格式主题配置，无需配置可填"{}"' />
        </div>

        <!-- 输出结果区域 -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div class="bg-green-600 text-white px-4 py-3 font-medium">
            输出结果
          </div>
          <div class="w-full h-[600px] overflow-auto p-4 text-gray-800">
            <div v-for="(item, index) in result" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
              :key="index">
              <div v-for="(key, keyIndex) in Object.keys(item)" :key="`${index}-${keyIndex}`" class="mb-2">
                <div class="font-medium text-gray-700">{{ key }}:</div>
                <div class="mt-1 pl-2 text-gray-600 break-all">{{ item[key] }}</div>
                <div v-if="key === 'resultVal'" class="mt-2">
                  <button @click="onCopy(item[key])"
                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                    复制
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <toast ref="toastRefDom" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CssToTailwindTranslator } from 'css-to-tailwind-translator'
import toast from '@/components/toast/index.vue'
import { useClipboard } from '@vueuse/core'

const { copy, copied, isSupported } = useClipboard()
const toastRefDom = ref(null)

const cssCode = ref(`
@media (min-width: 1800px) {
  .content-body {
    width: 288px;
    height: 50%;
    margin: 0 !important;
    transform: rotate(99deg);
    backdrop-filter: blur(99999px);
    box-shadow: 10px 10px 5px #888888;
  }
}
.main {
  width: 100%;
}
`)

const customTheme = ref(`
{
  "media":{
    "@media (min-width: 1800px)":"3xl"
  },
  "backdrop-blur":{
    "99999px":"super-big"
  },
  "rotate":{
    "99deg":"crooked"
  },
  "width":{
    "288px":"w-custom"
  },
  "box-shadow":{
    "10px 10px 5px #888888":"box-shadow-custom"
  }
}
`)

const result = computed(() => {
  try {
    const conversionResult = CssToTailwindTranslator(cssCode.value, {
      customTheme: JSON.parse(customTheme.value)
    })
    console.log('conversionResult', conversionResult)
    if (conversionResult && conversionResult.code === 'OK') {
      return conversionResult.data
    } else {
      return [['代码输入格式有误']]
    }
  } catch (e) {
    return [['主题输入格式有误']]
  }
})

const onCopy = (toCopyStr) => {
  console.log('onCopy', toCopyStr)
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