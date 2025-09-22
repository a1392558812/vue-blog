<template>
  <div
    class="w-screen h-screen relative overflow-hidden flex items-center justify-center bg-[linear-gradient(135deg,_#1a1a2e_0%,_#16213e_100%)]"
    ref="containerRef">
    <div class="absolute top-[20px] left-[0] right-[0] text-center text-[white] z-10">
      <div class="text-[24px] [font-weight:bold] m-[5px] [text-shadow:2px_2px_4px_rgba(0,_0,_0,_0.5)] ">得分: {{ score }}
      </div>
      <div class="text-[24px] [font-weight:bold] m-[5px] [text-shadow:2px_2px_4px_rgba(0,_0,_0,_0.5)]">关卡: {{ level }}
      </div>
      {{ isGameOver }}
      <div class="text-[18px] mt-[10px] opacity-80" v-if="!isGameOver">点击或按空格键堆叠方块</div>
      <div class="bg-[rgba(0,_0,_0,_0.8)] p-[30px] rounded-[15px] [box-shadow:0_10px_30px_rgba(0,_0,_0,_0.5)] "
        v-if="isGameOver">
        <div class="text-[36px] [font-weight:bold] text-[#ff6b6b] mb-[15px]">游戏结束!</div>
        <div class="text-[24px] mb-[20px]">最终得分: {{ score }}</div>
        <button
          class="bg-[#4ecdc4] text-[white] border-none px-[30px] py-[15px] text-[18px] rounded-[30px] cursor-pointer [transition:all_0.3s_ease] [font-weight:bold] hover:bg-[#45b7d1] hover:scale-105"
          @click.prevent.stop="restartGame">重新开始</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'

// DOM引用
const containerRef = ref()

// 游戏状态
const score = ref(0)
const level = ref(1)
const isGameOver = ref(false)

let scene
let camera
let renderer
let controls
let cubeGroup
let currentCube
let animationFrameId
let gameLoopId
const leftBorder = -6

// 方块移动参数
let cubeSpeed = 0.02
let cubeDirection = 1
const cubeSize = 1
const cubeSpacing = 0.02

// 存储下方方块信息，用于边界限制
const lowerCubeInfo = {
  positionX: 0,
  halfWidth: cubeSize * 2
}

// 初始化Three.js场景
const initThreeScene = async () => {
  await nextTick()
  if (!containerRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  // 创建相机
  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 6, 15)
  camera.lookAt(0, 0, 0)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  containerRef.value.appendChild(renderer.domElement)

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.enableZoom = true
  controls.zoomSpeed = 0.5
  controls.minDistance = 5
  controls.maxDistance = 20

  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7.5)
  scene.add(directionalLight)

  // 创建方块组
  cubeGroup = new THREE.Group()
  scene.add(cubeGroup)

  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(15, 15)
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -cubeSize / 2
  scene.add(ground)

  // 创建初始方块
  createInitialCube()

  // 添加事件监听
  window.addEventListener('resize', handleResize)
  containerRef.value.addEventListener('click', handleClick)
  window.addEventListener('keydown', handleKeyDown)

  startGameLoop()
  animate()
}

// 创建初始方块
const createInitialCube = () => {
  const geometry = new THREE.BoxGeometry(cubeSize * 4, cubeSize, cubeSize * 4)
  const material = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    roughness: 0.5,
    metalness: 0.2
  })
  const initialCube = new THREE.Mesh(geometry, material)
  initialCube.position.y = 0
  cubeGroup.add(initialCube)

  // 创建当前移动的方块
  createNextCube()
}

