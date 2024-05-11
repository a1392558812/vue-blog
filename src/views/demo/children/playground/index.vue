<template>
    <div class="play-ground overflow-auto flex flex-direction-column align-items-center">
        <div>代码块演示厂</div>
        <div style="margin-bottom: 10px">
            <div>演示框尺寸</div>
            <div>宽: <input type="number" v-model="playGroundPlaneWidth" />px</div>
            <div>高: <input type="number" v-model="playGroundPlaneReplHeight" />px</div>
        </div>
        <playground-plane
          :defaultTemplate="defaultTemplate"
          :playGroundPlaneWidth="`${playGroundPlaneWidth}px`"
          :playGroundPlaneReplHeight="`${playGroundPlaneReplHeight}px`"/>
    </div>
</template>

<script>
import { ref } from 'vue'
import playgroundPlane from './components/playground-plane/index.vue'

const defaultTemplate = '<template>\n' +
'  <div class="youyuxi" @click="count++">\n' +
'       {{ msg }}\n' +
'       (颂歌<span style="color: green">{{ count }}</span>次)\n' +
'   </div>\n' +
'</template>\n' +
'<script setup>\n' +
'import { ref } from "vue"\n' +
'  const count = ref(1)\n' +
'  const msg = ref("🥵赞美尤雨溪，赐予我们伟大的Vue")\n' +
'</' + 'script>\n' +
'<style>\n' +
'.youyuxi {\n' +
'  color: red;\n' +
'}\n' +
'</style>'
export default {
  components: {
    playgroundPlane
  },
  setup () {
    return {
      playGroundPlaneWidth: ref(630),
      playGroundPlaneReplHeight: ref(270),
      defaultTemplate: ref(defaultTemplate)
    }
  }
}

</script>

<style lang="scss" scoped>
    .play-ground {
        height: 100vh;
    }
</style>
