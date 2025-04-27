<template>
  <div class="flex gap-[20px] p-[20px]">
    <div class="p-[10px] rounded-[20px] bg-[#eee]">
      <div v-for="(row, y) in board" :key="y" class="flex">
        <div
          v-for="(piece, x) in row"
          :key="x"
          class="board-item w-[70px] h-[70px] flex justify-center items-center relative cursor-pointer"
          :class="boardItemClass(x, y)"
          @click="handleCellClick(x, y)"
        >
          <div
            class="w-[50px] h-[50px] text-[28px] lh-[1] flex items-center justify-center font-bold absolute z-[10]"
            :style="boardItemStyle(piece, x, y)"
          >
            {{ piece?.type && piecesMap[piece.type][piece.color] }}
          </div>
          <view
            v-show="validMoves.some((pos) => pos.x === x && pos.y === y)"
            class="w-[10px] h-[10px] bg-[#090] rounded-full absolute z-[10]"
          ></view>
        </div>
      </div>
    </div>
    <div class="p-[20px] text-[18px] lh-[1.5]">
      当前玩家：{{ currentPlayer }}<br />
      游戏状态：{{ gameStatus }}
      <div class="controls">
        <button class="mr-[10px]" @click="resetGame">重新开始</button>
        <button @click="undoMove" :disabled="!canUndo">悔棋</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

defineOptions({
  name: 'chess-board'
})

const currentPlayer = ref('red')
const selectedPos = ref(null)
const gameStatus = ref('进行中')

const piecesMap = {
  king: { red: '帥', black: '將' },
  guard: { red: '仕', black: '士' },
  elephant: { red: '相', black: '象' },
  horse: { red: '傌', black: '馬' },
  chariot: { red: '俥', black: '車' },
  cannon: { red: '炮', black: '砲' },
  soldier: { red: '兵', black: '卒' }
}

const initialBoard = [
  [
    { type: 'chariot', color: 'black' },
    { type: 'horse', color: 'black' },
    { type: 'elephant', color: 'black' },
    { type: 'guard', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'guard', color: 'black' },
    { type: 'elephant', color: 'black' },
    { type: 'horse', color: 'black' },
    { type: 'chariot', color: 'black' }
  ],
  [null, null, null, null, null, null, null, null, null],
  [
    null,
    { type: 'cannon', color: 'black' },
    null,
    null,
    null,
    null,
    null,
    { type: 'cannon', color: 'black' },
    null
  ],
  [
    { type: 'soldier', color: 'black' },
    null,
    { type: 'soldier', color: 'black' },
    null,
    { type: 'soldier', color: 'black' },
    null,
    { type: 'soldier', color: 'black' },
    null,
    { type: 'soldier', color: 'black' }
  ],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [
    { type: 'soldier', color: 'red' },
    null,
    { type: 'soldier', color: 'red' },
    null,
    { type: 'soldier', color: 'red' },
    null,
    { type: 'soldier', color: 'red' },
    null,
    { type: 'soldier', color: 'red' }
  ],
  [
    null,
    { type: 'cannon', color: 'red' },
    null,
    null,
    null,
    null,
    null,
    { type: 'cannon', color: 'red' },
    null
  ],
  [null, null, null, null, null, null, null, null, null],
  [
    { type: 'chariot', color: 'red' },
    { type: 'horse', color: 'red' },
    { type: 'elephant', color: 'red' },
    { type: 'guard', color: 'red' },
    { type: 'king', color: 'red' },
    { type: 'guard', color: 'red' },
    { type: 'elephant', color: 'red' },
    { type: 'horse', color: 'red' },
    { type: 'chariot', color: 'red' }
  ]
]

const board = reactive(JSON.parse(JSON.stringify(initialBoard)))

const validMoves = ref([])

