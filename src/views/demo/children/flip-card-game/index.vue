<template>
  <div class="flex flex-col items-center gap-[20px] p-[20px]">
    <h2>第 {{ level }} 关</h2>
    <div class="grid gap-[10px]" :style="gridStyle">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="relative cursor-pointer [transform-style:preserve-3d] [transition:transform_0.6s]"
        :style="{
          ...(card.isFlipped ? { transform: 'rotateY(180deg)' } : {}),
          ...(card.isMatched ? { opacity: '0.4', cursor: 'not-allowed' } : {}),
          ...(card.isProcessing ? { pointerEvents: 'none' } : {})
        }"
        @click="flipCard(index)"
      >
        <div
          class="absolute w-full h-full [backface-visibility:hidden] flex justify-center items-center text-[24px] font-bold rounded-[8px] [box-shadow:0_4px_8px_rgba(0,_0,_0,_0.1)] bg-[#fff] border-[2px] border-solid border-[#2196f3] [transform:rotateY(180deg)]"
        >
          {{ card.value }}
        </div>
        <div
          class="absolute w-full h-full [backface-visibility:hidden] flex justify-center items-center text-[24px] font-bold rounded-[8px] [box-shadow:0_4px_8px_rgba(0,_0,_0,_0.1)] bg-[#2196f3] border-[2px] border-solid border-[#fff]"
        ></div>
      </div>
    </div>
    <div v-if="isAllMatched" class="mt-[20px]">
      <button
        class="px-[20px] py-[10px] text-[16px] bg-[#4caf50] text-[white] border-none rounded-[5px] cursor-pointer [transition:background_0.3s] hover:bg-[#45a049]"
        @click="nextLevel"
      >
        进入第 {{ level + 1 }} 关
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const level = ref(0)
const cards = ref([])
const flippedCards = ref([])
const isProcessing = ref(false)
const isAllMatched = ref(false)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${currentLevelConfig.value.cols}, 100px)`,
  gridTemplateRows: `repeat(${currentLevelConfig.value.rows}, 140px)`
}))

const currentLevelConfig = ref({
  rows: 1,
  cols: 2
})

// 生成卡片数据
function generateCards() {
  const totalCards = currentLevelConfig.value.rows * currentLevelConfig.value.cols
  const numbers = Array.from({ length: totalCards / 2 }, (_, i) => i + 1)
  const duplicatedNumbers = [...numbers, ...numbers]

  // 洗牌算法
  const shuffled = duplicatedNumbers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => ({
      value,
      isFlipped: false,
      isMatched: false
    }))

  cards.value = shuffled
}

// 点击卡片
function flipCard(index) {
  if (isProcessing.value || cards.value[index].isMatched || cards.value[index].isFlipped) return

  cards.value[index].isFlipped = true
  flippedCards.value.push(index)

  if (flippedCards.value.length === 2) {
    checkMatch()
  }
}

// 检查匹配
function checkMatch() {
  isProcessing.value = true
  const [first, second] = flippedCards.value

  setTimeout(() => {
    if (cards.value[first].value === cards.value[second].value) {
      cards.value[first].isMatched = true
      cards.value[second].isMatched = true
      checkAllMatched()
      resetSelection()
    } else {
      cards.value[first].isFlipped = false
      cards.value[second].isFlipped = false
      resetSelection()
    }
  }, 1000)
}

function checkAllMatched() {
  isAllMatched.value = cards.value.every((card) => card.isMatched)
}

function resetSelection() {
  flippedCards.value = []
  isProcessing.value = false
}

const setCurrentLevelConfig = () => {
  if (currentLevelConfig.value.rows > currentLevelConfig.value.cols) {
    currentLevelConfig.value.cols = currentLevelConfig.value.cols + 1
  } else {
    currentLevelConfig.value.rows = currentLevelConfig.value.rows + 1
  }
  if ((currentLevelConfig.value.rows * currentLevelConfig.value.cols) % 2 > 0) {
    setCurrentLevelConfig()
  }
}

function nextLevel() {
  level.value++
  setCurrentLevelConfig()
  isAllMatched.value = false
  generateCards()
}

onMounted(generateCards)
</script>

<style scoped></style>
