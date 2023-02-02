<template>
  <div class="relative canvas-wrap">
    <div id="canvas"></div>
    <div class="absolute line-height-1 tips">
      <p style="margin-bottom:10px">模型拢共大小30Mb，github这网速，慢慢加载吧</p>
      <p style="margin-bottom:10px">这个是学习threejs大佬“暮志未晚”的,</p>
      <p>详情指路：<a href="http://www.wjceo.com/">http://www.wjceo.com/</a></p>
    </div>
  </div>
</template>
<script>
import { onMounted } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import Stats from 'stats.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  setup () {
    let renderer, camera, scene, gui, stats, ambientLight, directionalLight, control

    let mixer; const clock = new THREE.Clock()

    function initRender () {
      renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 告诉渲染器需要阴影效果
      renderer.shadowMap.enabled = true
      document.getElementById('canvas').appendChild(renderer.domElement)
    }

    function initCamera () {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, 30, 60)
      camera.lookAt(new THREE.Vector3(0, 0, 0))
      scene.add(camera)
    }

    function initScene () {
      scene = new THREE.Scene()
    }

    function initGui () {
      // 声明一个保存需求修改的相关数据的对象
      gui = {}

      const datGui = new dat.GUI()
      console.log('datGui, gui', datGui, gui)
      // 将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    }

    function initLight () {
      ambientLight = new THREE.AmbientLight('#bbbbbb')
      scene.add(ambientLight)

      directionalLight = new THREE.DirectionalLight('#ffffff')
      directionalLight.position.set(40, 60, 10)

      directionalLight.shadow.camera.near = 1 // 产生阴影的最近距离
      directionalLight.shadow.camera.far = 400 // 产生阴影的最远距离
      directionalLight.shadow.camera.left = -50 // 产生阴影距离位置的最左边位置
      directionalLight.shadow.camera.right = 50 // 最右边
      directionalLight.shadow.camera.top = 50 // 最上边
      directionalLight.shadow.camera.bottom = -50 // 最下面

      // 这两个值决定生成阴影密度 默认512
      directionalLight.shadow.mapSize.height = 1024
      directionalLight.shadow.mapSize.width = 1024

      // 告诉平行光需要开启阴影投射
      directionalLight.castShadow = true

      camera.add(directionalLight)
    }

    function initModel () {
      // 底部平面
      const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
      const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333, side: THREE.DoubleSide })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.y = -0.1
      plane.receiveShadow = true // 可以接收阴影
      scene.add(plane)

      // 生成一千个立方体
      const group = new THREE.Group()
      const arr = [] // 生成一个速度的数组
      for (let i = 0; i < 1000; i++) {
        group.add(randomCube())
        arr.push({
          speed: Math.random(),
          y: -3
        })
      }
      scene.add(group)

      // 创建webWorkers
      if (!window.Worker) {
        alert('你的电脑不支持web Workers')
      }
      const myWorker = new Worker('marie/worker.js')

      // 创建gltf加载器
      const loader = new GLTFLoader()
      loader.load('marie/scene.gltf', function (gltf) {
        console.log(gltf)
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            child.frustumCulled = false
            child.castShadow = true
          }
        })
        scene.add(gltf.scene)
        const obj = gltf.scene // 获取到模型对象
        const meshHelper = new THREE.SkeletonHelper(obj)
        console.log('meshHelper', meshHelper)
        // scene.add(meshHelper)
        mixer = new THREE.AnimationMixer(obj)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()

        // 在模型加载完成后，链接worker线程
        console.log('arr', arr)
        myWorker.postMessage(arr)

        myWorker.onmessage = function (e) {
          for (let i = 0; i < e.data.length; i++) {
            group.children[i].position.y = e.data[i].y
          }
        }
      })

      // 随机一个立方体
      function randomCube () {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() })
        const boxSize = Math.random() * 0.5
        const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(Math.random() * 100 - 50, -3, Math.random() * 100 - 50)
        mesh.speed = Math.random()
        return mesh
      }
    }

    function initStats () {
      stats = new Stats()
      document.body.appendChild(stats.dom)
    }

    function initControl () {
      control = new OrbitControls(camera, renderer.domElement)
      control.target.set(0, 15, 0)
    }

    function render () {
      control.update()

      const time = clock.getDelta()

      if (mixer) {
        mixer.update(time)
      }

      renderer.render(scene, camera)
    }

    function onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function animate () {
      // 更新控制器
      render()

      // 更新性能插件
      stats.update()

      requestAnimationFrame(animate)
    }

    function draw () {
      initGui()
      initRender()
      initScene()
      initCamera()
      initLight()
      initModel()
      initStats()

      initControl()

      animate()
      window.onresize = onWindowResize
    }
    onMounted(() => {
      draw()
    })
  }
}
</script>
<style lang="scss" scoped>

.canvas-wrap,canvas {
  display: block;
  width: 100vw;
  height: 100vh;
  .tips{
    top: 30%;
    left: 0;
    color: #fff;
    font-size: 15;
    border: 1px solid #fff;
    border-radius: 5px;
    padding: 10px;
    a{
      color: #fff;
      font-size: 15;
    }
  }
}
</style>
