<template>
  <div
    class="w-screen h-screen overflow-hidden bg-[linear-gradient(135deg,_#7f7fd5_0%,_#86a8e7_50%,_#91eae4_100%)] select-none [font-family:Arial,sans-serif] relative"
  >
    <div
      v-if="gameState === 'start'"
      class="w-full h-full flex flex-col items-center justify-center text-[white] text-center p-8 box-border"
    >
      <h1 class="text-[3rem] mb-4 [text-shadow:0_2px_10px_rgba(0,_0,_0,_0.3)]">水果忍者</h1>
      <p class="text-[1.2rem] mb-8 max-w-[500px]">滑动屏幕切水果，避开炸弹！</p>
      <button
        @click="startGame"
        class="start-button px-8 py-[0.8rem] text-[1.2rem] bg-[#ff6b6b] text-[white] border-none rounded-[30px] cursor-pointer [transition:all_0.3s_ease] [box-shadow:0_4px_15px_rgba(0,_0,_0,_0.2)]"
      >
        开始游戏
      </button>
      <div class="flex justify-center gap-[2rem] mt-12">
        <div class="flex flex-col items-center gap-[0.5rem] text-[white]">
          <span class="text-[1.8rem] [text-shadow:0_2px_5px_rgba(0,_0,_0,_0.2)]">✋</span>
          <span>滑动切水果</span>
        </div>
        <div class="flex flex-col items-center gap-[0.5rem] text-[white]">
          <span class="text-[1.8rem] [text-shadow:0_2px_5px_rgba(0,_0,_0,_0.2)]">💣</span>
          <span>避开炸弹💣</span>
        </div>
        <div class="flex flex-col items-center gap-[0.5rem] text-[white]">
          <span class="text-[1.8rem] [text-shadow:0_2px_5px_rgba(0,_0,_0,_0.2)]">❤️</span>
          <span>❤️没了游戏结束</span>
        </div>
      </div>
    </div>

    <div v-else-if="gameState === 'playing'" class="w-full h-full relative">
      <div
        class="absolute top-[0] left-[0] right-[0] p-4 flex justify-between items-center text-[white] z-10 bg-[rgba(0,_0,_0,_0.1)]"
      >
        <div
          class="flex items-center gap-[0.5rem] text-[1.1rem] [text-shadow:0_1px_3px_rgba(0,_0,_0,_0.3)]"
        >
          <span>⭐</span>
          <span>分数: {{ score }}</span>
        </div>
        <div
          class="flex items-center gap-[0.2rem] text-[1.1rem] [text-shadow:0_1px_3px_rgba(0,_0,_0,_0.3)]"
        >
          <span v-for="i in 6" :key="i" :class="{ 'heart-lost': i > lives }">❤️</span>
        </div>
        <div
          class="flex items-center gap-[0.5rem] text-[1.1rem] [text-shadow:0_1px_3px_rgba(0,_0,_0,_0.3)]"
        >
          <span>⚡</span>
          <span>等级: {{ level }}</span>
        </div>
      </div>

      <!-- 加分提示 -->
      <div
        v-if="bonusText"
        class="absolute text-[white] [font-weight:bold] [text-shadow:0_2px_4px_rgba(0,_0,_0,_0.3)] pointer-events-none [transition:opacity_0.3s_ease] animate-[float-up_1s_ease_forwards]"
        :style="{
          left: `${bonusPosition.x}%`,
          top: `${bonusPosition.y}%`,
          opacity: bonusOpacity
        }"
      >
        {{ bonusText }}
      </div>

      <!-- 游戏区域 -->
      <div
        class="game-area w-full h-full relative overflow-hidden"
        @mousedown="startSwipe"
        @mousemove="handleSwipe"
        @mouseup="endSwipe"
        @touchstart="startSwipe"
        @touchmove="handleSwipe"
        @touchend="endSwipe"
      >
        <!-- 水果和炸弹 -->
        <div
          v-for="(item, index) in items"
          :key="item.id"
          :class="['game-item', item.type]"
          :style="{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            opacity: item.opacity,
            fontSize: `${item.size}px`
          }"
          ref="gameItems"
        >
          <span v-if="!item.sliced">{{ item.emoji }}</span>

          <!-- 切开效果 -->
          <div
            v-if="item.sliced"
            class="absolute w-full h-full flex items-center justify-center select-none"
          >
            <span class="absolute -translate-x-[20%] translate-y-[0] -rotate-[15deg] opacity-80">{{
              item.emoji
            }}</span>
            <span class="absolute translate-x-[20%] translate-y-[0] rotate-[15deg] opacity-80">{{
              item.emoji
            }}</span>
          </div>
        </div>

        <!-- 滑动轨迹 -->
        <div
          class="absolute top-[0] left-[0] w-full h-full bg-[rgba(255,_255,_255,_0.5)] pointer-events-none [transition:opacity_0.1s_ease]"
          :style="{
            'clip-path': trailPath,
            opacity: trailOpacity
          }"
        ></div>
      </div>
    </div>

    <div
      v-else-if="gameState === 'end'"
      class="end-screen w-full h-full flex flex-col items-center justify-center text-[white] bg-[rgba(0,_0,_0,_0.5)] text-center p-8 box-border"
    >
      <h2 class="text-[2.5rem] mb-6">游戏结束</h2>
      <div class="mb-8">
        <span class="text-[1.2rem] opacity-80">最终得分</span>
        <p class="text-[3rem] mx-[0] my-2 [font-weight:bold]">{{ score }}</p>
      </div>
      <div class="flex gap-[3rem] mb-8">
        <div class="text-center">
          <span class="text-[1rem] opacity-80 block">水果切数</span>
          <p class="text-[1.5rem] ml-[0] mr-[0] my-2">{{ fruitsSliced }}</p>
        </div>
        <div class="text-center">
          <span class="text-[1rem] opacity-80 block">最高等级</span>
          <p class="text-[1.5rem] ml-[0] mr-[0] my-2">{{ level }}</p>
        </div>
      </div>
      <button
        @click="restartGame"
        class="restart-button px-8 py-[0.8rem] text-[1.2rem] bg-[#4ecdc4] text-[white] border-none rounded-[30px] cursor-pointer [transition:all_0.3s_ease] [box-shadow:0_4px_15px_rgba(0,_0,_0,_0.2)]"
      >
        再玩一次
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

