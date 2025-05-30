<template>
  <div
    :style="{
      backgroundColor: 'black',
      height: '100vh'
    }"
    class="w-[100%] h-[100%] overflow-hidden overflow-y-auto"
    :class="ifLarger ? 'flex items-center justify-center flex-col' : ''"
  >
    <div
      v-if="ifLarger"
      class="navigatorBack cursor-pointer flex flex-col items-center justify-center"
      @click="randomList = randomListFun()"
    >
      <div class="title-wrap">
        <div class="title">
          欣赏音乐不是用耳听，而是用心听，应该是一个人独自欣赏，似乎才能感受到人生的那种复杂的韵味。体味是个人的东西，当你被打中时，音乐只属于你自己。在如泣、如诉、娓婉、如醉的音乐中，你读着自己的故事，抒发着你的情怀，被音乐感染着、牵动着。
        </div>
      </div>
      <div class="line" />
    </div>
    <kinesis-container
      :style="{
        width: ifLarger ? '1000px' : '100%',
        ...(ifLarger ? { height: '550px' } : {}),
        borderRadius: ifLarger ? '20px' : 'none'
      }"
      class="music-wrap overflow-hidden relative flex items-center"
      :class="ifLarger ? ' justify-around' : 'flex-col justify-center'"
    >
      <!-- 背景图 -->
      <div
        :style="{ borderRadius: ifLarger ? '20px' : 'none' }"
        class="music-wrap-bg w-[100%] h-[100%] absolute overflow-hidden"
      >
        <div
          class="music-wrap-bg-content absolute"
          :style="{ transform: `translate(-50%, -50%) rotate(${rotateDeg}deg)` }"
        />
      </div>
      <!-- 随机的气泡 -->
      <kinesis-element
        v-for="(item, indexKey) in randomList"
        :key="indexKey"
        class="wave5-wrap absolute"
        :style="item.styleFather"
        :strength="75"
        type="translate"
      >
        <kinesis-element
          class="wave5-wrap w-[100%] h-[100%]"
          :style="item.styleChild"
          :transform-origin="item.transformOrigin"
          :max-scale="1.25"
          :min-scale="0.5"
          :strength="item.strength"
          :type="item.type"
        />
      </kinesis-element>

      <!-- 专辑律动效果 -->
      <kinesis-container
        class="relative cursor-pointer music-content"
        :audio="list[0].url"
        :play-audio="playAudio"
      >
        <!-- 左上波动1--大 -->
        <kinesis-element class="wave1-wrap absolute" :strength="25" type="depth">
          <kinesis-audio
            :max-scale="1.5"
            :min-scale="0.5"
            class="w-[100%] h-[100%] wave1"
            :audio-index="5"
            :strength="90"
            type="scale"
          />
        </kinesis-element>

        <!-- 左上波动2--小 -->
        <kinesis-element class="wave2-wrap absolute" :strength="25" type="depth">
          <kinesis-audio
            :max-scale="1.1"
            :min-scale="0.5"
            class="w-[100%] h-[100%] wave2"
            :audio-index="15"
            :strength="60"
            type="scale"
          />
        </kinesis-element>

        <!-- 封面 -->
        <kinesis-element class="music-content-cover absolute" :strength="25" type="depth">
          <kinesis-audio
            :max-scale="1.5"
            :min-scale="0.5"
            :audio-index="10"
            :strength="95"
            type="scale"
          >
            <div class="img relative overflow-hidden">
              <div
                class="absolute"
                style="transition: transform 1s ease"
                :style="{
                  transform: `translateY(${-index * 250}px)`
                }"
              >
                <img
                  v-for="(item, keyIndex) in list"
                  :key="keyIndex"
                  class="img"
                  :src="item.image"
                  alt=""
                />
              </div>
            </div>
          </kinesis-audio>
        </kinesis-element>

        <!-- 右下波动3--蓝色 -->
        <kinesis-element class="wave3-wrap absolute" :strength="25" type="depth">
          <kinesis-audio
            transform-origin="100% 100%"
            class="w-[100%] h-[100%] wave3"
            :audio-index="15"
            :strength="65"
            type="scale"
            @up-context="upContext"
          />
        </kinesis-element>
      </kinesis-container>

      <!-- 右上波动2--灰色 -->
      <kinesis-element class="wave4-wrap absolute" :strength="1.25" type="scale" />

      <!-- 音乐信息与控制按钮 -->
      <div class="music-info-wrap" :style="ifLarger ? { width: '400px' } : {}">
        <!-- 歌曲详情 -->
        <transition v-for="(item, keyIndex) in list" :key="keyIndex" class="music-info" name="fade">
          <div v-if="keyIndex === index">
            <div class="music-info-name">
              {{ item.name }}
            </div>
            <div class="music-info-author">- {{ item.author }}</div>
          </div>
        </transition>
        <!-- 波形进度条与控制按钮 -->
        <div
          class="flex items-center relative flex justify-between"
          :class="ifLarger ? '' : 'flex-col'"
        >
          <!-- 是否加载生成波形图中 -->
          <div
            v-show="!ifInitWavesurfer"
            class="absolute w-[100%] h-[100%] flex items-center justify-center"
          >
            <div class="spinner">
              <div class="bounce1" />
              <div class="bounce2" />
              <div class="bounce3" />
            </div>
          </div>
          <!-- 控制按钮 -->
          <div
            class="flex items-center justify-center"
            :style="
              ifLarger
                ? { visibility: ifInitWavesurfer ? 'visible' : 'hidden' }
                : { marginBottom: '25px', visibility: ifInitWavesurfer ? 'visible' : 'hidden' }
            "
          >
            <div
              v-if="!ifLarger"
              :style="{ marginRight: '30px' }"
              class="relative cursor-pointer next-music"
              @click="nextMusic"
            >
              <svg class="svg-circle" viewBox="0 0 100 100">
                <path id="circle" d="M 0,50 a 50,50 0 1,1 0,1 z" />
                <text>
                  <textPath xlink:href="#circle">Listen-to-the-next-song</textPath>
                </text>
              </svg>
              <svg
                class="next-icon absolute align-center"
                style="
                  width: 1em;
                  height: 1em;
                  vertical-align: middle;
                  fill: currentColor;
                  overflow: hidden;
                "
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1404"
              >
                <path
                  d="M925.416149 3.180124h-190.807453a31.801242 31.801242 0 0 0-31.801243 31.801242v387.021118L121.798758 10.176398 110.668323 2.544099A31.801242 31.801242 0 0 0 98.583851 0a31.801242 31.801242 0 0 0-31.801242 31.801242v960.397516a31.801242 31.801242 0 0 0 31.801242 31.801242 31.801242 31.801242 0 0 0 12.084472-2.544099l11.130435-7.632299L702.807453 601.997516V989.018634a31.801242 31.801242 0 0 0 31.801243 31.801242h190.807453a31.801242 31.801242 0 0 0 31.801242-31.801242v-954.037268a31.801242 31.801242 0 0 0-31.801242-31.801242z"
                  p-id="1405"
                />
              </svg>
            </div>
            <div
              class="music-button cursor-pointer flex items-center justify-center"
              @click="playAudio = !playAudio"
            >
              <!-- 播放 -->
              <img
                class="music-button-img"
                :src="!playAudio ? playImageUrl : pauseImageUrl"
                alt=""
              />
              <!-- 暂停 -->
            </div>
          </div>
          <!-- 波形进度条 -->
          <div
            id="waveform"
            style="width: 300px"
            :style="{ visibility: ifInitWavesurfer ? 'visible' : 'hidden' }"
          />
        </div>
      </div>

      <!-- 下一首 -->
      <div
        v-if="ifLarger"
        :style="{
          top: 0,
          transform: 'translate(-50%, 50%)'
        }"
        class="next-music absolute cursor-pointer"
        @click="nextMusic"
      >
        <svg class="svg-circle" viewBox="0 0 100 100">
          <path id="circle" d="M 0,50 a 50,50 0 1,1 0,1 z" />
          <text>
            <textPath xlink:href="#circle">Listen-to-the-next-song</textPath>
          </text>
        </svg>
        <svg
          class="next-icon absolute align-center"
          style="
            width: 1em;
            height: 1em;
            vertical-align: middle;
            fill: currentColor;
            overflow: hidden;
          "
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1404"
        >
          <path
            d="M925.416149 3.180124h-190.807453a31.801242 31.801242 0 0 0-31.801243 31.801242v387.021118L121.798758 10.176398 110.668323 2.544099A31.801242 31.801242 0 0 0 98.583851 0a31.801242 31.801242 0 0 0-31.801242 31.801242v960.397516a31.801242 31.801242 0 0 0 31.801242 31.801242 31.801242 31.801242 0 0 0 12.084472-2.544099l11.130435-7.632299L702.807453 601.997516V989.018634a31.801242 31.801242 0 0 0 31.801243 31.801242h190.807453a31.801242 31.801242 0 0 0 31.801242-31.801242v-954.037268a31.801242 31.801242 0 0 0-31.801242-31.801242z"
            p-id="1405"
          />
        </svg>
      </div>
    </kinesis-container>
  </div>
