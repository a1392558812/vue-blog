<template>
  <div class="h-screen overflow-auto bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="w-[1200px] mx-auto px-4 py-12">
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          汉字书写演示
        </h1>
        <p class="mt-3 text-lg text-gray-600">
          展示汉字书写、描红、盲写等多种交互方式
        </p>
      </div>

      <div class="py-2 mb-2 text-gray-500">网络偶尔可能波动，在线字体是从cdn上引入的</div>

      <div class="hanzi">
        <!-- 突出汉字偏旁 -->
        <div class="mb-8 p-5 bg-white rounded-xl shadow-md">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">突出汉字偏旁</h2>
          <div id="character-target-div1" class="flex flex-wrap gap-3 justify-center"></div>
        </div>

        <!-- 自定义汉字 -->
        <div class="mb-8 p-5 bg-white rounded-xl shadow-md">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">自定义汉字</h2>
          <div class="flex items-center gap-3 mb-4">
            <input v-model="inputValue"
              class="flex-1 p-3 border-2 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-sans text-gray-800 bg-white"
              type="text" placeholder="请输入要展示的汉字" />
            <button @click="handelCreate"
              class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200">
              确定生成
            </button>
          </div>
          <div id="character-target-div4" class="flex flex-wrap gap-3 justify-center"></div>
        </div>

        <!-- 各种汉字展示 -->
        <div class="grid grid-cols-6 gap-[10px]">
          <!-- 描红书写 -->
          <div class="chart-wrap bg-white p-5 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-3">描红书写该字</h3>
            <div class="character-box mx-auto mb-3" id="character-target-div2"></div>
            <button @click="reWrite1"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
              重写
            </button>
            <div class="mt-4 space-y-2 text-sm">
              <div>
                <span class="text-red-500 font-medium">错误提示：</span>
                <span class="text-gray-700">{{ charAnimation2info1 }}</span>
              </div>
              <div>
                <span class="text-green-500 font-medium">每步写完提示：</span>
                <span class="text-gray-700">{{ charAnimation2info2 }}</span>
              </div>
              <div>
                <span class="text-blue-500 font-medium">字写完提示：</span>
                <span class="text-gray-700">{{ charAnimation2info3 }}</span>
              </div>
            </div>
          </div>

          <!-- 醇香的“醇”字盲写 -->
          <div class="chart-wrap bg-white p-5 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-3">醇香的“醇”字盲写</h3>
            <div class="character-box mx-auto" id="character-target-div3"></div>
          </div>

          <!-- 加载本地服务器的汉字 -->
          <div class="chart-wrap bg-white p-5 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-3">加载本地服务器的汉字</h3>
            <div class="character-box mx-auto mb-2" id="character-target-div5"></div>
            <div class="text-xs text-gray-500 text-center">（为了演示只提供个“福”字）</div>
          </div>

          <!-- 静态汉字无笔画 -->
          <div class="chart-wrap bg-white p-5 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-3">静态汉字无笔画</h3>
            <div class="character-box mx-auto" id="character-target-div6"></div>
          </div>

          <!-- 静态汉字无笔画 -->
          <div class="chart-wrap bg-white p-5 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-3">静态汉字无笔画</h3>
            <div id="character-target-div7" class="flex flex-wrap justify-center"></div>
          </div>

          <!-- 带网格的静态汉字 -->
          <div class="chart-wrap bg-white p-5 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-3">带网格的静态汉字</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" class="character-box mx-auto"
              id="character-target-div8">
              <line x1="0" y1="0" x2="150" y2="150" stroke="#DDD" />
              <line x1="150" y1="0" x2="0" y2="150" stroke="#DDD" />
              <line x1="75" y1="0" x2="75" y2="150" stroke="#DDD" />
              <line x1="0" y1="75" x2="150" y2="75" stroke="#DDD" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import HanziWriter from 'hanzi-writer'
