<script lang="jsx">
import { ref } from 'vue'
export default {
  name: 'components-router-switch-loading',
  setup(props, { expose }) {
    // 默认加载中文字
    const defaultLoadingText = '路由切换加载中...'
    // 默认加载图标render方法
    const loadingDefaultIconSlot = () => {
      return (
        <div class="flex align-items-center justify-content-center spinner-wrap">
          <div class="sk-folding-cube">
            <div class="sk-cube1 sk-cube">🐮</div>
            <div class="sk-cube2 sk-cube">🐮</div>
            <div class="sk-cube4 sk-cube">🐴</div>
            <div class="sk-cube3 sk-cube">🐴</div>
          </div>
        </div>
      )
    }

    const loadingTextDefaultStyle = () => ({})
    const loadingMaskStyle = () => ({})
    const loadingIconSlot = ref(loadingDefaultIconSlot)
    const loading = ref(false)

    const loadingText = ref(defaultLoadingText)
    const loadingStyle = ref(loadingTextDefaultStyle())
    const maskStyle = ref(loadingMaskStyle())

    const startLoading = ({
      text = '',
      loadingTextStyle = {},
      maskWrapStyle = {},
      loadingIconSlotFun
    }) => {
      loadingText.value = text || defaultLoadingText
      loadingStyle.value = Object.assign(loadingTextDefaultStyle(), loadingTextStyle)
      maskStyle.value = Object.assign(loadingMaskStyle(), maskWrapStyle)
      loadingIconSlot.value = loadingIconSlotFun || loadingDefaultIconSlot
      loading.value = true
    }
    const endLoading = () => {
      loading.value = false
    }

    expose({ startLoading, endLoading })
    return {
      loading,
      loadingText,
      loadingStyle,
      maskStyle,
      startLoading,
      endLoading,
      loadingIconSlot
    }
  },
  render() {
    return (
      <div>
        {this.loading ? (
          <div
            style={this.maskStyle}
            class="fixed flex align-items-center justify-content-center router-switch-loading"
          >
            <div>
              <div style={this.loadingStyle}>{this.loadingText}</div>
              {this.loadingIconSlot()}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
</script>
<style scoped lang="scss">
.router-switch-loading {
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  font-size: 50px;
  z-index: 20;
  color: var(--global-text-color);
  background-color: rgba(0, 0, 0, 0.3);
}
.spinner-wrap {
  margin-top: 20px;
  font-size: 20px;
  .sk-folding-cube {
    margin: 20px auto;
    width: 60px;
    height: 60px;
    position: relative;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  .sk-folding-cube .sk-cube {
    float: left;
    width: 50%;
    height: 50%;
    position: relative;
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }
  .sk-folding-cube .sk-cube:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #333;
    -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
    animation: sk-foldCubeAngle 2.4s infinite linear both;
    -webkit-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  }
  .sk-folding-cube .sk-cube2 {
    -webkit-transform: scale(1.1) rotateZ(90deg);
    transform: scale(1.1) rotateZ(90deg);
  }
  .sk-folding-cube .sk-cube3 {
    -webkit-transform: scale(1.1) rotateZ(180deg);
    transform: scale(1.1) rotateZ(180deg);
  }
  .sk-folding-cube .sk-cube4 {
    -webkit-transform: scale(1.1) rotateZ(270deg);
    transform: scale(1.1) rotateZ(270deg);
  }
  .sk-folding-cube .sk-cube2:before {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .sk-folding-cube .sk-cube3:before {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  .sk-folding-cube .sk-cube4:before {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
}

@-webkit-keyframes sk-foldCubeAngle {
  0%,
  10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

@keyframes sk-foldCubeAngle {
  0%,
  10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}
</style>