</template>

<script>
import { KinesisContainer, KinesisElement, KinesisAudio } from '@/static/vue-kinesis/vue-kinesis'
import WaveSurfer from 'wavesurfer.js'
import { useStore } from 'vuex'
import { ref, onMounted, watch, onUnmounted, computed, toRefs } from 'vue'

import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'
import { randomXtoY } from '@/common/util/methods'

export default {
  name: 'view-demo-music',
  components: {
    KinesisContainer,
    KinesisAudio,
    KinesisElement
  },
  props: {
    ...leftSidebarProps
  },
  setup(props) {
    const store = useStore()
    const { ifLarger } = toRefs(props)
    let wavesurfer
    const list = computed(() => store.state.musicList) // 歌曲列表
    const randomListFun = () => {
      const listArr = []
      for (let i = 0; i < 9; i++) {
        const radius = Math.round(Math.random() * (200 - 50) + 50)
        const flag = parseInt(Math.random() * 11) % 2 > 0
        const transformOrigin = `${parseInt(Math.random() + 1)} ${parseInt(Math.random() + 1)}`
        let left
        let top
        if (ifLarger.value) {
          left = randomXtoY(1000 - radius / 2, -radius)
          top = randomXtoY(550 - radius / 2, -radius)
        } else {
          left = randomXtoY($(window).width() - radius, -radius)
          top = randomXtoY($(window).height() - radius, -radius)
        }

        listArr.push({
          radius,
          transformOrigin,
          styleFather: {
            left: `${left}px`,
            top: `${top}px`
          },
          styleChild: {
            width: `${radius}px`,
            height: `${radius}px`,
            opacity: randomXtoY(2, 1) / 10,
            backgroundColor: `#${('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)}`
          },
          strength: flag ? randomXtoY(32, 30) : randomXtoY(7, 5),
          type: flag ? 'depth' : 'scale'
        })
      }
      return listArr
    }
    const randomList = ref(randomListFun()) // 获取随机的气泡
    const index = ref(0)
    const rotateDeg = ref(0)
    const ifInitWavesurfer = ref(false) // 是否初始化绘图完成

    const playAudio = ref(false) // 是否开始播放

    watch(playAudio, (newV) =>
      newV ? wavesurfer.play($('audio')[0].currentTime) : wavesurfer.pause()
    )

    // 初始化wavesurfer
    const initWavesurfer = () => {
      destroyWavesurfer()
      wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#edd88c',
        cursorColor: '#edd88c',
        progressColor: '#D8F235',
        barWidth: 4,
        barHeight: 0.7,
        barMinHeight: 0,
        cursorWidth: 3,
        barGap: 3,
        barRadius: 3
      })
      wavesurfer.setMute(true)
      wavesurfer.load(list.value[index.value].url)
      wavesurfer.on('seek', (percentage) => {
        if (ifInitWavesurfer.value) {
          $('audio')[0].currentTime = $('audio')[0].duration * percentage
        }
      })
      wavesurfer.on('finish', () => {
        console.log('finish')
        playAudio.value = false
        $('audio')[0].pause()
        $('audio')[0].currentTime = 0
      })
      wavesurfer.on('ready', () => {
        console.log('ready')
        ifInitWavesurfer.value = true
      })
    }

    // 销毁wavesurfer
    const destroyWavesurfer = () => {
      if (wavesurfer) {
        wavesurfer.unAll()
        wavesurfer.cancelAjax()
        wavesurfer.empty()
        wavesurfer.destroy()
      }
    }

    onMounted(() => {
      initWavesurfer()
    })
    onUnmounted(() => {
      destroyWavesurfer()
    })

    const upContext = (context) => {
      wavesurfer.play($('audio')[0].currentTime)
      rotateDeg.value = rotateDeg.value + 0.05
      if (rotateDeg.value > 360) {
        rotateDeg.value = 0
      }
    }

    const nextMusic = () => {
      playAudio.value = false
      ifInitWavesurfer.value = false
      $('audio')[0].pause()
      if (index.value < list.value.length - 1) {
        index.value++
      } else {
        index.value = 0
      }
      $('audio')[0].src = list.value[index.value].url
      wavesurfer.load(list.value[index.value].url)
      randomList.value = randomListFun()
    }

    return {
      playImageUrl: new URL('@/assets/music/play.svg', import.meta.url).href,
      pauseImageUrl: new URL('@/assets/music/pause.svg', import.meta.url).href,
      list,
      index,
      randomList,
      playAudio,
      rotateDeg,
      ifInitWavesurfer,
      randomListFun,
      upContext,
      nextMusic
    }
  }
}
</script>

