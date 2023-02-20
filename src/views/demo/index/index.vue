<template>
  <div class="demo-view">
    <div>
      <div class="line-height-1 demo-view-item" v-for="(item, index) in demoList" :key="index">
        <a
          class="cursor-pointer"
          @click="navigatorTo(item.path)">{{ item.name }}</a>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  setup () {
    return {
      demoList: [
        { name: '掘金大佬css图片', path: '/demo/bingDwenDwen' },
        { name: 'krpano制作全景跳转', path: '/demo/panorama' },
        { name: '360°全景风景', path: '/demo/360range' },
        { name: 'listen music', path: '/demo/music' },
        { name: '水印', path: '/demo/waterMarker' },
        { name: '3D-ikun集合', path: '/demo/3d-scene' },
        { name: '3D-模型', path: '/demo/3d-doctor' },
        { name: '3D-DOA5玛丽罗斯', path: '/demo/3d-Marie-Rose' },
        { name: 'live-2d', path: '/demo/live-2d' },
        { name: '视差滚动parallax-scroll', path: '/demo/parallax-scroll' }
      ],
      navigatorTo: (path) => window.open(`./#${path}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-view{
  padding: 10px;
  .demo-view-item{
    font-size: 16px;
    padding: 5px 0;
    color: var(--global-primary-color);
    a{
      color: var(--global-primary-color);
    }
  }
}
</style>
