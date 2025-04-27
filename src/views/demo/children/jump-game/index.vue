<template>
  <div class="relative w-[640px] mx-[auto] my-[20px]">
    <canvas
      class="border-[2px] border-solid border-[#333] bg-[#eeeeff] focus:!outline-[3px_solid_#4caf50] focus:[box-shadow:0_0_15px_rgba(76,_175,_80,_0.8)]"
      ref="gameCanvas"
      tabindex="0"
    ></canvas>
    <div
      class="absolute top-[10px] left-[10px] font-['Courier_New',_monospace] bg-[rgba(255,_255,_255,_0.9)] px-[20px] py-[10px] rounded-[8px] [box-shadow:0_2px_8px_rgba(0,_0,_0,_0.1)]"
    >
      <div>得分：{{ score }}</div>
      <div>生命：{{ lives }}</div>
      <div>关卡：{{ currentLevel + 1 }}/{{ levelMaps.length }}</div>
      <button
        class="mt-[12px] px-[24px] py-[8px] bg-[#4caf50] text-[white] border-none rounded-[4px] cursor-pointer [transition:background_0.2s] focus:bg-[#45a048]"
        v-if="gameOver"
        @click="resetGame"
      >
        {{ currentLevel < levelMaps.length - 1 ? '重新开始' : '再来一次' }}
      </button>
    </div>
    <div
      v-if="showLevelComplete"
      class="level-complete absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 text-[3em] text-[gold] [text-shadow:3px_3px_6px_rgba(0,_0,_0,_0.8)]"
    >
      关卡完成！
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'jump-game'
})

// 游戏常量
const GRAVITY = 0.4 // 重力加速度
const JUMP_FORCE = -14 // 跳跃力
const MOVE_SPEED = 5 // 移动速度
const TILE_SIZE = 40
const JUMP_BUFFER_FRAMES = 8
const MAX_FALL_SPEED = 15

// 游戏状态
const gameCanvas = ref(null)
const score = ref(0)
const lives = ref(3)
const gameOver = ref(false)
const jumpBuffer = ref(0)
const currentLevel = ref(0)
const showLevelComplete = ref(false)

