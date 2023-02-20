<template>
  <div class="relative canvas-wrap">
    <div id="canvas"></div>
    <div class="absolute line-height-1 tips">模型有49Mb的大小，github加载很慢，能不能加载出来听天由命吧</div>
  </div>
</template>
<script>
import THREE from '@/static/three-onEvent/index'
// 引入加载器
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// 引入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, onUnmounted } from 'vue'
export default {
  setup () {
    let renderer,
      scene,
      camera,
      particle,
      fbxModel,
      controls,
      modelAnimate,
      threeOnEvent,
      geometry,
      material,
      headerbox,
      boxMaterial,
      cube,
      loader,
      ambientLight,
      lights
    // 清除模型
    const clearModel = () => {
      // 清除局部的模型
      if (scene !== null && scene.children.length > 3) {
        scene.children.pop()
        // 必须要清空当前div下的canvas不然canvas会继续叠加为什么呢？明明场景和相机等等都清空了
        const domDiv = document.getElementById('canvas')
        if (domDiv !== null) {
          domDiv.removeChild(domDiv.firstChild)
        }
        // 确保3D相关对象已销毁
        window.cancelAnimationFrame(modelAnimate) // 可以取消动画
        window.removeEventListener('resize', onWindowResize)
        releaseRender(renderer, scene)
        scene = null
        camera = null
        renderer = null
        controls = null
        particle = null
        fbxModel = null
        modelAnimate = null
        geometry = null
        material = null
        headerbox = null
        boxMaterial = null
        cube = null
        loader = null
      }
    }
    // 释放缓存
    const releaseRender = (renderer, scene) => {
      const clearScene = function (scene) {
        let arr = scene.children.filter((x) => x)

        arr.forEach((item) => {
          if (item.children.length) {
            clearScene(item)
          } else {
            if (item.type === 'Mesh') {
              item.geometry.dispose()

              item.material.dispose()

              !!item.clear && item.clear()
            }
          }
        })

        !!scene.clear && scene.clear(renderer)

        arr = null
      }

      try {
        clearScene(scene)
      } catch (e) {}

      try {
        renderer.renderLists.dispose()

        renderer.dispose()

        renderer.forceContextLoss()

        renderer.domElement = null

        renderer.content = null

        renderer = null
      } catch (e) {}

      if (window.requestAnimationId) {
        cancelAnimationFrame(window.requestAnimationId)
      }

      THREE.Cache.clear()
    }
    // 视口调整
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    onMounted(() => {
      init().then(() => animate())
      function init () {
        return new Promise((resolve) => {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
          renderer.setPixelRatio(
            window.devicePixelRatio ? window.devicePixelRatio : 1
          )
          renderer.setSize(window.innerWidth, window.innerHeight)
          renderer.autoClear = false
          renderer.setClearColor(0x000000, 0.0)
          document.getElementById('canvas').appendChild(renderer.domElement)

          scene = new THREE.Scene()

          camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
          )

          threeOnEvent = new THREE.onEvent(scene, camera)
          console.log('threeOnEvent', threeOnEvent)

          // 头部套盒
          headerbox = new THREE.BoxGeometry(20, 24, 20)
          boxMaterial = new THREE.MeshBasicMaterial({
            // color: 0x00ff00
            transparent: true,
            opacity: 0
          })
          cube = new THREE.Mesh(headerbox, boxMaterial)
          cube.position.y = 77
          cube.material.opacity = 0
          camera.position.z = 400
          const handelClick = () => {
            alert('点击头部，2000ms后重新加载模型，模拟加载新模型')
            cube.off('click', handelClick)
            clearModel()
            setTimeout(() => {
              init().then(() => animate())
            }, 2000)
          }
          cube.on('click', handelClick)
          scene.add(cube)

          // 添加控制器
          controls = new OrbitControls(camera, renderer.domElement)
          console.log('controls', controls)
          scene.add(camera)
          // 添加模型 FBX加载
          loader = new FBXLoader()
          loader.load(
            'demo-static/model/model1.fbx',
            function (fbx) {
              fbxModel = fbx
              console.log('fbx', fbx)
              fbxModel.scale.set(1, 1, 1)
              fbxModel.position.x = 0
              fbxModel.position.y = -90
              fbxModel.position.z = 0
              fbxModel.traverse(function (child) {
                const loader = new THREE.TextureLoader()
                loader.load(
                  'demo-static/model/FBX.fbm/Heart_Bump_B.jpg',
                  function (texture) {
                    child.material && (child.material.map = texture)
                    child.material && (child.material.needsUpdate = true)
                  },
                  undefined,
                  function (err) {
                    console.error('An error happened.', err)
                  }
                )
                loader.load(
                  'demo-static/model/FBX.fbm/Heart_B.jpg',
                  function (texture) {
                    child.material && (child.material.map = texture)
                    child.material && (child.material.needsUpdate = true)
                  },
                  undefined,
                  function (err) {
                    console.error('An error happened.', err)
                  }
                )
              })
              scene.add(fbxModel)
              resolve()
            },
            undefined,
            function (error) {
              console.error(error)
            }
          )

          particle = new THREE.Object3D()
          scene.add(particle)
          geometry = new THREE.TetrahedronGeometry(2, 0)
          material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
          })
          for (let i = 0; i < 1000; i++) {
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position
              .set(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
              )
              .normalize()
            mesh.position.multiplyScalar(90 + Math.random() * 700)
            mesh.rotation.set(
              Math.random() * 2,
              Math.random() * 2,
              Math.random() * 2
            )
            particle.add(mesh)
          }

          ambientLight = new THREE.AmbientLight(0x999999)
          scene.add(ambientLight)

          lights = []
          lights[0] = new THREE.DirectionalLight(0xffffff, 1)
          lights[0].position.set(1, 0, 0)
          lights[1] = new THREE.DirectionalLight(0x11e8bb, 1)
          lights[1].position.set(0.75, 1, 0.5)
          lights[2] = new THREE.DirectionalLight(0x8200c9, 1)
          lights[2].position.set(-0.75, -1, 0.5)
          scene.add(lights[0])
          scene.add(lights[1])
          scene.add(lights[2])

          window.addEventListener('resize', onWindowResize, false)
        })
      }

      function animate () {
        modelAnimate = requestAnimationFrame(animate)
        fbxModel.rotation.x += 0.0
        fbxModel.rotation.y -= 0.004
        particle.rotation.x += 0.0
        particle.rotation.y -= 0.004
        renderer.clear()
        renderer.render(scene, camera)
      }
    })
    onUnmounted(() => {
      clearModel()
      releaseRender()
    })
  }
}
</script>
<style scoped lang="scss">
.canvas-wrap,#canvas {
  width: 100vw;
  height: 100vh;
  .tips{
    font-size: 15px;
    padding: 10px;
    border: 1px solid #000;
    border-radius: 5px;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
