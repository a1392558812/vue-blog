<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- 模式切换按钮 -->
      <div class="flex justify-center mb-10">
        <div class="inline-flex rounded-lg shadow-sm" role="group">
          <button
            @click="mode = 'scssToCss'"
            class="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-l-lg border-none focus:z-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-blue-700"
          >
            SCSS 转 CSS
          </button>
          <button
            @click="mode = 'cssToScss'"
            class="px-8 py-3 text-lg font-medium text-white bg-gray-600 rounded-r-lg border-none focus:z-10 focus:ring-2 focus:ring-gray-500 transition-all duration-300 hover:bg-gray-700"
          >
            CSS 转 SCSS
          </button>
        </div>
      </div>

      <!-- SCSS转CSS模式 -->
      <div v-if="mode === 'scssToCss'" class="w-full">
        <div class="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">SCSS 转换为 CSS</h2>
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- 输入区域 -->
            <div class="flex-1">
              <div class="mb-3 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-700">SCSS 输入</h3>
                <span class="text-sm text-gray-500">输入SCSS代码</span>
              </div>
              <div class="relative w-full">
                <textarea
                  class="box-content w-[calc(100%-20px*2)] h-[400px] p-[20px] bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none shadow-sm"
                  v-model="scssCode"
                  placeholder="在此输入SCSS代码..."
                />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center justify-center">
              <button
                @click="onCompile"
                class="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
              >
                编译生成
              </button>
            </div>

            <!-- 输出区域 -->
            <div class="flex-1">
              <div class="mb-3 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-700">CSS 输出</h3>
                <span class="text-sm text-gray-500">编译结果</span>
              </div>
              <div class="relative w-full">
                <div class="absolute top-0 right-0 p-2">
                  <button
                    @click="copyToClipboard(resultCss)"
                    class="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    复制
                  </button>
                </div>
                <pre
                  class="box-content w-[calc(100%-20px*2)] h-[400px] p-[20px] bg-gray-800 text-gray-100 rounded-lg text-sm font-mono overflow-auto shadow-sm whitespace-pre-wrap break-all"
                >
                  {{ resultCss || '编译结果将显示在这里...' }}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CSS转SCSS模式 -->
      <div v-if="mode === 'cssToScss'" class="w-full">
        <div class="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">CSS 转换为 SCSS</h2>
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- 输入区域 -->
            <div class="flex-1">
              <div class="mb-3 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-700">CSS 输入</h3>
                <span class="text-sm text-gray-500">输入CSS代码</span>
              </div>
              <div class="relative w-full">
                <textarea
                  class="box-content w-[calc(100%-20px*2)] h-[400px] p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none resize-none shadow-sm"
                  v-model="cssCode"
                  placeholder="在此输入CSS代码..."
                />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center justify-center">
              <button
                @click="onReCompile"
                class="px-6 py-3 cursor-pointer bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105"
              >
                编译生成
              </button>
            </div>

            <!-- 输出区域 -->
            <div class="flex-1">
              <div class="mb-3 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-700">SCSS 输出</h3>
                <span class="text-sm text-gray-500">编译结果</span>
              </div>
              <div class="relative w-full">
                <div class="absolute top-0 right-0 p-2">
                  <button
                    @click="copyToClipboard(resultScss)"
                    class="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    复制
                  </button>
                </div>
                <pre
                  class="box-content w-[calc(100%-20px*2)] h-[400px] p-[20px] bg-gray-800 text-gray-100 rounded-lg text-sm font-mono overflow-auto shadow-sm whitespace-pre-wrap break-all"
                >
                  {{ resultScss || '编译结果将显示在这里...' }}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              提示：此工具支持SCSS和CSS代码的相互转换，输入代码后点击"编译生成"按钮即可查看转换结果。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { compileString } from 'sass'
import { ref } from 'vue'
import css2pre from 'css2pre/lib/css2pre'

const mode = ref('scssToCss')

const scssCode = ref(`
 .test1 {
  .test2 {
    color: red;
    .test3 {
       color: blue;
       .test4 {
           color: green;
          .test5 {
               color: yellow;
          }
       }
    }
  }
 }
`)
const cssCode = ref(`
 .test1 .test2 {
  color: red;
}
.test1 .test2 .test3 {
  color: blue;
}
.test1 .test2 .test3 .test4 {
  color: green;
}
.test1 .test2 .test3 .test4 .test5 {
  color: yellow;
}

.test1 .test2 {
  color: red;
}
.test1 .test2 .test3 {
  color: blue;
}
.test1 .test2 .test3 .test4 {
  color: green;
}
.test1 .test2 .test3 .test4 .test5 {
  color: yellow;
}

.test1 .test2 {
  color: red;
}
.test1 .test2 .test3 {
  color: blue;
}
.test1 .test2 .test3 .test4 {
  color: green;
}
.test1 .test2 .test3 .test4 .test5 {
  color: yellow;
}
`)

const resultCss = ref('')
const resultScss = ref('')

const onCompile = () => {
  try {
    const result = compileString(scssCode.value, { style: 'expanded' })
    resultCss.value = result.css
  } catch (error) {
    resultCss.value = `${error}`
  }
}

const onReCompile = () => {
  try {
    const result = css2pre(resultCss.value).to('scss')
    resultScss.value = result
  } catch (error) {
    resultScss.value = `${error}`
  }
}

// 复制到剪贴板功能
const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    console.log('复制成功')
  })
}
</script>
