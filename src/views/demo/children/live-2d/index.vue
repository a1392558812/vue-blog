<template>
  <div id="live2d-widget-wrap">
    <div class="waifu">
      <div class="waifu-tips"></div>
      <canvas id="live2d" class="live2d"></canvas>
      <div class="waifu-tool">
        <span class="fui-home"></span>
        <span class="fui-chat"></span>
        <span class="fui-eye"></span>
        <span class="fui-user"></span>
        <span class="fui-photo"></span>
        <span class="fui-info-circle"></span>
        <div class="c-player">
          <span class="play-icon fui-volume"></span>
        </div>
        <span class="fui-cross"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { initModel, live2d_settings as live2dSettings } from '@/static/live2d/waifu-tips'
import waifuTips from '@/static/live2d/waifu-tips.json'

import { onMounted, onBeforeUnmount } from 'vue'
export default {
  name: 'view-demo-live2d',
  setup() {
    live2dSettings.canSwitchTextures = false
    live2dSettings.waifuSize = '280x500'
    live2dSettings.homePageUrl = window.location.origin + window.location.pathname
    live2dSettings.hitokotoAPI = 'hitokoto.cn'
    live2dSettings.waifuDraggable = 'unlimited'
    onMounted(() => {
      initModel(waifuTips)
    })
    onBeforeUnmount(() => {})
  }
}
</script>
<style scoped lang="scss">
#live2d-widget-wrap {
  width: 100vw;
  height: 100vh;
}
</style>
