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
        <div class="image w-[100%]">
          <div>预览 / 点击查看详情</div>
          <div class="image-wrap flex">
            <div
              style={this.loading ? { display: 'none' } : {}}
              className="image-content"
              onClick={() => {
                this.showPopup = true
              }}
            >
              <img
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
            className="popup flex items-center justify-center relative"
            onClick={() => {
              this.showPopup = false
            }}
          >
            <img src={this.htmlMD} alt={this.htmlMD} />
          </div>
        ) : null}
      </>
    )
  }
}
</script>

<style scoped lang="scss">
.image {
  padding: 30px 30px 100px 30px;
  box-sizing: border-box;
  .image-wrap {
    margin-top: 20px;
  }

  .image-content {
    max-width: 200px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 10px;
    border-radius: 10px;

    &::before {
      content: '';
      position: absolute;
      z-index: -2;
      left: -50%;
      top: -50%;
      width: 200%;
      height: 200%;
      background-color: var(--global-background-color);
      background-repeat: no-repeat;
      background-size: 50% 50%;
      background-position: 0 0;
      background-image: conic-gradient(#399953, #399953);
      animation: rotate 4s linear infinite;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      left: 6px;
      top: 6px;
      width: calc(100% - 12px);
      height: calc(100% - 12px);
      background: white;
      border-radius: 5px;
    }

    img {
      display: block;
      width: 100%;
      z-index: 2;
    }
  }

  &-btn {
    margin: 0 10px 10px 0;
  }

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
}

.popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);

  img {
    max-width: 90%;
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

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}
</style>
