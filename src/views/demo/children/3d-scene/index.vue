<template>
  <div class="w-[100%] h-[100%] relative scene-wrap">
    <div class="relative w-[100%] h-[100%] scene-content">
      <Renderer
        ref="renderer"
        resize
        antialias
        :orbit-ctrl="{ autoRotate: true, enableDamping: true, dampingFactor: 0.05 }"
        pointer
      >
        <Camera :position="{ x: 0, y: 30, z: 20 }" />
        <Scene background="#000000">
          <!-- 光源位置 -->
          <PointLight ref="light" :intensity="0.5" :position="{ x: 0, y: 0, z: 0 }">
            <Sphere :radius="0.1" />
          </PointLight>
          <PointLight
            color="#ffffff"
            :intensity="1"
            :castShadow="true"
            :position="{ x: 0, y: 18, z: 0 }"
          />

          <Group :rotation="{ x: -Math.PI / 2, y: 0, z: 0 }">
            <Sphere :radius="5" :position="{ x: 0, z: 5 }" @click="handelToastShow">
              <StandardMaterial :props="{ displacementScale: 0.5 }">
                <Texture :src="textureImageArr[0]" />
                <Texture :src="textureImageArr[1]" name="displacementMap" />
                <Texture :src="textureImageArr[2]" name="normalMap" />
                <Texture :src="textureImageArr[3]" name="roughnessMap" />
                <Texture :src="textureImageArr[4]" name="aoMap" />
              </StandardMaterial>
            </Sphere>
            <RenderText
              text="we are ikun"
              align="center"
              font-src="demo-static/json/helvetiker_regular.typeface.json"
              :size="2"
              :height="1"
              :position="{ x: 0, y: 10, z: 0 }"
              :rotation="{ x: Math.PI / 2, y: 0, z: 0 }"
              :cast-shadow="true"
            >
              <PhongMaterial color="#ff0ff0" />
            </RenderText>
            <RectAreaLight
              color="#0060ff"
              :position="{ x: 10, y: 0, z: 1 }"
              v-bind="rectLightsProps"
            />
            <RectAreaLight
              color="#60ff60"
              :position="{ x: -10, y: 0, z: 1 }"
              v-bind="rectLightsProps"
            />
            <RectAreaLight
              color="#ffffff"
              :position="{ x: 0, y: -10, z: 1 }"
              v-bind="rectLightsProps"
            />
            <Plane :width="30" :height="30" :rotation="{ x: 0 }" :position="{ z: -3 }">
              <StandardMaterial :props="{ displacementScale: 0.2, roughness: 0, metalness: 0 }">
                <Texture :props="texturesProps" :src="textureImageArr[0]" />
                <Texture :props="texturesProps" :src="textureImageArr[1]" name="displacementMap" />
                <Texture :props="texturesProps" :src="textureImageArr[2]" name="normalMap" />
                <Texture :props="texturesProps" :src="textureImageArr[3]" name="roughnessMap" />
                <Texture :props="texturesProps" :src="textureImageArr[4]" name="aoMap" />
              </StandardMaterial>
            </Plane>
          </Group>
        </Scene>
        <EffectComposer>
          <RenderPass />
          <UnrealBloomPass :strength="0.3" />
          <FXAAPass />
        </EffectComposer>
      </Renderer>
    </div>
    <teleport to="body">
      <div ref="targetToast" class="lh-none absolute align-center toast">
        <div class="absolute align-center toast-content">吉尼太美-baby</div>
        <div class="w-[100%] h-[100%] absolute toast-bg"></div>
      </div>
    </teleport>
  </div>
</template>

<script>
// textures from https://3dtextures.me/2019/04/26/wood-tiles-002/
import { RepeatWrapping } from 'three'
import { onClickOutside } from '@vueuse/core'
import {
  Camera,
  EffectComposer,
  FXAAPass,
  Group,
  Renderer,
  Plane,
  PointLight,
  RectAreaLight,
  RenderPass,
  PhongMaterial,
  Scene,
  Sphere,
  Text,
  StandardMaterial,
  Texture,
  UnrealBloomPass
} from 'troisjs'
import { onMounted, ref } from 'vue'
export default {
  name: 'view-demo-3d-scene',
  components: {
    Camera,
    EffectComposer,
    FXAAPass,
    PhongMaterial,
    Group,
    RenderText: Text,
    Renderer,
    Plane,
    PointLight,
    RectAreaLight,
    RenderPass,
    Scene,
    Sphere,
    StandardMaterial,
    Texture,
    UnrealBloomPass
  },
  setup() {
    const renderer = ref(null)
    const light = ref(null)
    const targetToast = ref(null)
    // 外部点击事件
    onClickOutside(targetToast, (event) => {
      $('.toast').css('display', 'none')
    })
    // 镜头旋转
    const sceneRollFunc = () => {
      const rendererRef = renderer.value
      const lightRef = light.value.light
      const pointerV3 = rendererRef.three.pointer.positionV3
      rendererRef.onBeforeRender(() => {
        lightRef.position.copy(pointerV3)
      })
    }
    // 绑定右键事件
    const rightClick = () => {
      // 去掉默认的contextmenu事件，否则会和右键事件同时出现。
      document.oncontextmenu = (e) => {
        e.preventDefault()
      }
      document.onmousedown = (e) => {
        if (+e.button === 2) {
          $('.toast').css('display', 'none')
        }
      }
    }
    // esc事件
    const escKeyDownFun = () => {
      document.onkeydown = (event) => {
        const e = event || window.event
        // 按 Esc//要做的事情
        if (e && +e.keyCode === 27) {
          $('.toast').css('display', 'none')
        }
      }
    }

    onMounted(() => {
      sceneRollFunc()
      rightClick()
      escKeyDownFun()
    })
    return {
      renderer,
      light,
      targetToast,
      handelToastShow: () => {
        $('.toast').css('display', 'block')
      },
      texturesProps: {
        repeat: { x: 10, y: 10 },
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
      },
      textureImageArr: [
        new URL('@/assets/images/textures/Wood_Tiles_002_basecolor.jpg', import.meta.url).href,
        new URL('@/assets/images/textures/Wood_Tiles_002_height.png', import.meta.url).href,
        new URL('@/assets/images/textures/Wood_Tiles_002_normal.jpg', import.meta.url).href,
        new URL('@/assets/images/textures/Wood_Tiles_002_roughness.jpg', import.meta.url).href,
        new URL('@/assets/images/textures/Wood_Tiles_002_ambientOcclusion.jpg', import.meta.url)
          .href
      ],
      rectLightsProps: {
        // rotation: { x: -Math.PI / 2 },
        lookAt: { x: 0, y: 0, z: 1 },
        intensity: 5,
        width: 5,
        height: 5,
        helper: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.scene-wrap {
  height: 100vh;
  .scene-content {
    z-index: 1;
  }
}
.toast {
  width: 500px;
  height: 258px;
  display: none;
  font-size: 16px;
  color: #fff;
  border-radius: 5px;
  z-index: 2;
  .toast-content {
    opacity: 1;
  }
  .toast-bg {
    background-image: url('@/assets/images/ikun/play-basketball.jpg');
    opacity: 0.3;
    left: 0;
    top: 0;
  }
}
</style>
