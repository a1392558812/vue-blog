<template>
  <div v-if="ifShow" class="loading">
    <div class="loadEffect">
      <span
        v-for="(item, index) in list"
        :key="index"
        :class="`loading-item loading-${index}`"
      >
        {{ item }}
      </span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'Loading',
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const ifShow = ref(props.showModal)
    return {
      list: [
        '🐮', '🐴', '🐮', '🐴', '🐮', '🐴', '🐮', '🐴'
      ],
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
  .loading{
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
  .loadEffect{
    width: 110px / $scale;
    height: 110px / $scale;
    position: relative;
    margin: 0 auto;
  }
  .loadEffect span{
    display: inline-block;
    position: absolute;
    animation: load 1.04s ease infinite;
  }
  .loadEffect span:nth-child(1){
    left: 0;
    top: 50%;
    margin-top:-10px / $scale;
    animation-delay:0.13s;
  }
  .loadEffect span:nth-child(2){
    left: 14px / $scale;
    top: 14px / $scale;
    animation-delay:0.26s;
  }
  .loadEffect span:nth-child(3){
    left: 50%;
    top: 0;
    margin-left: -10px / $scale;
    animation-delay:0.39s;
  }
  .loadEffect span:nth-child(4){
    top: 14px / $scale;
    right:14px / $scale;
    animation-delay:0.52s;
  }
  .loadEffect span:nth-child(5){
    right: 0;
    top: 50%;
    margin-top: -10px / $scale;
    animation-delay:0.65s;
  }
  .loadEffect span:nth-child(6){
    right: 14px / $scale;
    bottom: 14px / $scale;
    animation-delay:0.78s;
  }
  .loadEffect span:nth-child(7){
    bottom: 0;
    left: 50%;
    margin-left: -10px / $scale;
    animation-delay:0.91s;
  }
  .loadEffect span:nth-child(8){
    bottom: 14px / $scale;
    left: 14px / $scale;
    animation-delay:1.04s;
  }
  @keyframes load{
    0%{
      transform: scale(1.5);
      opacity: 1;
    }
    100%{
      transform: scale(.3);
      opacity: 0.5;
    }
  }
</style>