// 游戏历史记录
const gameHistory = ref([])
const canUndo = computed(() => gameHistory.value.length > 0)
const boardItemStyle = computed(() => {
  return (piece, x, y) => {
    const style = {}
    if (piece?.type && piecesMap[piece.type][piece.color]) {
      if (selectedPos.value?.x === x && selectedPos.value?.y === y) {
        style.backgroundColor = '#9f9'
      } else {
        style.backgroundColor = '#fff'
      }
      if (piece && piece.color) {
        style.color = piece.color
        style.border = '2px solid #333'
        style.borderRadius = '50%'
      }
    }
    return style
  }
})

const boardItemClass = computed(() => {
  return (x, y) => {
    if (y < 0 || y >= board.length) return false
    const currentRow = board[y]
    if (!Array.isArray(currentRow)) return false
    if (x < 0 || x >= currentRow.length) return false

    // 获取边界参数
    const lastRowIndex = board.length - 1
    const lastColIndex = currentRow.length - 1

    // 判断四个角落
    if (x === 0 && y === 0) return 'board-item-left-top'
    if (x === lastColIndex && y === 0) return 'board-item-right-top'
    if (x === 0 && y === lastRowIndex) return 'board-item-left-bottom'
    if (x === lastColIndex && y === lastRowIndex) return 'board-item-right-bottom'

    // 判断四条边（排除角落情况）
    if (y === 0) return 'board-item-top-edge'
    if (y === lastRowIndex) return 'board-item-bottom-edge'
    if (x === 0) return 'board-item-left-edge'
    if (x === lastColIndex) return 'board-item-right-edge'

    return ''
  }
})

// 修改游戏状态初始化

const isInPalace = (x, y, color) => {
  const palaceX = [3, 4, 5]
  const palaceY = color === 'red' ? [7, 8, 9] : [0, 1, 2]
  return palaceX.includes(x) && palaceY.includes(y)
}

