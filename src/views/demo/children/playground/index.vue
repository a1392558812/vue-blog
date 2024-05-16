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
          :defaultNewSFC="defaultNewSFC"
          :componentsFiles="componentsFiles"
          :playGroundPlaneWidth="`${playGroundPlaneWidth}px`"
          :playGroundPlaneReplHeight="`${playGroundPlaneReplHeight}px`"/>
    </div>
</template>

<script>
import { ref } from 'vue'
import playgroundPlane from '@/components/playground-plane/index.vue'

const defaultTemplate = '<template/>'

const defaultNewSFC = '<template></template>\n' +
'<script setup lang="ts">\n' +
'\n' +
'</' + 'script>\n' +
'<style>\n' +
'\n' +
'</style>'

const file1 = '<template>\n' +
'  <div class="youyuxi">\n' +
'       <test1 style="margin-bottom: 10px"/>\n' +
'\n' +
'       <test2 style="margin-bottom: 10px"/>\n' +
'\n' +
'       <div>{{ msg }}</div>\n' +
'\n' +
'       <div @click="count = count + 1.1">(点击颂歌<span style="color: green">{{ count }}</span>次)</div>\n' +
'   </div>\n' +
'</template>\n' +
'<script setup lang="ts">\n' +
'import { ref } from "vue"\n' +
'import type { Ref } from "vue"\n' +
'import test1 from "./test1.vue"\n' +
'import test2 from "./test2.vue"\n' +
'  const count:Ref<number> = ref(1)\n' +
'  const msg = ref("🥵赞美尤雨溪，赐予我们伟大的Vue")\n' +
'</' + 'script>\n' +
'<style>\n' +
'.youyuxi {\n' +
'  color: red;\n' +
'}\n' +
'</style>'

const file2 = '<template>\n' +
'  <div @click="count++">点击加1,当前为：{{ count }}</div>\n' +
'</template>\n' +
'<script setup>\n' +
'import { ref } from "vue"\n' +
'  const count = ref(1)\n' +
'</' + 'script>\n'

const file3 = '<template><div style="color: pink">这个是test1组件</div></template>\n'

const componentsFiles = {
  'App.vue': file1,
  'test1.vue': file2,
  'test2.vue': file3
}

export default {
  components: {
    playgroundPlane
  },
  setup () {
    return {
      playGroundPlaneWidth: ref(960),
      playGroundPlaneReplHeight: ref(470),
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
