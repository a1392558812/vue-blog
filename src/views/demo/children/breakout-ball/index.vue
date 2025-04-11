<template>
  <div>
    <canvas ref="canvas" class="breakout-ball" width="1200" height="800"></canvas>
  </div>
</template>
<script setup lang="js">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let end = false
let ctx
let x
let y
let dx = 2
let dy = -2
const ballRadius = 10
let paddleHeight = 10
let paddleWidth = 75
let paddleX = (1200 - paddleWidth) / 2
let rightPressed = false
let leftPressed = false
const brickRowCount = 8
const brickColumnCount = 21
const brickWidth = 50
const brickHeight = 10
const brickPadding = 5
const brickOffsetTop = 30
const brickOffsetLeft = 30
let score = 0
let lives = 3
let isSpacePressed = false
const speedMultiplier = 2
let isAcceleratedByObstacle = false
let accelerationDuration = 0
const accelerationTime = 300

const bricks = []
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

const obstacles = [
  { x: 200, y: 200, width: 30, height: 10, status: 1 },
  { x: 500, y: 300, width: 30, height: 10, status: 1 }
]

//
const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#00aa88'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

const drawObstacles = () => {
  obstacles.forEach((obstacle) => {
    if (obstacle.status === 1) {
      ctx.beginPath()
      ctx.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      ctx.fillStyle = '#000000'
      ctx.fill()
      ctx.closePath()
    }
  })
}

const drawBall = () => {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#00aa88'
  ctx.fill()
  ctx.closePath()
}

// 绘制挡板
const drawPaddle = () => {
  ctx.beginPath()
  ctx.rect(paddleX, 800 - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#00aa88'
  ctx.fill()
  ctx.closePath()
}

const drawScore = () => {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#00aa88'
  ctx.fillText('得分: ' + score, 8, 20)
}

const drawLives = () => {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#00aa88'
  ctx.fillText('剩余寄次数: ' + lives, 700, 20)
}

// 碰撞检测
const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score++
          if (score === brickRowCount * brickColumnCount) {
            alert('你是真滴闲！！！！！')
            end = true
          }
        }
      }
    }
  }

  obstacles.forEach((obstacle) => {
    if (obstacle.status === 1) {
      if (
        x > obstacle.x &&
        x < obstacle.x + obstacle.width &&
        y > obstacle.y &&
        y < obstacle.y + obstacle.height
      ) {
        dy = -dy
        isAcceleratedByObstacle = true
        accelerationDuration = accelerationTime
      }
    }
  })
}

// 绘制函数
const draw = () => {
  ctx.clearRect(0, 0, 1200, 800)
  drawBricks()
  drawObstacles()
  drawBall()
  drawPaddle()
  drawScore()
  drawLives()
  collisionDetection()

  let currentDx = dx
  let currentDy = dy

  if (isSpacePressed) {
    currentDx *= speedMultiplier
    currentDy *= speedMultiplier
  }

  if (isAcceleratedByObstacle) {
    currentDx *= speedMultiplier
    currentDy *= speedMultiplier
    accelerationDuration--
    if (accelerationDuration <= 0) {
      isAcceleratedByObstacle = false
    }
  }

  if (x + currentDx > 1200 - ballRadius || x + currentDx < ballRadius) {
    dx = -dx
  }
  if (y + currentDy < ballRadius) {
    dy = -dy
  } else if (y + currentDy > 800 - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      lives--
      if (!lives) {
        alert('寄了，游戏结束！')
        end = true
      } else {
        x = 1200 / 2
        y = 800 - 30
        dx = 2
        dy = -2
        paddleX = (1200 - paddleWidth) / 2
        isAcceleratedByObstacle = false
        accelerationDuration = 0
      }
    }
  }

  if (rightPressed && paddleX < 1200 - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }

  x += currentDx
  y += currentDy

  !end && requestAnimationFrame(draw)
}

const keyDownHandler = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true
  } else if (e.key === ' ') {
    isSpacePressed = true
  }
}

const keyUpHandler = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false
  } else if (e.key === ' ') {
    isSpacePressed = false
  }
}

const mouseMoveHandler = (e) => {
  const relativeX = e.clientX - canvas.value.offsetLeft
  if (relativeX > 0 && relativeX < 1200) {
    paddleX = relativeX - paddleWidth / 2
  }
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  x = 1200 / 2
  y = 800 - 30
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)
  document.addEventListener('mousemove', mouseMoveHandler)
  draw()
})

onUnmounted(() => {
  document.removeEventListener('keydown', keyDownHandler)
  document.removeEventListener('keyup', keyUpHandler)
  document.removeEventListener('mousemove', mouseMoveHandler)
})
</script>
<style lang="scss" scoped>
.breakout-ball {
  border: 1px solid #00aa88;
}
</style>
