<template>
  <div>
    <div>可修改路径参数?size=5或者?size=20等修改棋盘大小</div>
    <div class="flex items-center gap-[20px] p-[20px]">
      <h2 class="m-0 text-[#333] shrink-[0]">当前玩家：{{ currentPlayer }}</h2>
      <div class="shrink-[0] border-[2px] border-solid border-[#333] bg-[#f0d9b5]">
        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex">
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="cell w-[25px] h-[25px] border-[1px] border-solid border-[#999] cursor-pointer relative [transition:background-color_0.3s]"
            :class="{ black: cell === 1, white: cell === 2 }"
            @click="placePiece(rowIndex, colIndex)"
          ></div>
        </div>
      </div>
      <div class="shrink-[0]">
        <button class="mb-[10px]" @click="resetGame">重新开始</button>
        <h3 class="m-0 mb-[10px] text-[#333]" v-if="winner">
          {{ winner === 'draw' ? '平局！' : `获胜者：${winner}` }}
        </h3>
        <div class="history">
          <h4 class="mb-[10px]">历史记录（{{ steps.length }}步）</h4>
          <button
            @click="undo"
            class="px-[20px] py-[10px] text-[16px] leading-[1] cursor-pointer bg-[#4caf50] hover:bg-[rgba(0,_0,_0,_0.1)] text-[white] border-none rounded-[5px] [transition:background_0.3s] hover:bg-[#45a049]"
            :disabled="steps.length === 0"
          >
            悔棋
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'gobang-game'
})

const route = useRoute()

console.log('route', route.query.size)

// 棋盘尺寸
const BOARD_SIZE = +(route.query.size || 30)

// 游戏状态
const board = reactive(
  Array(BOARD_SIZE)
    .fill()
    .map(() => Array(BOARD_SIZE).fill(0))
)
const currentPlayer = ref(1) // 1: 黑棋，2: 白棋
const winner = ref(null)

const steps = ref([]) // 记录棋谱

// 方向向量：水平、垂直、两个对角线
const directions = [
  [1, 0], // 水平
  [0, 1], // 垂直
  [1, 1], // 主对角线
  [1, -1] // 副对角线
]

// 放置棋子
const placePiece = (row, col) => {
  if (board[row][col] === 0 && !winner.value) {
    steps.value.push({ row, col, player: currentPlayer.value })
    board[row][col] = currentPlayer.value
    checkWin(row, col)
    if (!winner.value) currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
  }
}

// 检查胜利条件
const checkWin = (row, col) => {
  const player = currentPlayer.value

  for (const [dx, dy] of directions) {
    let count = 1

    // 正向检查
    let i = 1
    while (
      row + dx * i >= 0 &&
      row + dx * i < BOARD_SIZE &&
      col + dy * i >= 0 &&
      col + dy * i < BOARD_SIZE &&
      board[row + dx * i][col + dy * i] === player
    ) {
      count++
      i++
    }

    // 反向检查
    i = 1
    while (
      row - dx * i >= 0 &&
      row - dx * i < BOARD_SIZE &&
      col - dy * i >= 0 &&
      col - dy * i < BOARD_SIZE &&
      board[row - dx * i][col - dy * i] === player
    ) {
      count++
      i++
    }

    if (count >= 5) {
      winner.value = player === 1 ? '黑棋' : '白棋'
      return
    }
  }

  // 检查平局
  if (board.flat().every((cell) => cell !== 0)) {
    winner.value = 'draw'
  }
}

// 重置游戏
const resetGame = () => {
  board.forEach((row) => row.fill(0))
  currentPlayer.value = 1
  winner.value = null
}

// 悔棋
const undo = () => {
  if (steps.value.length > 0) {
    const lastStep = steps.value.pop()
    board[lastStep.row][lastStep.col] = 0
    currentPlayer.value = lastStep.player
    winner.value = null
  }
}
</script>

<style scoped>
.cell::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.cell.black::after {
  background: #333;
  opacity: 1;
}

.cell.white::after {
  background: #fff;
  border: 2px solid #333;
  opacity: 1;
}
</style>
