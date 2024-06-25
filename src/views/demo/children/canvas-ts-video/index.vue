<template>
    <div class="flex flex-direction-column align-items-center justify-content-center">
        <div>
            <canvas width='426' height='240' ref="canvasRef" class="canvas-view"></canvas>
            <div>
                <div>时长：{{ currentTime }}s/10s</div>
                <div>{{ videoTipInfo }}</div>
                <button class="video-btn" @click="function(){ setToggle() }">
                    <span class="display-inline-block label">暂停/播放</span>
                </button>
                <button class="video-btn" @click="setCurrentTime ">
                    <span class="display-inline-block label">在第</span>
                    <input class="display-inline-block label" @click.stop="() => {}" type="number" v-model="inputValue" @input="onInput"/>
                    <span class="display-inline-block label">秒处播放播放</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { nextTick, ref } from 'vue'

import JSMpeg from '@/static/jsmpeg/jsmpeg.min.js'
import { baseUrlFun } from '@/common/util/methods.js'
import { isNull, isNumber } from '@/common/util/typeCheck.js'

export default {
  setup () {
    let jSMpegPlayer
    const canvasRef = ref(null)
    const inputValue = ref(0)
    const currentTime = ref(0)
    const videoTipInfo = ref('')
    let timer

    const onInput = (e) => {
      if ([
        isNull(+e.target.value),
        Number.isNaN(+e.target.value),
        !isNumber(+e.target.value),
        +e.target.value > 10,
        +e.target.value < 0
      ].includes(true)) {
        inputValue.value = 0
      } else {
        inputValue.value = +e.target.value
      }
    }
    const setToggle = (value) => {
      ;(value !== undefined ? !value : jSMpegPlayer.isPlaying) ? jSMpegPlayer.pause() : jSMpegPlayer.play()
    }
    const setCurrentTime = () => {
      jSMpegPlayer.currentTime = inputValue.value
      jSMpegPlayer.nextFrame()
      setToggle(true)
    }
    const getCurrentTime = () => {
      currentTime.value = +jSMpegPlayer.currentTime.toFixed(0)
      clearTimeout(timer)
      timer = setTimeout(() => {
        getCurrentTime()
      }, 200)
    }
    nextTick().then(() => {
      jSMpegPlayer = new JSMpeg.Player(baseUrlFun() + 'demo-static/canvas-ts-video/video.ts', {
        canvas: canvasRef.value,
        autoplay: true,
        disableWebAssembly: true,
        onPlay: () => {
          videoTipInfo.value = 'onPlay'
        },
        onPause: () => {
          videoTipInfo.value = 'onPause'
        },
        onEnded: () => {
          videoTipInfo.value = '播放完了'
        },
        onStalled: () => {
          videoTipInfo.value = '缓冲中...'
        },
        onSourceEstablished: () => {
          videoTipInfo.value = '首次接收到数据'
        },
        onSourceCompleted: () => {
          videoTipInfo.value = '缓冲完所有数据'
        }
      })
      getCurrentTime()
    })
    return {
      canvasRef,
      onInput,
      currentTime,
      inputValue,
      videoTipInfo,
      setToggle,
      setCurrentTime
    }
  }
}
</script>
<style scoped lang="scss">
.video-btn {
    padding: 5px;
    .label {
        padding: 5px;
        border: none;
        outline: none;
        max-width: 6em;
    }
}
</style>
