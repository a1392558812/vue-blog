<template>
  <div class="play-ground overflow-auto">
    <div class="flex flex-col items-center" :style="{ width: `${960 + varianceWidth}px` }">
      <div>代码块演示厂</div>
      <div style="margin-bottom: 10px">
        <div>目前已支持vueuse，可调试查看Import Map</div>
        <div>演示框尺寸</div>
        <div>增宽: <input type="number" v-model="varianceWidth" />px</div>
        <div>增高: <input type="number" v-model="varianceHeight" />px</div>
      </div>
    </div>
    <div :style="{ width: `${960 + varianceWidth}px`, height: `${470 + varianceHeight}px` }">
      <playground-plane
        :defaultTemplate="defaultTemplate"
        :defaultNewSFC="defaultNewSFC"
        :componentsFiles="componentsFiles"
        playGroundPlaneWidth="100%"
        playGroundPlaneReplHeight="100%"
      />
    </div>
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'

const defaultTemplate = '<template/>'

const defaultNewSFC =
  `<template></template>
<script setup lang="ts">

</` +
  `script>
<style>
</style>`

const file1 =
  `<template>
  <div class="youyuxi bg-[pink]">
       <div>
         <i class="inline-block w-[19px] h-[19px] i-carbon-logo-github" i-carbon-logo-github></i>
         集成unocss
       </div>
       <test1 style="margin-bottom: 10px"/>
       <test2 style="margin-bottom: 10px"/>
       <test3 style="margin-bottom: 10px"/>
       <div>{{ msg }}</div>
       <div @click="count = count + 1.1">(点击颂歌<span style="color: green">{{ count }}</span>次)</div>
   </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Ref } from "vue"
import test1 from "./test1.vue"
import test2 from "./test2.vue"
import test3 from "./test3.vue"
const count:Ref<number> = ref(1)
const msg = ref("🥵赞美尤雨溪，赐予我们伟大的Vue")

</` +
  `script>

<style>
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    color: red;
}
.youyuxi {
    color: red;
}
</style>`

const file2 =
  `<template>
  <div @click="count++">点击加1,当前为：{{ count }}</div>
</template>
<script setup>
import { ref } from "vue"
const count = ref(1)
</` + 'script>'

const file3 = '<template><div style="color: pink">这个是test1组件</div></template>\n'
const file4 =
  `<template>
    <div>
        <div ref="target" style="width: 400px; height: 200px; border: 1px solid #000">
            <div>vueuse使用演示，目前版本控制于@10.1.0</div>
            <div>x: {{x}}</div>
            <div>y: {{y}}</div>
            <div>isOutside: {{isOutside}}</div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  setup() {
    const target = ref(null)
    const { x, y, isOutside } = useMouseInElement(target)
    return {
      target,
      x,
      y,
      isOutside
    }
  }
}
</` +
  `script>
<style></style>`

const componentsFiles = {
  'App.vue': file1,
  'test1.vue': file2,
  'test2.vue': file3,
  'test3.vue': file4
}

export default {
  name: 'view-demo-playground',
  components: {
    playgroundPlane: defineAsyncComponent(() => import('@/components/playground-plane/index.jsx'))
  },
  setup() {
    return {
      varianceWidth: ref(0),
      varianceHeight: ref(0),
      defaultTemplate: ref(defaultTemplate),
      defaultNewSFC: ref(defaultNewSFC),
      componentsFiles: ref(componentsFiles)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-ground {
  height: 100vh;
}
</style>
