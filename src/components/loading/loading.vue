<template>
  <div v-if="ifShow" class="loading">
    <div class="loadEffect">
      <span v-for="(item, index) in list" :key="index" :class="`loading-item loading-${index}`">
        {{ item }}
      </span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'components-loading',
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const ifShow = ref(props.showModal)
    return {
      list: ['🐮', '🐴', '🐮', '🐴', '🐮', '🐴', '🐮', '🐴'],
      ifShow,
      setShowModal: (value) => {
        ifShow.value = value
        console.log('setShowModal', value, ifShow.value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
$scale: 1; /* 指定缩放倍数 */
.loading {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(189, 194, 194, 0.1);
  color: var(--global-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loadEffect {
  width: calc(110px / $scale);
  height: calc(110px / $scale);
  position: relative;
  margin: 0 auto;
}
.loadEffect span {
  display: inline-block;
  position: absolute;
  animation: load 1.04s ease infinite;
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: calc(-10px / $scale);
  animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: calc(14px / $scale);
  top: calc(14px / $scale);
  animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: calc(-10px / $scale);
  animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: calc(14px / $scale);
  right: calc(14px / $scale);
  animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: calc(-10px / $scale);
  animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: calc(14px / $scale);
  bottom: calc(14px / $scale);
  animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: calc(-10px / $scale);
  animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: calc(14px / $scale);
  left: calc(14px / $scale);
  animation-delay: 1.04s;
}
@keyframes load {
  0% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(0.3);
    opacity: 0.5;
  }
}
</style>
