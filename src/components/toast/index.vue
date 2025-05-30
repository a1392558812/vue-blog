<template>
  <div class="absolute toast-wrap">
    <transition-group :duration="550" name="nested">
      <div class="toast overflow-hidden" v-for="item in toastArr" :key="item.id">
        <div class="flex items-center lh-none toast-content">
          <div style="margin-right: 20px">{{ item.content }}</div>
          <svg
            @click="closeToast(item.id, item.setTimeoutId)"
            v-if="item.showCloseBtn"
            class="icon cursor-pointer"
            style="
              width: 1.0205078125em;
              height: 1em;
              vertical-align: middle;
              fill: currentColor;
              overflow: hidden;
            "
            viewBox="0 0 1045 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1345"
          >
            <path
              d="M282.517333 213.376l-45.354666 45.162667L489.472 512 237.162667 765.461333l45.354666 45.162667L534.613333 557.354667l252.096 253.269333 45.354667-45.162667-252.288-253.44 252.288-253.482666-45.354667-45.162667L534.613333 466.624l-252.096-253.226667z"
              p-id="1346"
            ></path>
          </svg>
        </div>
        <div class="w-[100%] duration">
          <div
            v-if="item.showDurationLine"
            :style="{
              backgroundColor: item.durationBgColor,
              animationDuration: `${item.hiddenTime}ms`
            }"
            class="duration-line"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import guid from '@/common/util/guid.js'
import { ref } from 'vue'
export default {
  name: 'components-toast',
  setup(props) {
    const toastArr = ref([])
    const setTimeoutArr = []
    const removeToast = (id, setTimeoutId) => {
      const index = toastArr.value.findIndex((item) => item.id === id)
      const setTimeoutIndex = setTimeoutArr.findIndex((index) => index === setTimeoutId)
      index !== -1 && toastArr.value.splice(index, 1)
      setTimeoutIndex !== -1 && setTimeoutArr.splice(setTimeoutIndex, 1)
      clearTimeout(setTimeoutId)
    }
    const addToast = ({
      duration = 3000,
      durationBgColor = 'var(--global-primary-color)',
      showCloseBtn = true,
      showDurationLine = true,
      content
    }) => {
      const id = guid()
      const pushData = {
        id,
        hiddenTime: duration,
        durationBgColor,
        showCloseBtn,
        showDurationLine,
        content
      }
      const setTimeoutId = setTimeout(() => {
        removeToast(id, setTimeoutId)
      }, duration)
      pushData.setTimeoutId = setTimeoutId
      toastArr.value.push(pushData)
      setTimeoutArr.push(setTimeoutId)
    }
    const closeToast = (id, setTimeoutId) => {
      removeToast(id, setTimeoutId)
    }
    return {
      toastArr,
      addToast,
      closeToast
    }
  }
}
</script>
<style scoped lang="scss">
.toast-wrap {
  right: 20px;
  top: 20px;
  z-index: 999;
  color: var(--global-text-color);
  .toast {
    margin-top: 15px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    .duration-line {
      height: 2px;
      animation-name: widthNone;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }
    .toast-content {
      font-size: 14px;
      padding: 15px 20px;
    }
  }
}
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}
.nested-enter-active .inner {
  transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0.001;
}
@keyframes widthNone {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}
</style>
