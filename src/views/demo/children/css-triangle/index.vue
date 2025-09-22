<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
    <div class="w-[1500px] mx-auto">

      <div class="flex flex-wrap gap-6 justify-center">
        <!-- 参数设置卡片 -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 flex-1 shrink-0 transform hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-800">参数设置</h2>

          <div class="space-y-4">
            <!-- 方向选择 -->
            <div class="flex items-center space-x-4">
              <label for="direction" class="w-24 text-gray-700 font-medium">方向：</label>
              <select id="direction" v-model="params.direction"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white">
                <option v-for="(item, index) in [
                  { label: '上', value: 'top' },
                  { label: '下', value: 'bottom' },
                  { label: '左', value: 'left' },
                  { label: '右', value: 'right' }
                ]" :value="item.value" :key="index">
                  {{ item.label }}
                </option>
              </select>
            </div>

            <!-- 宽度输入 -->
            <div class="flex items-center space-x-4">
              <label for="width" class="w-24 text-gray-700 font-medium">宽：</label>
              <div class="relative flex-1">
                <input id="width"
                  class="w-[calc(100%-20px-30px)] box-content pl-[20px] pr-[30px] py-2 border-[1px] border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  type="number" :value="params.width" @input="onInput($event, 'width')" placeholder="请输入三角形的宽" min="0"
                  max="100" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 leading-[1]">px</span>
              </div>
            </div>

            <!-- 高度输入 -->
            <div class="flex items-center space-x-4">
              <label for="height" class="w-24 text-gray-700 font-medium">高：</label>
              <div class="relative flex-1">
                <input id="height"
                  class="w-[calc(100%-20px-30px)] box-content pl-[20px] pr-[30px] py-2 border-[1px] border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  type="number" :value="params.height" @input="onInput($event, 'height')" placeholder="请输入三角形的高" min="0"
                  max="100" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 leading-[1]">px</span>
              </div>
            </div>

            <!-- 旋转角度输入 -->
            <div class="flex items-center space-x-4">
              <label for="angle" class="w-24 text-gray-700 font-medium">旋转角度：</label>
              <div class="relative flex-1">
                <input id="angle"
                  class="w-[calc(100%-20px-30px)] box-content pl-[20px] pr-[30px] py-2 border-[1px] border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  type="number" :value="params.angle" @input="onInput($event, 'angle')" placeholder="请输入旋转角度" min="0"
                  max="360" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 leading-[1]">°</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 预览和代码卡片 -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 flex-1 shrink-0 max-w-md transform hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">效果预览</h2>

          <!-- 三角形预览区域 -->
          <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg mb-6">
            <div class="css-triangle-output" :style="triangleStyle"></div>
          </div>

          <!-- CSS代码显示 -->
          <div class="relative">
            <h3 class="text-lg font-medium mb-2 text-gray-700">生成的CSS代码</h3>
            <div class="bg-gray-900 rounded-lg p-4 text-white h-48 overflow-auto">
              <pre class="whitespace-pre-wrap font-mono text-sm">{{ formatTriangleStyle() }}</pre>
            </div>
            <button @click="copyToClipboard(formatTriangleStyle())"
              class="absolute top-10 right-2 bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded text-xs transition-colors">
              复制
            </button>
          </div>
        </div>

        <!-- 示例和说明卡片 -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 flex-1 shrink-0 transform hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">CSS border 原理</h2>

          <div class="flex flex-col items-center mb-6">
            <div class="mb-4">
              <div :style="boxStyle"></div>
            </div>
            <p class="text-gray-600 text-center max-w-md">
              CSS三角形利用了border属性的特性。当宽高为0时，border会形成四个三角形，通过设置其他三边为透明色，就能得到想要的三角形。
            </p>
          </div>

          <!-- 基础代码展示 -->
          <div class="relative">
            <h3 class="text-lg font-medium mb-2 text-gray-700">基础边框样式</h3>
            <div class="bg-gray-900 rounded-lg p-4 text-white h-32 overflow-auto">
              <pre class="whitespace-pre-wrap font-mono text-sm">{{ formatBoxStyle() }}</pre>
            </div>
            <button @click="copyToClipboard(formatBoxStyle())"
              class="absolute top-10 right-2 bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded text-xs transition-colors">
              复制
            </button>
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
import { computed, reactive, ref } from 'vue'

defineOptions({ name: 'view-demo-css-triangle' })

const showCopyTip = ref(false)

const boxStyle = {
  width: 0,
  height: 0,
  border: '100px solid',
  borderColor: '#FFA500 #ff0000 #008000 #808080'
}

const params = reactive({
  width: 50,
  height: 50,
  direction: 'bottom',
  angle: 0
})

const onInput = (e, type) => {
  if (!e.target.value) {
    params[type] = 0
    e.target.value = 0
  }
  if (type === 'angle') {
    if (+e.target.value > 360) {
      params.angle = 360
      e.target.value = 360
      return
    }
    if (+e.target.value < 0) {
      params.angle = 0
      e.target.value = 0
      return
    }
    params.angle = (+e.target.value).toFixed(0)
    e.target.value = (+e.target.value).toFixed(0)
  }
  if (type === 'width' || type === 'height') {
    if (+e.target.value > 100) {
      params[type] = 100
      e.target.value = 100
      return
    }
    if (+e.target.value < 0) {
      params[type] = 0
      e.target.value = 0
      return
    }
    params[type] = (+e.target.value).toFixed(0)
    e.target.value = (+e.target.value).toFixed(0)
  }
}

const triangleStyle = computed(() => {
  let borderWidth = ''
  let borderColor = ''
  switch (params.direction) {
    case 'top':
      borderWidth = `0 ${params.width}px ${params.height}px ${params.width}px`
      borderColor = 'transparent transparent red transparent'
      break
    case 'bottom':
      borderWidth = `${params.height}px ${params.width}px 0 ${params.width}px`
      borderColor = 'red transparent transparent  transparent'
      break
    case 'left':
      borderWidth = `${params.height}px ${params.width}px ${params.height}px 0`
      borderColor = 'transparent red transparent  transparent'
      break
    case 'right':
      borderWidth = `${params.height}px 0 ${params.height}px ${params.width}px`
      borderColor = 'transparent transparent transparent red'
      break
  }
  return {
    display: 'inline-block',
    width: '0',
    height: '0',
    borderStyle: 'solid',
    transform: `rotate(${params.angle}deg)`,
    borderWidth,
    borderColor
  }
})

// 格式化三角形样式为CSS代码
const formatTriangleStyle = () => {
  const style = triangleStyle.value
  let css = `.triangle {\n`

  Object.entries(style).forEach(([key, value]) => {
    // 将驼峰式转换为连字符式
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    css += `  ${cssKey}: ${value};\n`
  })

  css += '}'
  return css
}

// 格式化盒子样式为CSS代码
const formatBoxStyle = () => {
  let css = `.border-demo {\n`

  Object.entries(boxStyle).forEach(([key, value]) => {
    // 将驼峰式转换为连字符式
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    css += `  ${cssKey}: ${value};\n`
  })

  css += '}'
  return css
}

// 复制到剪贴板功能
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

/* 三角形输出样式 */
.css-triangle-output {
  transition: all 0.3s ease;
}
</style>
