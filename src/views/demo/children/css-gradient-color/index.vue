<template>
  <div class="gradient-generator min-h-screen bg-gray-50 text-gray-900">
    <main class="w-[1400px] mx-auto px-4 py-8">
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-1 space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">过渡方向</h2>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="(dir, index) in directions"
                :key="index"
                @click="selectedDirection = dir.value"
                :class="`p-3 rounded-lg transition-all ${selectedDirection === dir.value ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100 hover:bg-gray-200'}`"
              >
                <span class="text-xl">{{ dir.emoji }}</span>
                <span class="block text-xs mt-1">{{ dir.label }}</span>
              </button>
            </div>

            <div v-if="selectedDirection === 'angle'" class="mt-4">
              <label class="block text-sm font-medium mb-2">角度 (0-360°)</label>
              <input
                type="range"
                min="0"
                max="360"
                v-model="angle"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div class="flex justify-between mt-1">
                <span class="text-sm">{{ angle }}°</span>
                <button @click="angle = 0" class="text-xs text-blue-500 hover:underline">
                  重置
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">过渡颜色</h2>
              <button
                @click="addColorStop"
                class="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors flex items-center"
                :disabled="colorStops.length >= 8"
              >
                添加颜色
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(stop, index) in colorStops" :key="index" class="flex items-center gap-3">
                <input
                  type="color"
                  v-model="stop.color"
                  class="w-10 h-10 p-0 border border-gray-200 rounded cursor-pointer"
                />

                <input
                  type="text"
                  v-model="stop.color"
                  class="w-24 px-3 py-2 text-sm bg-gray-100 rounded border-1 border-solid border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div class="flex items-center">
                  <input
                    type="number"
                    v-model.number="stop.position"
                    min="0"
                    max="100"
                    class="w-10 mr-1 px-3 py-2 text-sm bg-gray-100 rounded border-1 border-solid border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="shrink-0 text-xs text-gray-500">%</span>
                </div>

                <button
                  @click="removeColorStop(index)"
                  class="text-gray-500 block hover:text-red-500 p-2 transition-colors cursor-pointer"
                  :disabled="colorStops.length <= 2"
                  aria-label="删除颜色"
                >
                  <span>删除颜色🗑️</span>
                </button>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <button
                @click="sortColorStops"
                class="text-sm text-blue-500 hover:text-blue-600 flex items-center"
              >
                <span class="mr-1">🔄</span> 按位置排序
              </button>
            </div>
          </div>
        </div>

        <div class="col-span-2 space-y-6">
          <!-- 预览区域 -->
          <div
            class="bg-white rounded-xl shadow-sm p-6 h-64 flex items-center justify-center overflow-hidden"
          >
            <div
              class="w-full h-full rounded-lg shadow-inner flex items-center justify-center text-white font-bold text-2xl"
              :style="gradientStyle"
            >
              预览
            </div>
          </div>

          <!-- 代码区域 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center mb-4">
              <h2 class="text-lg font-semibold mr-4">CSS 代码</h2>
              <button
                @click="copyToClipboard"
                class="w-9 h-9 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                :title="copied ? '已复制' : '复制到剪贴板'"
              >
                <span>{{ copied ? '✔' : '📋' }}</span>
              </button>
            </div>

            <div class="relative">
              <pre
                class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono"
              ><code>{{ cssCode }}</code></pre>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3">
              <div>
                <h3 class="text-sm font-medium mb-2">适用属性</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 text-xs bg-gray-100 rounded">background</span>
                  <span class="px-2 py-1 text-xs bg-gray-100 rounded">background-image</span>
                  <span class="px-2 py-1 text-xs bg-gray-100 rounded">border-image</span>
                  <span class="px-2 py-1 text-xs bg-gray-100 rounded">text-fill-color</span>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium mb-2">使用示例</h3>
                <div class="text-xs bg-gray-100 p-3 rounded font-mono">
                  .element {<br />
                  &nbsp;&nbsp;background: {{ cssCode }};<br />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const directions = [
  { label: '水平', value: 'to right', emoji: '↔️' },
  { label: '垂直', value: 'to bottom', emoji: '↕️' },
  { label: '对角', value: 'to bottom right', emoji: '↘️' },
  { label: '对角', value: 'to bottom left', emoji: '↙️' },
  { label: '径向', value: 'radial', emoji: '🔵' },
  { label: '角度', value: 'angle', emoji: '🔄' }
]

const selectedDirection = ref('angle')
const angle = ref(45)
const colorStops = ref([
  { color: '#4f46e5', position: 0 },
  { color: '#ec4899', position: 100 }
])
const copied = ref(false)

const addColorStop = () => {
  if (colorStops.value.length >= 8) return

  const positions = colorStops.value.map((s) => s.position).sort((a, b) => a - b)
  let newPos = 50

  for (let i = 0; i < positions.length - 1; i++) {
    const mid = (positions[i] + positions[i + 1]) / 2
    if (Math.abs(mid - 50) < Math.abs(newPos - 50)) {
      newPos = mid
    }
  }

  // 生成随机颜色
  const randomColor =
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')

  colorStops.value.push({
    color: randomColor,
    position: Math.round(newPos)
  })
}

// 删除颜色点
const removeColorStop = (index) => {
  if (colorStops.value.length <= 2) return
  colorStops.value.splice(index, 1)
}

// 按位置排序
const sortColorStops = () => {
  colorStops.value.sort((a, b) => a.position - b.position)
}

// 生成渐变样式
const gradientStyle = computed(() => {
  let direction

  if (selectedDirection.value === 'radial') {
    direction = 'radial-gradient(circle, '
  } else if (selectedDirection.value === 'angle') {
    direction = `linear-gradient(${angle.value}deg, `
  } else {
    direction = `linear-gradient(${selectedDirection.value}, `
  }

  // 按位置排序颜色点
  const sortedStops = [...colorStops.value].sort((a, b) => a.position - b.position)

  // 生成颜色点字符串
  const stops = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')

  return {
    background: `${direction}${stops})`
  }
})

// 生成CSS代码
const cssCode = computed(() => {
  let direction

  if (selectedDirection.value === 'radial') {
    direction = 'radial-gradient(circle, '
  } else if (selectedDirection.value === 'angle') {
    direction = `linear-gradient(${angle.value}deg, `
  } else {
    direction = `linear-gradient(${selectedDirection.value}, `
  }

  // 按位置排序颜色点
  const sortedStops = [...colorStops.value].sort((a, b) => a.position - b.position)

  // 生成颜色点字符串
  const stops = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')

  return `${direction}${stops})`
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(cssCode.value).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>