// 游戏状态s
const gameState = ref('start') // start, playing, end
const score = ref(0)
const lives = ref(6)
const level = ref(1)
const fruitsSliced = ref(0)
const lastLifeAwardScore = ref(0) // last奖励生命值时的分

// 加分提示
const bonusText = ref('')
const bonusPosition = ref({ x: 0, y: 0 })
const bonusOpacity = ref(0)

// （水果和炸弹）
const items = ref([])
const gameItems = ref([])

// 滑动轨迹
const trailPoints = ref([])
const trailPath = ref('')
const trailOpacity = ref(0)
const isSwiping = ref(false) // 是否正在滑动

// 游戏参数
const spawnInterval = ref(1500) // 物品生成间隔/ms
const itemSpeed = ref(1) // 物品移动速度
const maxItems = ref(50) // 最大同时存在的物品数量

const fruitTypes = [
  { type: 'fruit', emoji: '🍎', points: 10 },
  { type: 'fruit', emoji: '🍋', points: 10 },
  { type: 'fruit', emoji: '🍓', points: 15 },
  { type: 'fruit', emoji: '🍇', points: 10 },
  { type: 'fruit', emoji: '🍉', points: 20 },
  { type: 'bomb', emoji: '💣', points: -30 }
]

// 游戏循环的setInterval
let gameLoop = null
let spawnTimer = null

// 开始游戏
const startGame = () => {
  gameState.value = 'playing'
  score.value = 0
  lives.value = 6
  level.value = 1
  fruitsSliced.value = 0
  lastLifeAwardScore.value = 0
  items.value = []
  bonusText.value = ''

  // 重置游戏参数
  spawnInterval.value = 1500
  itemSpeed.value = 1
  maxItems.value = 50

  startSpawning()

  gameLoop = setInterval(updateGame, 16)
}

// 开启定时器刷画面
const startSpawning = () => {
  spawnTimer = setInterval(() => {
    if (gameState.value === 'playing') {
      spawnItem()
    }
  }, spawnInterval.value)
}

