<script lang="jsx">
import { ref, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'ImageType',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    htmlMD: {
      type: String,
      default: ''
    }
  },
  emits: ['imageLoad'],
  setup(props, { emit }) {
    let timer = null // 定时器
    const imageloadingTime = ref(1) // 图片加载了多长时间
    const showPopup = ref(false) // 是否显示大图
    const onKeyDown = (code) => {
      if (showPopup.value && code.keyCode === 27) showPopup.value = false
    }
    const timerFun = () => {
      timer = setInterval(() => {
        imageloadingTime.value++
      }, 1000)
    }

    watch(
      () => props.loading,
      (newV) => {
        showPopup.value = false
        imageloadingTime.value = 1
        clearInterval(timer)
        if (newV) timerFun()
      }
    )

    onMounted(() => {
      document.addEventListener('keydown', onKeyDown)
    })
    onUnmounted(() => {
      clearInterval(timer)
      document.removeEventListener('keydown', onKeyDown)
    })
    return {
      imageloadingTime,
      showPopup,
      imageLoad: () => {
        clearInterval(timer)
        imageloadingTime.value = 0
        emit('imageLoad', false)
      }
    }
  },
  render() {
    return (
      <>
        <div class="pl-[30px] pr-[30px] py-[30px] box-border w-[100%]">
          <div
            class="cursor-pointer hover:underline"
            onClick={() => {
              this.showPopup = true
            }}
          >
            预览 / 点击查看详情
          </div>
          <div class="mt-[20px] flex">
            <div
              style={this.loading ? { display: 'none' } : {}}
              class="max-w-[200px] cursor-pointer relative overflow-hidden p-[10px] rounded-[10px]"
              onClick={() => {
                this.showPopup = true
              }}
            >
              <img
                class="block w-full relative z-[3]"
                title={this.htmlMD}
                onLoad={this.imageLoad}
                onError={this.imageLoad}
                src={this.htmlMD}
                alt={this.htmlMD}
              />
            </div>
            <div style={this.loading ? {} : { display: 'none' }}>
              <div>github响应有点慢，莫急,已加载{this.imageloadingTime}秒</div>
              <div class="loading">φ(≧ω≦*)♪图片正在努力加载中</div>
            </div>
          </div>
        </div>
        {this.showPopup ? (
          /* 图片大屏展示 */
          <div
            className="fixed left-[0] top-[0] w-[100vw] h-[100vh] overflow-auto z-[100] bg-[rgba(0,_0,_0,_0.7)] flex items-center justify-center"
            onClick={() => {
              this.showPopup = false
            }}
          >
            <img class="max-w-[90%]" src={this.htmlMD} alt={this.htmlMD} />
          </div>
        ) : null}
      </>
    )
  }
}
</script>

<style scoped lang="scss">
.loading {
  &::after {
    content: '...';
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ellipsis-dot 1s infinite 0.3s;
    animation-fill-mode: fowards;
    width: 1.25em;
  }
}

@keyframes ellipsis-dot {
  25% {
    content: '';
  }

  50% {
    content: '.';
  }

  75% {
    content: '..';
  }

  100% {
    content: '...';
  }
}
</style>