<style scoped lang="scss">
.music-wrap {
  max-width: 100vw;

  .music-wrap-bg {
    background-color: rgb(44, 82, 94);
    z-index: -1;

    .music-wrap-bg-content {
      width: 1000vw;
      height: 1000vw;
      left: 50%;
      top: 50%;
      background-image: url('@/assets/music/rrrainbow.svg');
      background-size: 500px 500px;
      background-repeat: repeat;
    }
  }
}

.music-content {
  width: 350px;
  height: 550px;

  .music-content-cover {
    left: 48px;
    top: 160px;

    .img {
      width: 250px;
      height: 250px;
      border-radius: 15px;
    }
  }
}

.next-music {
  width: 70px;
  height: 70px;
  font-size: 12px;
  border-radius: 50%;

  .svg-circle {
    overflow: visible;
    border-radius: 50%;
    animation: circular-text-rotate 5s linear paused infinite;
  }

  .svg-circle {
    overflow: visible;
    animation: circular-text-rotate 5s linear paused infinite;
  }

  .svg-circle:hover {
    animation-play-state: running;
  }

  .svg-circle path {
    fill: none;
  }

  .svg-circle text {
    fill: #46ffe2;
    font-size: 26px;
  }

  .next-icon {
    z-index: -1;
    font-size: 25px;
    color: #ff69a9;
  }
}