// 创建下一个要堆叠的方块
const createNextCube = () => {
  const geometry = new THREE.BoxGeometry(cubeSize * 4, cubeSize, cubeSize * 4)

  // 随机颜色
  const colors = [0xef8b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdfe6e9]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  const material = new THREE.MeshStandardMaterial({
    color: randomColor,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8
  })

  // 创建当前移动的方块
  currentCube = new THREE.Mesh(geometry, material)
  currentCube.position.y = cubeSize * cubeGroup.children.length + cubeSize / 2 + cubeSpacing
  currentCube.position.x = leftBorder // 从左侧开始
  scene.add(currentCube)

  // 重置方向
  cubeDirection = 1

  // 如果有下方方块，更新下方方块信息
  if (cubeGroup.children.length > 0) {
    const lowerCube = cubeGroup.children[cubeGroup.children.length - 1]
    const lowerGeometry = lowerCube.geometry

    lowerCubeInfo.positionX = lowerCube.position.x
    lowerCubeInfo.halfWidth = lowerGeometry.parameters.width / 2
  } else {
    // 第一个方块，使用默认信息
    lowerCubeInfo.positionX = 0
    lowerCubeInfo.halfWidth = cubeSize / 2
  }
}

const handleClick = () => {
  if (isGameOver.value) return
  stackCube()
}

const handleKeyDown = (event) => {
  if (isGameOver.value) return
  if (event.code === 'Space') {
    stackCube()
  }
}