// 关卡地图 (0:空 1:地面 2:砖块 3:尖刺 4:出口)
const levelMapsFun = () => [
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 2, 0, 0, 0, 3, 2, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  [
    [1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
]

let levelMaps = levelMapsFun()

const levelMap = reactive([...levelMaps[currentLevel.value]])

// 玩家属性
const player = reactive({
  x: 100,
  y: 200,
  width: 30,
  height: 40,
  velocityX: 0,
  velocityY: 0,
  isGrounded: false,
  canJump: true
})

let ctx = null
let animationFrameId = null
const keys = new Set()

// 初始化游戏
function initGame() {
  player.x = 100
  player.y = 200
  player.velocityX = 0
  player.velocityY = 0
  player.isGrounded = false
  player.canJump = true
  gameOver.value = false
  showLevelComplete.value = false
}

// 下一关
function nextLevel() {
  if (currentLevel.value < levelMaps.length - 1) {
    showLevelComplete.value = true
    setTimeout(() => {
      currentLevel.value++
      levelMap.splice(0, levelMap.length, ...levelMaps[currentLevel.value])
      initGame()
      showLevelComplete.value = false
    }, 1500)
  } else {
    gameOver.value = true
  }
}

// 物理引擎
function updatePhysics() {
  if (showLevelComplete.value) {
    // 关卡完成时不处理物理
    return
  }

  // 处理缓冲跳跃
  if (jumpBuffer.value > 0 && player.canJump && player.isGrounded) {
    player.velocityY = JUMP_FORCE
    player.isGrounded = false
    player.canJump = false
    jumpBuffer.value = 0
  }

  // 水平移动
  player.velocityX = 0
  if (keys.has('ArrowLeft')) player.velocityX = -MOVE_SPEED
  if (keys.has('ArrowRight')) player.velocityX = MOVE_SPEED
  player.x += player.velocityX

  // 垂直运动（限制最大下落速度）
  player.velocityY = Math.min(player.velocityY + GRAVITY, MAX_FALL_SPEED)
  player.y += player.velocityY

  // 边界约束
  const mapWidth = levelMap[0].length * TILE_SIZE
  const mapHeight = levelMap.length * TILE_SIZE
  player.x = Math.max(0, Math.min(player.x, mapWidth - player.width))
  player.y = Math.min(player.y, mapHeight - player.height)

  checkCollisions()
}

// 碰撞检测
function checkCollisions() {
  player.isGrounded = false

  const checkPoints = [
    [player.x, player.y], // 左上
    [player.x + player.width, player.y], // 右上
    [player.x, player.y + player.height], // 左下
    [player.x + player.width, player.y + player.height] // 右下
  ]

  checkPoints.forEach(([px, py]) => {
    const tileX = Math.floor(px / TILE_SIZE)
    const tileY = Math.floor(py / TILE_SIZE)

    if (tileY >= 0 && tileY < levelMap.length && tileX >= 0 && tileX < levelMap[0].length) {
      const tileCode = levelMap[tileY][tileX]
      if (tileCode) handleCollision(tileX, tileY, tileCode)
    }
  })
}

// 碰撞处理
function handleCollision(tileX, tileY, tileCode) {
  const tile = {
    x: tileX * TILE_SIZE,
    y: tileY * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE
  }

  // 计算重叠区域
  const overlapX =
    Math.min(player.x + player.width, tile.x + tile.width) - Math.max(player.x, tile.x)
  const overlapY =
    Math.min(player.y + player.height, tile.y + tile.height) - Math.max(player.y, tile.y)

  if (overlapX <= 0 || overlapY <= 0) return

  // 确定主要碰撞方向
  if (overlapX < overlapY) {
    // 水平碰撞
    if (player.x < tile.x) {
      player.x = tile.x - player.width
    } else {
      player.x = tile.x + tile.width
    }
    player.velocityX = 0
  } else {
    // 垂直碰撞
    if (player.y < tile.y) {
      player.y = tile.y - player.height
      player.velocityY = 0
      if (tileCode === 1) {
        player.isGrounded = true
        player.canJump = true
      }
    } else {
      player.y = tile.y + tile.height
      player.velocityY = 0
    }
  }

  // 特殊砖块处理
  switch (tileCode) {
    case 2: // 可破坏砖块
      levelMap[tileY][tileX] = 0
      score.value += 50
      break
    case 3: // 尖刺
      lives.value -= 1
      if (lives.value <= 0) gameOver.value = true
      break
    case 4: // 出口
      nextLevel()
      break
  }
}

// 绘制游戏
function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // 绘制地图
  levelMap.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile) {
        ctx.fillStyle =
          tile === 1
            ? '#666666' // 地面
            : tile === 2
              ? '#bb88aa' // 可破坏砖块
              : tile === 3
                ? '#ff4444' // 尖刺
                : '#ffff00' // 出口
        ctx.fillRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2)
      }
    })
  })

  // 绘制玩家
  ctx.fillStyle = '#44aa88'
  ctx.fillRect(player.x, player.y, player.width, player.height)

  // 调试信息
  ctx.fillStyle = 'black'
  ctx.font = '14px Arial'
  ctx.fillText(`Y速度: ${player.velocityY.toFixed(1)}`, 10, 20)
  ctx.fillText(`地面: ${player.isGrounded}`, 10, 40)
}

// 游戏循环
function gameLoop() {
  if (!gameOver.value) {
    if (jumpBuffer.value > 0) jumpBuffer.value--

    updatePhysics()
    draw()
    if (document.activeElement !== gameCanvas.value) {
      if (gameCanvas.value && gameCanvas.value.focus) {
        gameCanvas.value.focus()
      }
    }
    animationFrameId = requestAnimationFrame(gameLoop)
  }
}

// 事件处理
function handleKeyDown(e) {
  keys.add(e.code)
  if ((e.code === 'ArrowUp' || e.code === 'Space') && player.canJump) {
    jumpBuffer.value = JUMP_BUFFER_FRAMES
  }
}

function handleKeyUp(e) {
  keys.delete(e.code)
}

// 重置游戏
function resetGame() {
  lives.value = 3
  score.value = 0
  currentLevel.value = 0
  levelMaps = levelMapsFun()
  levelMap.splice(0, levelMap.length, ...levelMaps[currentLevel.value])
  initGame()
  gameLoop()
}

onMounted(() => {
  ctx = gameCanvas.value.getContext('2d')
  gameCanvas.value.width = 640
  gameCanvas.value.height = 320
  gameCanvas.value.focus()

  // 事件监听
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  initGame()
  gameLoop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
.level-complete {
  animation: zoomInOut 1.5s infinite;
}

@keyframes zoomInOut {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
