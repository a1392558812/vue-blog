<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap gap-6  justify-center items-stretch">
        <!-- 参数设置卡片 -->
        <div
          class="bg-white h-[430px] rounded-xl shadow-lg p-6 w-full max-w-md transform hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">参数设置</h2>

          <div class="space-y-4">
            <div v-for="(item, index) in [
              { label: 'box宽', key: 'boxWidth' },
              { label: 'box高', key: 'boxHeight' },
              { label: '边框缩短长度', key: 'width' },
              { label: '边框虚线长度', key: 'backgroundSizeLong' },
              { label: '边框起始位置偏移量', key: 'position' },
              { label: '边框厚度', key: 'thickness' },
              { label: '虚线中实线占比', key: 'borderRate' }
            ]" :key="index" class="flex items-center space-x-2">
              <div class="w-32 text-gray-700">{{ item.label }}：</div>
              <input :value="params[item.key]" type="number" @input="onInput($event, item.key)"
                class="flex-1 px-3 py-2 border-[1px] border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <span class="text-gray-500">px</span>
            </div>

            <div class="flex items-center space-x-2 pt-2">
              <div class="w-32 text-gray-700">虚线颜色：</div>
              <input v-model="params.borderColor" type="color"
                class="w-10 h-10 border-2 border-gray-200 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- 效果预览卡片 -->
        <div
          class="bg-white rounded-xl h-[430px] shadow-lg p-6 w-full max-w-md flex flex-col transform hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl shrink-0 font-semibold mb-4 text-gray-800">效果预览</h2>
          <div class="flex items-center justify-center flex-1 shrink-0 overflow-auto bg-gray-50 rounded-lg">
            <div :style="boxStyle" class="relative border-box-wrap">
              <div :style="borderTopStyle"></div>
              <div :style="borderLeftStyle"></div>
              <div :style="borderBottomStyle"></div>
              <div :style="borderRightStyle"></div>
            </div>
          </div>
        </div>

        <!-- CSS代码输出卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 w-full transform hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">生成的CSS代码</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(item, index) in [
              { label: 'HTML 结构', value: htmlTemplate },
              { label: '.border-wrap', value: boxStyle },
              { label: '.border-top', value: borderTopStyle },
              { label: '.border-left', value: borderLeftStyle },
              { label: '.border-bottom', value: borderBottomStyle },
              { label: '.border-right', value: borderRightStyle }
            ]" :key="index" class="relative">
              <div class="bg-gray-900 rounded-lg p-4 text-white h-32 overflow-auto">
                <pre class="whitespace-pre-wrap font-mono text-sm">{{ formatStyle(item) }}</pre>
              </div>
              <div class="absolute top-2 right-2">
                <button @click="copyToClipboard(formatStyle(item))"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors">
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 复制提示 -->
      <div v-if="showCopyTip"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
        复制成功！
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, ref } from 'vue'

defineOptions({ name: 'view-demo-css-dashed-line-border' })

const showCopyTip = ref(false)

const htmlTemplate = `
<!-- html结构 -->
<div class="border-wrap">
    <div class="border-top"></div>
    <div class="border-left"></div>
    <div class="border-bottom"></div>
    <div class="border-right"></div>
</div>`

const params = reactive({
  boxWidth: 200,
  boxHeight: 200,
  width: 10,
  backgroundSizeLong: 15,
  position: 5,
  thickness: 1,
  borderRate: 50,
  borderColor: '#ff0000'
})

const boxStyle = computed(() => ({
  width: `${params.boxWidth}px`,
  height: `${params.boxHeight}px`,
  position: 'relative'
}))

const borderTopStyle = computed(() => ({
  width: `calc(100% - ${params.width}px)`,
  left: `${params.position}px`,
  top: 0,
  height: `${params.thickness}px`,
  backgroundImage: `linear-gradient(to right, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.backgroundSizeLong}px ${params.thickness}px`,
  backgroundRepeat: 'repeat-x',
  position: 'absolute'
}))

const borderLeftStyle = computed(() => ({
  width: `${params.thickness}px`,
  left: 0,
  top: `${params.position}px`,
  height: `calc(100% - ${params.width}px)`,
  backgroundImage: `linear-gradient(to top, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.thickness}px ${params.backgroundSizeLong}px`,
  backgroundRepeat: 'repeat-y',
  position: 'absolute'
}))

const borderBottomStyle = computed(() => ({
  width: `calc(100% - ${params.width}px)`,
  left: `${params.position}px`,
  bottom: 0,
  height: `${params.thickness}px`,
  backgroundImage: `linear-gradient(to right, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.backgroundSizeLong}px ${params.thickness}px`,
  backgroundRepeat: 'repeat-x',
  position: 'absolute'
}))

const borderRightStyle = computed(() => ({
  width: `${params.thickness}px`,
  top: `${params.position}px`,
  right: 0,
  height: `calc(100% - ${params.width}px)`,
  backgroundImage: `linear-gradient(to top, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.thickness}px ${params.backgroundSizeLong}px`,
  backgroundRepeat: 'repeat-y',
  position: 'absolute'
}))

const onInput = (e, type) => {
  if (!e.target.value) {
    params[type] = 1
    e.target.value = 1
    return
  }
  if (+e.target.value <= 0) {
    params[type] = 1
    e.target.value = 1
    return
  }
  params[type] = (+e.target.value).toFixed(0)
  e.target.value = (+e.target.value).toFixed(0)
}

const formatStyle = (item) => {
  if (item.label === 'HTML 结构') {
    return item.value.trim()
  }

  const style = item.value
  let css = `${item.label} {\n`

  Object.entries(style).forEach(([key, value]) => {
    // 将驼峰式转换为连字符式
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    css += `  ${cssKey}: ${value};\n`
  })

  css += '}'
  return css
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showCopyTip.value = true
    setTimeout(() => {
      showCopyTip.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style lang="scss">
html,
body,
#app,
#page {
  overflow: auto
}
</style>

<style scoped lang="scss">
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