const getPieceCountBetween = (x1, y1, x2, y2) => {
  // 只处理直线情况
  if (x1 !== x2 && y1 !== y2) return 0

  let count = 0
  const dx = x2 - x1
  const dy = y2 - y1
  const steps = Math.max(Math.abs(dx), Math.abs(dy))
  const xStep = dx === 0 ? 0 : dx / Math.abs(dx)
  const yStep = dy === 0 ? 0 : dy / Math.abs(dy)

  for (let i = 1; i < steps; i++) {
    const checkX = x1 + xStep * i
    const checkY = y1 + yStep * i
    if (board[checkY][checkX]) count++
  }
  return count
}
const getValidMoves = (x, y, piece) => {
  const moves = []
  const isSameColor = (tx, ty) => board[ty]?.[tx]?.color === piece.color
  const isEmpty = (tx, ty) => !board[ty]?.[tx]

  switch (piece.type) {
    case 'king': // 将/帅
      ;[
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ].forEach(([dx, dy]) => {
        const nx = x + dx,
          ny = y + dy
        if (isInPalace(nx, ny, piece.color) && !isSameColor(nx, ny)) {
          moves.push({ x: nx, y: ny })
        }
      })
      break
    case 'guard': // 士
      ;[
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ].forEach(([dx, dy]) => {
        const nx = x + dx,
          ny = y + dy
        if (isInPalace(nx, ny, piece.color) && !isSameColor(nx, ny)) {
          moves.push({ x: nx, y: ny })
        }
      })
      break
    case 'elephant': // 象
      ;[
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2]
      ].forEach(([dx, dy]) => {
        const nx = x + dx,
          ny = y + dy
        const eyeX = x + dx / 2,
          eyeY = y + dy / 2 // 象眼位置
        const validArea = piece.color === 'red' ? ny >= 5 : ny <= 4
        if (validArea && !board[eyeY]?.[eyeX] && !isSameColor(nx, ny)) {
          moves.push({ x: nx, y: ny })
        }
      })
      break
    case 'horse': // 马
      const horseMoves = [
        [-1, -2],
        [-2, -1], // 左上
        [-2, 1],
        [-1, 2], // 右上
        [1, 2],
        [2, 1], // 右下
        [2, -1],
        [1, -2] // 左下
      ]
      horseMoves.forEach(([dx, dy]) => {
        const nx = x + dx
        const ny = y + dy

        // 计算马脚位置（根据移动方向）
        let legX, legY
        if (Math.abs(dx) > Math.abs(dy)) {
          legX = x + (dx > 0 ? 1 : -1)
          legY = y
        } else {
          legX = x
          legY = y + (dy > 0 ? 1 : -1)
        }

        if (
          !isSameColor(nx, ny) &&
          nx >= 0 &&
          nx <= 8 &&
          ny >= 0 &&
          ny <= 9 &&
          !board[legY]?.[legX] // 检查马脚位置是否为空
        ) {
          moves.push({ x: nx, y: ny })
        }
      })
      break
    case 'chariot': // 车
      for (const dir of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]) {
        let step = 1
        while (true) {
          const nx = x + dir[0] * step
          const ny = y + dir[1] * step
          if (nx < 0 || nx > 8 || ny < 0 || ny > 9) break
          if (isSameColor(nx, ny)) break
          moves.push({ x: nx, y: ny })
          if (board[ny][nx]) break // 遇到棋子停止
          step++
        }
      }
      break
    case 'cannon': // 炮
      for (const dir of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]) {
        let step = 1
        let hasObstacle = false
        while (true) {
          const nx = x + dir[0] * step
          const ny = y + dir[1] * step
          if (nx < 0 || nx > 8 || ny < 0 || ny > 9) break

          const targetPiece = board[ny][nx]

          if (!targetPiece) {
            // 移动时需要路径畅通
            if (!hasObstacle) {
              moves.push({ x: nx, y: ny })
            }
          } else {
            if (hasObstacle) {
              // 吃子时需要中间有一个障碍
              if (!isSameColor(nx, ny)) {
                moves.push({ x: nx, y: ny })
              }
              break
            } else {
              hasObstacle = true // 标记遇到第一个障碍
            }
          }
          step++
        }
      }
      break
    case 'soldier': // 兵/卒
      const directions =
        piece.color === 'red'
          ? y > 4
            ? [[0, -1]]
            : [
                [0, -1],
                [-1, 0],
                [1, 0]
              ] // 红方
          : y < 5
            ? [[0, 1]]
            : [
                [0, 1],
                [-1, 0],
                [1, 0]
              ] // 黑方

      directions.forEach(([dx, dy]) => {
        const nx = x + dx,
          ny = y + dy
        if (!isSameColor(nx, ny)) {
          moves.push({ x: nx, y: ny })
        }
      })
      break
  }

  return moves.filter(
    (pos) => pos.x >= 0 && pos.x <= 8 && pos.y >= 0 && pos.y <= 9 && !isSameColor(pos.x, pos.y)
  )
}
// checkFaceToFace函数
const checkFaceToFace = () => {
  let redKing = null,
    blackKing = null

  // 正确遍历棋盘查找将帅位置
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x]
      if (piece?.type === 'king') {
        if (piece.color === 'red') {
          redKing = { x, y }
        } else {
          blackKing = { x, y }
        }
      }
    }
  }

  if (redKing && blackKing && redKing.x === blackKing.x) {
    const minY = Math.min(redKing.y, blackKing.y)
    const maxY = Math.max(redKing.y, blackKing.y)
    if (getPieceCountBetween(redKing.x, minY, redKing.x, maxY) === 0) {
      return true
    }
  }
  return false
}