.wave1-wrap {
  width: 170px;
  height: 170px;
  left: 20px;
  top: 55px;

  .wave1 {
    border-radius: 50%;
    background-image: linear-gradient(120deg, #19ad9b 30%, #2a980d 100%);
  }
}

.wave2-wrap {
  width: 90px;
  height: 90px;
  left: 15px;
  top: 45px;

  .wave2 {
    border-radius: 50%;
    background-image: linear-gradient(45deg, #fbff00 0%, #f6fa43 99%, #f8fab5 100%);
  }
}

.wave3-wrap {
  width: 90px;
  height: 90px;
  left: 270px;
  top: 440px;

  .wave3 {
    border: 6px solid #00bfbf;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}

.wave4-wrap {
  width: 220px;
  height: 220px;
  right: -30px;
  top: -30px;
  background-color: #fff;
  opacity: 0.1;
  border-radius: 50%;
}

.wave5-wrap {
  border-radius: 50%;
}

.navigatorBack {
  width: 1000px;

  .title-wrap {
    background-color: #2c525e;
    border-radius: 10px;

    .title {
      text-indent: 2em;
      padding: 20px;
      letter-spacing: 0.07em;
      font-size: 15px;
      font-weight: bold;
      background-image: linear-gradient(to right, #fff, #4d9dff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }

  .line {
    background-color: #2c525e;
    width: 8px;
    height: 40px;
  }
}

.music-info-wrap {
  .music-info {
    margin-bottom: 20px;

    .music-info-name {
      font-weight: bold;
      font-size: 40px;
      background-image: linear-gradient(to right, #77e8b8, #4693d5);
      -webkit-background-clip: text;
      color: transparent;
    }

    .music-info-author {
      font-size: 17px;
      background-image: linear-gradient(to right, #b570cb, #e22fda);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
}

.music-button {
  width: 60px;
  height: 60px;
  background-color: #edd88c;
  font-size: 25px;
  line-height: 1;
  border-radius: 50%;

  .music-button-img {
    width: 70%;
    height: 20px;
  }
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-active {
  transition: all 1s ease;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-from {
  display: none;
}

.fade-leave-to {
  display: none;
}

.fade-leave-active {
  display: none;
}

.spinner {
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #f8f1ff;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@keyframes circular-text-rotate {
  to {
    transform: rotate(1turn);
  }
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
