export const demoList = [
  {
    path: 'infinite-scroll',
    name: 'infinite-scroll',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '无限滚动'
    },
    component: () =>
      import(
        /* webpackChunkName: "infinite-scroll" */ '../views/demo/children/infinite-scroll/index.vue'
      )
  },
  {
    path: 'office-file-preview',
    name: 'office-file-preview',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '文件在线预览'
    },
    component: () =>
      import(
        /* webpackChunkName: "office-file-preview" */ '../views/demo/children/office-file-preview/index.vue'
      )
  },
  {
    path: 'full-screen-scroll',
    name: 'full-screen-scroll',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '全屏滚动'
    },
    component: () =>
      import(
        /* webpackChunkName: "full-screen-scroll" */ '../views/demo/children/full-screen-scroll/index.vue'
      )
  },
  {
    path: 'hanzi',
    name: 'hanzi',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '汉子笔画顺序'
    },
    component: () =>
      import(
        /* webpackChunkName: "hanzi" */ '../views/demo/children/hanzi/index.vue'
      )
  },
  {
    path: 'excel-preview-edit',
    name: 'excel-preview-edit',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'excel在线预览编辑'
    },
    component: () =>
      import(
        /* webpackChunkName: "excel-preview-edit" */ '../views/demo/children/excel-preview-edit/index.vue'
      )
  },
  {
    path: 'mention-function',
    name: 'mention-function',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '类似微博@某人功能'
    },
    component: () =>
      import(
        /* webpackChunkName: "mention-function" */ '../views/demo/children/mention-function/index.vue'
      )
  },
  {
    path: 'parallax-scroll',
    name: 'parallax-scroll',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '视差滚动parallax-scroll'
    },
    component: () =>
      import(
        /* webpackChunkName: "parallax-scroll" */ '../views/demo/children/parallax-scroll/index.vue'
      )
  },
  {
    path: 'live-2d',
    name: 'live-2d',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'live-2d二次元'
    },
    component: () =>
      import(
        /* webpackChunkName: "live-2d" */ '../views/demo/children/live-2d/index.vue'
      )
  },
  {
    path: '3d-Marie-Rose',
    name: '3d-Marie-Rose',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '3D-DOA5玛丽罗斯'
    },
    component: () =>
      import(
        /* webpackChunkName: "3d-Marie-Rose" */ '../views/demo/children/3d-Marie-Rose/index.vue'
      )
  },
  {
    path: '3d-doctor',
    name: '3d-doctor',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '3D-模型'
    },
    component: () =>
      import(
        /* webpackChunkName: "3d-doctor" */ '../views/demo/children/3d-doctor/index.vue'
      )
  },
  {
    path: 'waterMarker',
    name: 'waterMarker',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '水印'
    },
    component: () =>
      import(
        /* webpackChunkName: "waterMarker" */ '../views/demo/children/waterMarker/index.vue'
      )
  },
  {
    path: 'panorama',
    name: 'panorama',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'krpano制作全景跳转'
    },
    component: () =>
      import(
        /* webpackChunkName: "panorama" */ '../views/demo/children/panorama/index.vue'
      )
  },
  {
    path: '360range',
    name: '360range',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '360°VR全景风景'
    },
    component: () =>
      import(
        /* webpackChunkName: "360range" */ '../views/demo/children/360range/index.vue'
      )
  },
  {
    path: '3d-scene',
    name: '3d-scene',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '3D-ikun集合'
    },
    component: () =>
      import(
        /* webpackChunkName: "3d-scene" */ '../views/demo/children/3d-scene/index.vue'
      )
  },
  {
    path: 'music',
    name: 'music',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '随着music律动进行动画'
    },
    component: () =>
      import(
        /* webpackChunkName: "music" */ '../views/demo/children/music/index.vue'
      )
  },
  {
    path: 'bingDwenDwen',
    name: 'bingDwenDwen',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '掘金大佬css图片'
    },
    component: () =>
      import(
        /* webpackChunkName: "bingDwenDwen" */ '../views/demo/children/bingDwenDwen/index.vue'
      )
  },
  {
    path: 'filmstrip',
    name: 'filmstrip',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '幻灯片播放'
    },
    component: () =>
      import(
        /* webpackChunkName: "filmstrip" */ '../views/demo/children/filmstrip/index.vue'
      )
  },
  {
    path: 'load-vue-file',
    name: 'load-vue-file',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '加载远程vue文件执行'
    },
    component: () =>
      import(
        /* webpackChunkName: "load-vue-file" */ '../views/demo/children/load-vue-file/index.vue'
      )
  },
  {
    path: 'infinite-grid',
    name: 'infinite-grid',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '瀑布流'
    },
    component: () =>
      import(
        /* webpackChunkName: "infinite-grid" */ '../views/demo/children/infinite-grid/index.vue'
      )
  },
  {
    path: 'auto-animate',
    name: 'auto-animate',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '动画自动过渡'
    },
    component: () =>
      import(
        /* webpackChunkName: "auto-animate" */ '../views/demo/children/auto-animate/index.vue'
      )
  },
  {
    path: 'markdown-editor',
    name: 'markdown-editor',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'markdown编辑器'
    },
    component: () =>
      import(
        /* webpackChunkName: "markdown-editor" */ '../views/demo/children/markdown-editor/index.vue'
      )
  },
  {
    path: 'virtual-scroller',
    name: 'virtual-scroller',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '虚拟滚动'
    },
    component: () =>
      import(
        /* webpackChunkName: "virtual-scroller" */ '../views/demo/children/virtual-scroller/index.vue'
      )
  },
  {
    path: 'word-diff',
    name: 'word-diff',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '文字diff对比'
    },
    component: () =>
      import(
        /* webpackChunkName: "word-diff" */ '../views/demo/children/word-diff/index.vue'
      )
  },
  {
    path: 'canvas-scroll',
    name: 'canvas-scroll',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '背景canvas内容随滚动条位置变动'
    },
    component: () =>
      import(
        /* webpackChunkName: "canvas-scroll" */ '../views/demo/children/canvas-scroll/index.vue'
      )
  },
  {
    path: 'video-scroll',
    name: 'video-scroll',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '背景视频内容随滚动条位置变动'
    },
    component: () =>
      import(
        /* webpackChunkName: "video-scroll" */ '../views/demo/children/video-scroll/index.vue'
      )
  },
  {
    path: 'my-signature',
    name: 'my-signature',
    meta: {
      ifShowHeaderComponent: false,
      demoName: '个人签名'
    },
    component: () =>
      import(
        /* webpackChunkName: "my-signature" */ '../views/demo/children/my-signature/index.vue'
      )
  },
  {
    path: 'video-player',
    name: 'video-player',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'video-player'
    },
    component: () =>
      import(
        /* webpackChunkName: "video-player" */ '../views/demo/children/video-player/index.vue'
      )
  },
  {
    path: 'canvas-ts-video',
    name: 'canvas-ts-video',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'ts格式视频播放'
    },
    component: () =>
      import(
        /* webpackChunkName: "canvas-ts-video" */ '../views/demo/children/canvas-ts-video/index.vue'
      )
  },
  {
    path: 'playground',
    name: 'playground',
    meta: {
      ifShowHeaderComponent: false,
      demoName: 'vue3-playground演练场'
    },
    component: () =>
      import(
        /* webpackChunkName: "playground" */ '../views/demo/children/playground/index.vue'
      )
  }
]

export const demoMenuList = () => {
  const list = []
  demoList.forEach((item) => {
    list.push({
      name: item.meta.demoName,
      path: `/demo/${item.path}`
    })
  })
  return list
}
