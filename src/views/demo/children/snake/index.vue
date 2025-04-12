<template>
  <div>
    <canvas ref="canvas" class="snake-canvas" width="1200" height="800"></canvas>
    <p>得分: {{ score }}</p>
    <div class="dialog" ref="dialog">
      <h2>游戏结束</h2>
      <p>你的得分是: {{ score }}</p>
      <button @click="restartGame">重新开始</button>
    </div>
  </div>
</template>
<script setup lang="js">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const ctx = ref(null)
const snake = ref([{ x: 20, y: 20 }])
const food = ref({ x: 10, y: 10 })
const direction = ref('right')
const score = ref(0)
const blockSize = 10
const obstacles = ref([])
const dialog = ref(null)
let gameInterval
let baseSpeed = 200
let currentSpeed = baseSpeed
let isSpeeding = false // 新增标志位，用于判断是否正在加速

const drawBoard = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // 绘制蛇
  snake.value.forEach((segment) => {
    ctx.value.fillStyle = '#00FF00'
    ctx.value.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize)
  })

  // 绘制食物
  ctx.value.fillStyle = '#FF0000'
  ctx.value.beginPath()
  ctx.value.arc(
    food.value.x * blockSize + blockSize / 2,
    food.value.y * blockSize + blockSize / 2,
    blockSize / 2,
    0,
    2 * Math.PI
  )
  ctx.value.fill()

  // 绘制障碍物
  obstacles.value.forEach((obstacle) => {
    ctx.value.fillStyle = '#888888'
    ctx.value.fillRect(
      obstacle.x * blockSize,
      obstacle.y * blockSize,
      obstacle.width * blockSize,
      obstacle.height * blockSize
    )
  })
}

const moveSnake = () => {
  const head = { ...snake.value[0] }
  switch (direction.value) {
    case 'right':
      head.x++
      break
    case 'left':
      head.x--
      break
    case 'up':
      head.y--
      break
    case 'down':
      head.y++
      break
  }

  // 无边界处理
  head.x = (head.x + canvas.value.width / blockSize) % (canvas.value.width / blockSize)
  head.y = (head.y + canvas.value.height / blockSize) % (canvas.value.height / blockSize)

  snake.value.unshift(head)

  if (head.x === food.value.x && head.y === food.value.y) {
    score.value++
    generateFood()
  } else {
    snake.value.pop()
  }

  if (isGameOver()) {
    clearInterval(gameInterval)
    dialog.value.style.display = 'block'
  }

  drawBoard()
}

const generateFood = () => {
  let newFood
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.value.width / blockSize)),
      y: Math.floor(Math.random() * (canvas.value.height / blockSize))
    }
  } while (
    snake.value.some((segment) => segment.x === newFood.x && segment.y === newFood.y) ||
    obstacles.value.some(
      (obstacle) =>
        newFood.x >= obstacle.x &&
        newFood.x < obstacle.x + obstacle.width &&
        newFood.y >= obstacle.y &&
        newFood.y < obstacle.y + obstacle.height
    )
  )
  food.value = newFood
}

const generateObstacles = () => {
  const numObstacles = Math.floor(Math.random() * 10) + 5
  for (let i = 0; i < numObstacles; i++) {
    let newObstacle
    const width = Math.floor(Math.random() * 3) + 1
    const height = Math.floor(Math.random() * 3) + 1
    do {
      newObstacle = {
        x: Math.floor(Math.random() * (canvas.value.width / blockSize - width)),
        y: Math.floor(Math.random() * (canvas.value.height / blockSize - height)),
        width,
        height
      }
    } while (
      snake.value.some(
        (segment) =>
          segment.x >= newObstacle.x &&
          segment.x < newObstacle.x + newObstacle.width &&
          segment.y >= newObstacle.y &&
          segment.y < newObstacle.y + newObstacle.height
      ) ||
      (food.value.x >= newObstacle.x &&
        food.value.x < newObstacle.x + newObstacle.width &&
        food.value.y >= newObstacle.y &&
        food.value.y < newObstacle.y + newObstacle.height)
    )
    obstacles.value.push(newObstacle)
  }
}

const isGameOver = () => {
  const head = snake.value[0]
  return (
    snake.value.slice(1).some((segment) => segment.x === head.x && segment.y === head.y) ||
    obstacles.value.some(
      (obstacle) =>
        head.x >= obstacle.x &&
        head.x < obstacle.x + obstacle.width &&
        head.y >= obstacle.y &&
        head.y < obstacle.y + obstacle.height
    )
  )
}

const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowRight':
      if (direction.value !== 'left') direction.value = 'right'
      break
    case 'ArrowLeft':
      if (direction.value !== 'right') direction.value = 'left'
      break
    case 'ArrowUp':
      if (direction.value !== 'down') direction.value = 'up'
      break
    case 'ArrowDown':
      if (direction.value !== 'up') direction.value = 'down'
      break
    case ' ':
      if (!isSpeeding) {
        isSpeeding = true
        currentSpeed = baseSpeed / 2
        clearInterval(gameInterval)
        gameInterval = setInterval(moveSnake, currentSpeed)
      }
      break
  }
}

const handleKeyUp = (e) => {
  if (e.key === ' ') {
    isSpeeding = false
    currentSpeed = baseSpeed
    clearInterval(gameInterval)
    gameInterval = setInterval(moveSnake, currentSpeed)
  }
}

const restartGame = () => {
  snake.value = [{ x: 20, y: 20 }]
  direction.value = 'right'
  score.value = 0
  obstacles.value = []
  generateObstacles()
  generateFood()
  dialog.value.style.display = 'none'
  clearInterval(gameInterval)
  gameInterval = setInterval(moveSnake, currentSpeed)
}

onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
  generateObstacles()
  generateFood()
  drawBoard()
  gameInterval = setInterval(moveSnake, currentSpeed)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  clearInterval(gameInterval)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>
<style lang="scss" scoped>
.snake-canvas {
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dialog {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
}
</style>