// 堆叠方块
const stackCube = () => {
  if (!currentCube) return

  // 检查是否有下面的方块
  const hasLowerCube = cubeGroup.children.length > 0
  let isValidStack = true

  // 如果不是第一个方块，进行碰撞检测
  if (hasLowerCube) {
    const lowerCube = cubeGroup.children[cubeGroup.children.length - 1]

    // 获取下方方块的实际大小，下方方块可能已经被切割过，所以不能直接使用cubeSize变量
    const lowerGeometry = lowerCube.geometry
    const lowerSizeX = lowerGeometry.parameters.width
    const lowerHalfSizeX = lowerSizeX / 2

    // 计算当前方块和下方方块的位置
    const currentX = currentCube.position.x
    const lowerX = lowerCube.position.x
    const currentHalfSize = cubeSize * 2

    // 计算左右边界
    const currentLeft = currentX - currentHalfSize
    const currentRight = currentX + currentHalfSize
    const lowerLeft = lowerX - lowerHalfSizeX
    const lowerRight = lowerX + lowerHalfSizeX

    // 计算重叠区域
    const overlapLeft = Math.max(currentLeft, lowerLeft)
    const overlapRight = Math.min(currentRight, lowerRight)

    // 检查是否有重叠
    if (overlapLeft >= overlapRight) {
      // 没有重叠，游戏结束
      isValidStack = false
      gameOver()
      return
    }

    // 计算新的方块大小和位置,新方块的大小等于重叠区域的宽度，确保不超过下方方块
    const newSize = overlapRight - overlapLeft
    const newX = (overlapLeft + overlapRight) / 2

    const finalSize = Math.min(newSize, lowerSizeX)

    // 创建新的几何体和材质
    // 使用finalSize确保新方块的大小不超过下方方块，多出来的部分被完全裁掉
    const geometry = new THREE.BoxGeometry(finalSize, cubeSize, cubeSize * 4)
    const material = new THREE.MeshStandardMaterial({
      color: (currentCube.material).color,
      roughness: 0.5,
      metalness: 0.2
    })

    // 创建新的方块
    const stackedCube = new THREE.Mesh(geometry, material)
    stackedCube.position.x = newX
    stackedCube.position.y = currentCube.position.y
    stackedCube.position.z = 0

    // 移除旧方块并添加新方块
    scene.remove(currentCube)
    cubeGroup.add(stackedCube)

    // 更新当前方块引用
    currentCube = stackedCube
  } else {
    // 移除透明度
    const material = currentCube.material
    material.transparent = false
    material.opacity = 1

    // 将当前方块添加到方块组
    scene.remove(currentCube)
    cubeGroup.add(currentCube)
  }

  if (isValidStack) {
    // 更新分数
    score.value++

    // 增加难度
    if (score.value % 5 === 0) {
      level.value++
      cubeSpeed += 0.01 // 增加方块移动速度
    }

    const cubeCount = cubeGroup.children.length

    // 每堆叠一个方块，增加0.8的高度和0.5的后退距离
    const newCameraY = 6 + cubeCount * 0.8
    const newCameraZ = 15 + cubeCount * 0.5

    // 计算目标点，始终指向堆叠顶部上方一点
    const targetY = cubeCount * cubeSize + 2

    // 使用gsap平滑地动画相机位置和朝向
    gsap.to(camera.position, {
      y: newCameraY,
      z: newCameraZ,
      duration: 0.5,
      ease: 'power2.inOut'
    })

    // 同时调整轨道控制器的目标点，确保始终看向堆叠顶部
    gsap.to(controls.target, {
      y: targetY,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    controls.update()

    // 创建目标方块用于下次堆叠
    createNextCube()
  }
}

// 游戏主循环
const startGameLoop = () => {
  gameLoopId = window.setInterval(() => {
    if (isGameOver.value || !currentCube) return

    // 移动当前方块
    currentCube.position.x += cubeSpeed * cubeDirection

    // 碰到边界时改变方向
    if (cubeDirection > 0) {
      // 向右移动时，不可超过当前下方方块最右边界，需立即返回
      // 计算当前方块和下方方块的最右边界位置
      // 从当前方块的几何体中获取实际宽度，而不是使用固定值
      const currentGeometry = currentCube.geometry
      const currentCubeHalfWidth = currentGeometry.parameters.width / 2
      const currentCubeRightEdge = currentCube.position.x + currentCubeHalfWidth
      const lowerCubeRightEdge = lowerCubeInfo.positionX + lowerCubeInfo.halfWidth

      if (currentCubeRightEdge > lowerCubeRightEdge) {
        // 计算需要回退的距离，确保当前方块的最右边缘不超过下方方块的最右边缘
        const overlapDistance = currentCubeRightEdge - lowerCubeRightEdge
        currentCube.position.x -= overlapDistance
        cubeDirection = -1 // 立即反向返回
      }
    } else if (currentCube.position.x < leftBorder) {
      // 向左移动仍然使用固定边界
      currentCube.position.x = leftBorder
      cubeDirection = 1
    }
  }, 16)
}

// 渲染循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  // 更新控制器
  controls.update()

  renderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!containerRef.value) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 游戏结束
const gameOver = () => {
  isGameOver.value = true
  clearInterval(gameLoopId)

  // 显示游戏结束动画
  if (currentCube) {
    scene.remove(currentCube)
    currentCube = undefined
  }
}

// 重新开始游戏
const restartGame = () => {
  // 首先清除游戏循环，避免冲突
  clearInterval(gameLoopId)

  // 重置游戏状态
  score.value = 0
  level.value = 1

  cubeSpeed = 0.02
  cubeDirection = 1

  // 重置下方方块信息
  lowerCubeInfo.positionX = 0
  lowerCubeInfo.halfWidth = cubeSize * 2

  // 清除所有方块
  while (cubeGroup.children.length > 0) {
    const child = cubeGroup.children[0]
    cubeGroup.remove(child)
  }

  // 移除当前方块
  if (currentCube) {
    scene.remove(currentCube)
    currentCube = undefined
  }

  nextTick(() => {
    isGameOver.value = false

    // 重置相机位置和轨道控制器目标点
    gsap.to(camera.position, {
      y: 6,
      z: 15,
      duration: 0.5,
      ease: 'power2.inOut'
    })


    gsap.to(controls.target, {
      y: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    controls.update()

    createInitialCube()
    startGameLoop()
  })
}

// 清理资源
const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  clearInterval(gameLoopId)

  if (containerRef.value) {
    containerRef.value.removeEventListener('click', handleClick)
    if (renderer && renderer.domElement && containerRef.value.contains(renderer.domElement)) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)

  if (controls) {
    controls.dispose()
  }

  if (renderer) {
    renderer.dispose()
  }
}

onMounted(() => {
  initThreeScene()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped></style>
