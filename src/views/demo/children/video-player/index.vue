<template>
  <div class="flex items-center justify-center video-wrap">
    <div class="nPlayer-wrap" ref="nPlayerWrapRef"></div>
  </div>
</template>
<script>
import { ref, onMounted, onBeforeUnmount, createApp, nextTick } from 'vue'
import Player, { Popover } from 'nplayer'
import Danmaku from '@nplayer/danmaku'

import quality from './components/quality.vue'

import { svg1, svg2, svg3 } from './svg'
import { baseUrlFun } from '@/common/util/methods'

export default {
  name: 'view-demo-video-player',
  setup() {
    const active = ref(0)
    const nPlayerWrapRef = ref(null)
    const baseUrl = baseUrlFun()
    const videoUrl = baseUrl + 'demo-static/filmstrip/video/video.mp4?source=360p'
    const list = [
      {
        label: '360p',
        baseUrl: baseUrl + 'demo-static/filmstrip/video/video.mp4?source=360p'
      },
      {
        label: '480p',
        baseUrl: baseUrl + 'demo-static/filmstrip/video/video.mp4?source=480p'
      },
      {
        label: '720p',
        baseUrl: baseUrl + 'demo-static/filmstrip/video/video.mp4?source=720p'
      },
      {
        label: '1080p',
        baseUrl: baseUrl + 'demo-static/filmstrip/video/video.mp4?source=1080p'
      }
    ]
    const images = (() => {
      const list = []
      for (let i = 1; i <= 11; i++) {
        list.push(baseUrl + `demo-static/video-player/video_${i}.jpg`)
      }
      return list
    })()

    let video = document.createElement('video')
    video.src = videoUrl

    const tipDom1 = document.createElement('div')
    tipDom1.innerHTML = svg1
    const tipDom2 = document.createElement('div')
    tipDom2.innerHTML = svg2
    const tipDom3 = document.createElement('div')
    tipDom3.innerHTML = svg3

    let player = new Player({
      plugins: [
        new Danmaku({
          items: [
            { time: 0.602321, text: '弹幕1～', color: 'red' },
            { time: 1.145145, text: '弹幕2～', color: 'pink', type: 'bottom' },
            { time: 1.777777, text: '弹幕3～', color: 'skyblue' },
            { time: 2.123456, text: '弹幕996～', color: 'skyblue', isMe: true, type: 'top' }
          ]
        })
      ],
      isTouch: true,
      settings: [
        'speed',
        {
          type: 'switch',
          html: '视频镜像',
          checked: false,
          init(player) {
            player.video.classList.remove('nplayer_video-mirroring')
          },
          change(value, player) {
            player.video.classList.toggle('nplayer_video-mirroring', value)
          }
        }
      ],
      thumbnail: {
        startSecond: 0,
        gapSecond: 1,
        col: 1,
        row: 1,
        width: 427 / 3,
        height: 240 / 3,
        images
      },
      controls: [
        [
          'play',
          'volume',
          'time',
          'spacer',
          'airplay',
          'settings',
          'web-fullscreen',
          'fullscreen',
          {
            el: tipDom2,
            id: 'tipDom2',
            tip: '🐮🍺滴画质',
            init(player, position, tooltip) {
              const popover = new Popover(tipDom2)
              const div = document.createElement('div')
              popover.applyPanelStyle({
                padding: '5px 0'
              })
              tipDom2.onclick = () => {
                console.log('click')
                popover.show()
                tooltip.hide()
              }
              tipDom2.onmouseenter = () => {
                tooltip.show()
              }
              const app = createApp(quality, {
                list,
                active: active.value,
                handleClick: (index, e) => {
                  e.stopPropagation()
                  popover.el.classList.remove('nplayer_popover-active')
                  if (index === active.value) return
                  player.pause()
                  active.value = index

                  let currentTime = video.currentTime
                  currentTime = currentTime === 0 ? 0 : currentTime - 0.1

                  video.src = list[index].baseUrl
                  video.currentTime = currentTime
                  player.play()
                }
              })
              nextTick().then(() => {
                app.mount(div)
                popover.panelEl.appendChild(div)
              })
            }
          },
          {
            tip: '🐮🍺啥也不是',
            el: tipDom1,
            init(player, position, tooltip) {
              tipDom1.onclick = (e) => {
                alert('当前click', { player, position, tooltip, e })
              }
            },
            update() {
              console.log('update')
            }
          },
          {
            el: tipDom3,
            id: 'tipDom3',
            tip: '🐮🍺截屏',
            init(player) {
              tipDom3.onclick = () => {
                const canvas = document.createElement('canvas')
                canvas.width = player.video.videoWidth
                canvas.height = player.video.videoHeight
                canvas.getContext('2d').drawImage(player.video, 0, 0, canvas.width, canvas.height)
                canvas.toBlob((blob) => {
                  const dataURL = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = dataURL
                  link.download = '狠狠の截.png'
                  link.style.display = 'none'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(dataURL)
                })
              }
            }
          }
        ],
        ['progress']
      ],
      contextMenus: [
        'loop',
        'pip',
        {
          html: '看看我の黑手',
          init(player, item) {
            console.log('init', player, item, this)
            this.message = '黑手！！！！！'
            // 初始化是判断浏览器是否不支持，不支持则隐藏自己
          },
          show(player, item) {
            console.log('show', player, item)
          },
          click(player, item) {
            console.log('click', player, item)
            alert(this.message)
          }
        }
      ],
      contextMenuToggle: true,
      video,
      videoProps: { autoplay: 'true' }
    })
    player.on('DanmakuSend', (opts) => {
      console.log('DanmakuSend', opts)
    })
    onMounted(() => {
      player.mount(nPlayerWrapRef.value)
      video.onclick = () => {
        player.toggle()
      }
    })
    onBeforeUnmount(() => {
      player.dispose()
      player = null
      video = null
    })
    return {
      nPlayerWrapRef
    }
  }
}
</script>
<style scoped lang="scss">
.video-wrap {
  width: 100vw;
  height: 100vh;
}
.nPlayer-wrap {
  width: 1000px;
  height: 563px;
  ::v-deep(.nplayer_thumb_img) {
    background-size: 100% auto;
  }
  ::v-deep(.nplayer_video-mirroring) {
    transform: scaleX(-1);
  }
}
</style>