const createSpawnItem = () => {
  // 随机选择物品类型（80%水果，20%炸弹）
  const isBomb = Math.random() < 0.2
  const itemType = isBomb
    ? fruitTypes.find((t) => t.type === 'bomb')
    : fruitTypes[Math.floor(Math.random() * (fruitTypes.length - 1))]

  // 随机位置和初始角度
  const startX = Math.random() * 80 + 10 // 10% - 90%
  const startY = 100 // 从底部开始

  const angle = (Math.random() * 60 - 30) * (Math.PI / 180) // -30° 到 30°
  const speed = itemSpeed.value * (0.8 + Math.random() * 0.4) // 随机速度变化，看起来不拉姆速度惟一
  const vx = Math.sin(angle) * speed
  const vy = -Math.cos(angle) * speed // 负号表示冲上

  const gravity = 0.015

  return {
    id: Date.now() + Math.random(), // 使用唯一ID避免渲染问题
    ...itemType,
    x: startX,
    y: startY,
    vx,
    vy,
    gravity,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    sliced: false,
    opacity: 1,
    size: isBomb ? 40 : 36 + Math.random() * 8 // 大概范围里随机大小
  }
}

// 生成spawnItem物品
const spawnItem = () => {
  const newArr = []
  for (let i = 0; i < level.value; i++) {
    if (items.value.length + i < maxItems.value) {
      // 避免超出最大物品数
      newArr.push(createSpawnItem())
    } else {
      break
    }
  }
  items.value = items.value.concat(newArr)
}

// 更新游戏状态
const updateGame = () => {
  // 更新所有物品
  for (let i = items.value.length - 1; i >= 0; i--) {
    const item = items.value[i]

    // 如果已切开，应用淡出效果
    if (item.sliced) {
      item.opacity -= 0.1
      if (item.opacity <= 0) {
        items.value.splice(i, 1)
      }
      continue
    }

    // 平滑更新位置
    item.x += item.vx
    item.y += item.vy
    item.vy += item.gravity // 应用重力
    item.rotation += item.rotationSpeed

    // 限制最大速度，防止抖动
    item.vy = Math.min(item.vy, 3)

    // 检查是否超出屏幕范围
    if (item.y > 110) {
      items.value.splice(i, 1)
    } else if (item.x < -10 || item.x > 110) {
      items.value.splice(i, 1)
    }
  }

  // 检查等级提升
  checkLevelUp()

  // 检查是否奖励生命值
  checkLifeAward()
}

// 检查等级提升
const checkLevelUp = () => {
  const newLevel = Math.floor(score.value / 100) + 1
  if (newLevel > level.value) {
    level.value = newLevel

    // 随着等级上强度
    spawnInterval.value = Math.max(500, 1500 - (level.value - 1) * 80)
    itemSpeed.value = 1 + (level.value - 1) * 0.1 // 缓慢增加速度
    maxItems.value = Math.min(10, 5 + Math.floor((level.value - 1) / 2))
  }
}

// 检查是否奖励生命值
const checkLifeAward = () => {
  // 每获得100分且生命值未满666时奖励1点生命值
  if (lives.value < 6 && score.value - lastLifeAwardScore.value >= 100) {
    lives.value++
    lastLifeAwardScore.value = score.value

    // 显示加分提示
    showBonusText('+1 生命!', 50, 50)
  }
}

// 显示加分提示
const showBonusText = (text, x, y) => {
  bonusText.value = text
  bonusPosition.value = { x, y }
  bonusOpacity.value = 1

  // 淡出动画
  setTimeout(() => {
    const fadeInterval = setInterval(() => {
      bonusOpacity.value -= 0.05
      if (bonusOpacity.value <= 0) {
        clearInterval(fadeInterval)
        bonusText.value = ''
      }
    }, 30)
  }, 1000)
}

// 检查游戏是否结束
const checkGameOver = () => {
  if (lives.value <= 0) {
    endGame()
  }
}

// 结束游戏
const endGame = () => {
  gameState.value = 'end'
  clearInterval(gameLoop)
  clearInterval(spawnTimer)
}

// 重新开始游戏
const restartGame = () => {
  clearInterval(gameLoop)
  clearInterval(spawnTimer)
  startGame()
}

// 处理滑动开始
const startSwipe = (e) => {
  isSwiping.value = true
  trailPoints.value = []
  addTrailPoint(e)
  updateTrailPath()
  trailOpacity.value = 1
}

// 处理滑动中
const handleSwipe = (e) => {
  if (!isSwiping.value) return
  addTrailPoint(e)
  updateTrailPath()
  checkSlicedItems()
}

// 处理滑动结束
const endSwipe = () => {
  isSwiping.value = false

  // 淡出轨迹
  const fadeTrail = setInterval(() => {
    trailOpacity.value -= 0.1
    if (trailOpacity.value <= 0) {
      clearInterval(fadeTrail)
      trailPoints.value = []
      updateTrailPath()
    }
  }, 50)
}

