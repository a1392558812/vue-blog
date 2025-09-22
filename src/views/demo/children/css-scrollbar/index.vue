<template>
  <div
    class="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 p-8 flex flex-col items-center justify-center">
    <div class="w-[1500px] mx-auto">
      <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800 text-center mb-4">CSS 滚动条自定义工具</h1>
      <p class="text-gray-600 text-center mb-10 max-w-2xl mx-auto">通过调整下方参数，实时预览和生成自定义滚动条CSS代码，可直接复制使用。</p>

      <div class="flex gap-[20px] justify-center">
        <!-- 参数设置区域 -->
        <div
          class="w-[calc((1500px-20px*2)/3)] shrink-0 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="p-[20px]">
            <h2 class="text-xl font-semibold text-gray-700 mb-6">参数设置</h2>

            <!-- 数值输入区域 -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">尺寸设置</h3>
              <div class="space-y-4">
                <div class="flex items-center" v-for="(item, index) in [
                  { label: 'box宽', key: 'width' },
                  { label: 'box高', key: 'height' },
                  { label: '滚动条宽度', key: 'scrollWidth' },
                  { label: '滚动条圆角', key: 'borderRadius' },
                  { label: '滚动条边框厚度', key: 'borderWidth' }
                ]" :key="index">
                  <div class="w-36 text-sm text-gray-700 font-medium">{{ item.label }}：</div>
                  <div class="relative flex-1">
                    <input :value="params[item.key]" type="number" @input="
                      function (e) {
                        onInput(e, item.key)
                      }
                    "
                      class="box-content w-[calc(100%-20px-30px)] pl-[20px] pr-[30px] py-2 border-[1px] border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none" />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">px</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 颜色选择区域 -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">颜色设置</h3>
              <div class="space-y-4">
                <div class="flex items-center" v-for="(item, index) in [
                  { label: '滚动条轨道颜色', key: 'scrollbarTrackColor' },
                  { label: '滚动条滑块颜色', key: 'scrollbarThumbColor' },
                  { label: '滚动条滑块边框颜色', key: 'borderColor' }
                ]" :key="index">
                  <div class="w-36 text-sm text-gray-700 font-medium">{{ item.label }}：</div>
                  <input :value="params[item.key]" type="color" @input="
                    function (e) {
                      onInputColor(e, item.key)
                    }
                  "
                    class="w-12 h-12 mr-3 rounded-lg cursor-pointer border border-gray-300 transition-transform duration-200 hover:scale-105" />
                  <span class="text-sm font-mono text-gray-600">{{ params[item.key] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 代码展示区域 -->
        <div
          class="w-[calc((1500px-20px*2)/3)] shrink-0 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="p-[20px]">
            <h2 class="text-xl font-semibold text-gray-700 mb-6">生成的CSS代码</h2>
            <div class="relative">
              <pre
                class="h-[450px] break-all overflow-auto p-4 bg-gray-800 text-gray-100 rounded-lg text-sm font-mono shadow-sm">
                <code>{{ css }}</code>
              </pre>
              <button @click="copyToClipboard(css)"
                class="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 效果预览区域 -->
        <div
          class="w-[calc((1500px-20px*2)/3)] shrink-0 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="p-[20px]">
            <h2 class="text-xl font-semibold text-gray-700 mb-6">效果预览</h2>
            <div class="w-full overflow-auto css-scrollbar rounded-lg">
              <pre :style="{ width: `${2 * params.width}px`, height: `${2 * params.height}px` }"
                class="p-4 text-sm font-mono text-gray-800"><code>{{ css }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useStyleTag } from '@vueuse/core'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'view-demo-css-scrollbar' })

const params = reactive({
  width: 350,
  height: 450,
  scrollWidth: 40,
  borderRadius: 20,
  borderWidth: 7,
  scrollbarTrackColor: '#ff0000',
  scrollbarThumbColor: '#00ff00',
  borderColor: '#0000ff'
})

const { copy, copied } = useClipboard()

const createCss = ({
  width,
  height,
  scrollWidth,
  borderRadius,
  scrollbarTrackColor,
  scrollbarThumbColor,
  borderWidth,
  borderColor
}) =>
  `.css-scrollbar {
  width: ${width}px;
  height: ${height}px;
}

.css-scrollbar::-webkit-scrollbar {
  width: ${scrollWidth}px;
  height: ${scrollWidth}px;
}

.css-scrollbar::-webkit-scrollbar-track {
  background: ${scrollbarTrackColor};
  border-radius: ${borderRadius}px;
}

.css-scrollbar::-webkit-scrollbar-thumb {
  background: ${scrollbarThumbColor};
  border-radius: ${borderRadius}px;
  border: ${borderWidth}px solid ${borderColor};
}`

const { css } = useStyleTag(createCss(params))

const onInput = (e, type) => {
  if (!e.target.value) {
    params[type] = 0
    e.target.value = 0
    css.value = createCss(params)
    return
  }
  if (+e.target.value < 0) {
    params[type] = 0
    e.target.value = 0
    css.value = createCss(params)
    return
  }
  params[type] = (+e.target.value).toFixed(0)
  e.target.value = (+e.target.value).toFixed(0)
  css.value = createCss(params)
}

const onInputColor = (e, type) => {
  params[type] = e.target.value
  css.value = createCss(params)
}

const copyToClipboard = async (text) => {
  await copy(text)
  // 这里可以添加一个复制成功的提示
}
</script>

<style scoped lang="scss">
/* 基础滚动条样式 */
.css-scrollbar {
  border: 1px solid #e5e7eb;
  padding: 10px;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