import axios from '@/common/axios/index.js'
import { baseUrlFun } from '@/common/util/methods'
function renderFanningStrokes(target, strokes) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.style.width = '75px'
  svg.style.height = '75px'
  svg.style.border = '1px solid #EEE'
  svg.style.marginRight = '3px'
  target.appendChild(svg)
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')

  // set the transform property on the g element so the character renders at 75x75
  const transformData = HanziWriter.getScalingTransform(75, 75)
  group.setAttributeNS(null, 'transform', transformData.transform)
  svg.appendChild(group)

  strokes.forEach(function (strokePath) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttributeNS(null, 'd', strokePath)
    // style the character paths
    path.style.fill = '#555'
    group.appendChild(path)
  })
}
export default {
  name: 'view-demo-character',
  setup() {
    const charAnimation2info1 = ref('')
    const charAnimation2info2 = ref('')
    const charAnimation2info3 = ref('')
    const inputValue = ref('')
    let writer1
    const charAnimation1 = (str = '长风破浪会有时', targetId = 'character-target-div1') => {
      const charList = []

      str.split('').forEach((char) => {
        charList.push(
          HanziWriter.create(targetId, char, {
            width: 100,
            height: 100,
            padding: 5,
            showOutline: false,
            strokeAnimationSpeed: 8, // 5x normal speed
            delayBetweenStrokes: 10, // milliseconds
            radicalColor: '#337ab7', // blue
            delayBetweenLoops: 1000,
            showCharacter: false
          })
        )
      })
      const loopRender = () => {
        charList.forEach((charResult) => {
          charResult.hideCharacter()
        })
        let promise = Promise.resolve()
        charList.forEach((charItem, index) => {
          promise = promise.then(() => charItem.animateCharacter())
          if (index === charList.length - 1) {
            promise.then(() => loopRender())
          }
        })
      }
      loopRender()
    }
    const charAnimation2 = () => {
      writer1 = HanziWriter.create('character-target-div2', '妲', {
        width: 150,
        height: 150,
        showCharacter: false,
        padding: 5
      })
      writer1.quiz({
        onMistake: (strokeData) => {
          charAnimation2info1.value = `你刚刚在第${strokeData.strokeNum + 1}画写错，
            目前为止你在该画写错${strokeData.mistakesOnStroke}次，
            一共在该字写错${strokeData.totalMistakes}次，
            还剩${strokeData.strokesRemaining}画写完`
        },
        onCorrectStroke: (strokeData) => {
          charAnimation2info2.value = `当前正在书写第${strokeData.strokeNum + 1}画，
            在这一画上写错次数为${strokeData.mistakesOnStroke}，
            拢共写错次数为${strokeData.totalMistakes}，还剩${strokeData.strokesRemaining}画写完`
        },
        onComplete: (summaryData) => {
          charAnimation2info3.value = `字写完了，你刚写完了${summaryData.totalMistakes}画的${summaryData.character}`
        }
      })
    }
    const charAnimation3 = () => {
      const writer = HanziWriter.create('character-target-div3', '醇', {
        width: 150,
        height: 150,
        showCharacter: false,
        showOutline: false,
        showHintAfterMisses: 1,
        highlightOnComplete: false,
        padding: 5
      })
      writer.quiz()
    }
    const charAnimation4 = () => {
      HanziWriter.create('character-target-div5', '福', {
        width: 150,
        height: 150,
        showCharacter: false,
        padding: 5,
        charDataLoader: (char, onComplete) => {
          axios.get(`${baseUrlFun()}demo-static/hanzi/福.json`).then((res) => {
            onComplete(res.data)
          })
        }
      }).quiz()
    }
    const charAnimation5 = (targetDomId = 'character-target-div6') => {
      HanziWriter.loadCharacterData('静').then(function (charData) {
        const target = document.getElementById(targetDomId)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.style.width = '150px'
        svg.style.height = '150px'
        target.appendChild(svg)
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')

        // set the transform property on the g element so the character renders at 150x150
        const transformData = HanziWriter.getScalingTransform(150, 150)
        group.setAttributeNS(null, 'transform', transformData.transform)
        svg.appendChild(group)

        charData.strokes.forEach(function (strokePath) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          path.setAttributeNS(null, 'd', strokePath)
          // style the character paths
          path.style.fill = '#555'
          group.appendChild(path)
        })
      })
    }
    const charAnimation6 = () => {
      HanziWriter.loadCharacterData('静').then(function (charData) {
        const target = document.getElementById('character-target-div7')
        for (let i = 0; i < charData.strokes.length; i++) {
          const strokesPortion = charData.strokes.slice(0, i + 1)
          renderFanningStrokes(target, strokesPortion)
        }
      })
    }
    onMounted(() => {
      charAnimation1()
      charAnimation2()
      charAnimation3()
      charAnimation4()
      charAnimation5()
      charAnimation6()
      charAnimation5('character-target-div8')
    })
    return {
      charAnimation2info1,
      charAnimation2info2,
      charAnimation2info3,
      inputValue,
      handelCreate: () => {
        if (
          !/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/g.test(
            inputValue.value
          )
        ) {
          alert('请输入纯汉字')
        } else {
          $('#character-target-div4').empty()
          charAnimation1(inputValue.value, 'character-target-div4')
        }
      },
      reWrite1: () => {
        writer1.hideCharacter({
          onComplete: () => {
            $(writer1.target.node).remove()
            charAnimation2()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hanzi {
  .chart-wrap {
    width: 150px;
    min-width: 150px;
  }

  .character-box {
    width: 150px;
    height: 150px;
    border: 1px solid #ddd;
    background-color: #fafafa;
    border-radius: 4px;
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