// 添加轨迹点
const addTrailPoint = (e) => {
  // 处理触摸和鼠标事件
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY

  // 获取游戏区域位置和尺寸
  const gameArea = document.querySelector('.game-area')
  if (!gameArea) return

  const rect = gameArea.getBoundingClientRect()

  // 转换为相对游戏区域的百分比
  const x = ((clientX - rect.left) / rect.width) * 100
  const y = ((clientY - rect.top) / rect.height) * 100

  trailPoints.value.push({ x, y })

  // 限制轨迹点数量，保持性能
  if (trailPoints.value.length > 30) {
    trailPoints.value.shift()
  }
}

// 更新轨迹路径
const updateTrailPath = () => {
  if (trailPoints.value.length < 2) {
    trailPath.value = ''
    return
  }

  let path = `polygon(`

  // 创建主路径
  trailPoints.value.forEach((point, index) => {
    path += `${point.x}% ${point.y}%, `
  })

  // 创建反向路径，形成一个闭合区域
  for (let i = trailPoints.value.length - 1; i >= 0; i--) {
    const point = trailPoints.value[i]
    // 添加偏移，使轨迹可见
    path += `${point.x + 2}% ${point.y + 2}%, `
  }

  // 闭合路径
  path = path.slice(0, -2) + ')'
  trailPath.value = path
}

// 检查是否切到物品
const checkSlicedItems = () => {
  if (!gameItems.value.length || trailPoints.value.length < 2) return

  // 简化轨迹为线段，用于碰撞检测
  const lastPoint = trailPoints.value[trailPoints.value.length - 1]
  const prevPoint = trailPoints.value[trailPoints.value.length - 2]

  gameItems.value.forEach((el, index) => {
    const item = items.value[index]
    if (!item || item.sliced) return

    // 获取元素位置
    const rect = el.getBoundingClientRect()
    const gameArea = document.querySelector('.game-area')
    if (!gameArea) return

    const gameRect = gameArea.getBoundingClientRect()

    // 计算物品在游戏区域中的相对位置
    const itemX = ((rect.left + rect.width / 2 - gameRect.left) / gameRect.width) * 100
    const itemY = ((rect.top + rect.height / 2 - gameRect.top) / gameRect.height) * 100
    const itemSize = (Math.max(rect.width, rect.height) / gameRect.width) * 50 // 估算尺寸

    // 检查物品是否在线段附近（简单碰撞检测）
    const distance = linePointDistance(
      prevPoint.x,
      prevPoint.y,
      lastPoint.x,
      lastPoint.y,
      itemX,
      itemY
    )

    if (distance < itemSize) {
      sliceItem(index, itemX, itemY)
    }
  })
}

// 计算点到线段的距离
const linePointDistance = (x1, y1, x2, y2, px, py) => {
  // 线段长度的平方
  const l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  if (l2 === 0) return Math.hypot(px - x1, py - y1)

  // 计算投影比例
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2
  t = Math.max(0, Math.min(1, t))

  // 投影点
  const projX = x1 + t * (x2 - x1)
  const projY = y1 + t * (y2 - y1)

  // 距离
  return Math.hypot(px - projX, py - projY)
}

// 切开物品
const sliceItem = (index, x, y) => {
  const item = items.value[index]
  if (!item || item.sliced) return

  item.sliced = true

  // 处理分数
  if (item.type === 'fruit') {
    score.value += item.points
    fruitsSliced.value++

    // 显示加分提示
    showBonusText(`+${item.points}`, x, y)
  } else if (item.type === 'bomb') {
    score.value = Math.max(0, score.value + item.points) // 炸弹扣分，最低为0
    lives.value = Math.max(0, lives.value - 1)
    checkGameOver()

    // 显示扣分提示
    showBonusText(`${item.points}`, x, y)
  }
}

// 清理计时器
onUnmounted(() => {
  clearInterval(gameLoop)
  clearInterval(spawnTimer)
})
</script>

<style scoped>
.start-button:hover {
  background-color: #ff5252;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.heart-lost {
  color: #ff6b6b;
  opacity: 0.5;
}

.game-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  z-index: 5;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  will-change: transform, opacity;
  user-select: none;
}

.restart-button:hover {
  background-color: #3dbbaf;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

@keyframes float-up {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-30px);
  }
}
</style>