// 修改点击处理函数
const handleCellClick = (x, y) => {
  if (gameStatus.value !== '进行中') return
  const piece = board[y][x]

  if (selectedPos.value) {
    if (validMoves.value.some((pos) => pos.x === x && pos.y === y)) {
      // 保存当前状态到历史记录
      gameHistory.value.push({
        board: JSON.parse(JSON.stringify(board)),
        player: currentPlayer.value
      })

      // 检查是否吃掉了对方的将/帅
      const targetPiece = board[y][x]
      if (targetPiece?.type === 'king') {
        gameStatus.value = `${currentPlayer.value}方获胜！`
        board[y][x] = board[selectedPos.value.y][selectedPos.value.x]
        board[selectedPos.value.y][selectedPos.value.x] = null
        return
      }

      // 移动棋子
      board[y][x] = board[selectedPos.value.y][selectedPos.value.x]
      board[selectedPos.value.y][selectedPos.value.x] = null

      // 双重胜负判断
      if (checkFaceToFace() || checkKingExistence()) {
        gameStatus.value = `${currentPlayer.value}方获胜！`
      } else {
        currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red'
      }
    }
    selectedPos.value = null
    validMoves.value = []
  } else if (piece && piece.color === currentPlayer.value) {
    selectedPos.value = { x, y }
    validMoves.value = getValidMoves(x, y, piece)
  }
}

// 将帅存在检查
const checkKingExistence = () => {
  let redKingExist = false
  let blackKingExist = false

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x]
      if (piece?.type === 'king') {
        if (piece.color === 'red') {
          redKingExist = true
        } else {
          blackKingExist = true
        }
      }
    }
  }

  // 如果任意一方将帅不存在则游戏结束
  if (!redKingExist || !blackKingExist) {
    return true
  }
  return false
}

// 重置游戏方法
const resetGame = () => {
  Object.assign(board, JSON.parse(JSON.stringify(initialBoard)))
  currentPlayer.value = 'red'
  selectedPos.value = null
  validMoves.value = []
  gameStatus.value = '进行中'
  gameHistory.value = []
}

// 悔棋方法
const undoMove = () => {
  if (!canUndo.value) return

  const lastState = gameHistory.value.pop()
  Object.assign(board, lastState.board)
  currentPlayer.value = lastState.player
  selectedPos.value = null
  validMoves.value = []
  gameStatus.value = '进行中'
}
</script>

<style scoped lang="scss">
.board-item {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
  &::before {
    width: 100%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 100%;
    width: 2px; /* 线宽 */
  }
}
.board-item-left-top {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(0%, 0%);
    z-index: 0;
  }
  &::before {
    width: 50%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 50%;
    width: 2px; /* 线宽 */
  }
}
.board-item-right-top {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(-100%, 0%);
    z-index: 0;
  }
  &::before {
    width: 50%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 50%;
    width: 2px; /* 线宽 */
  }
}
.board-item-left-bottom {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(0%, -100%);
    z-index: 0;
  }
  &::before {
    width: 50%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 50%;
    width: 2px; /* 线宽 */
  }
}
.board-item-right-bottom {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(-100%, -100%);
    z-index: 0;
  }
  &::before {
    width: 50%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 50%;
    width: 2px; /* 线宽 */
  }
}
.board-item-top-edge {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, 0%);
    z-index: 0;
  }
  &::before {
    width: 100%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 50%;
    width: 2px; /* 线宽 */
  }
}
.board-item-bottom-edge {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100%);
    z-index: 0;
  }
  &::before {
    width: 100%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 50%;
    width: 2px; /* 线宽 */
  }
}
.board-item-left-edge {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(0%, -50%);
    z-index: 0;
  }
  &::before {
    width: 50%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 100%;
    width: 2px; /* 线宽 */
  }
}
.board-item-right-edge {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: red; /* 十字颜色 */
    left: 50%;
    top: 50%;
    transform: translate(-100%, -50%);
    z-index: 0;
  }
  &::before {
    width: 50%;
    height: 2px; /* 线宽 */
  }
  &::after {
    height: 100%;
    width: 2px; /* 线宽 */
  }
}
</style>
