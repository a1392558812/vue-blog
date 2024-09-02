<template>
  <div>
    <div
      :class="currentActive === index ? 'quality-item-active' : ''"
      class="quality-item"
      @click="
        function (e) {
          qualityItemClick(index, e)
        }
      "
      v-for="(item, index) in list"
      :key="index"
    >
      {{ item.label }}
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'video-player-quality',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    },
    handleClick: {
      type: Function,
      default: (index) => {}
    }
  },
  setup(props) {
    const currentActive = ref(props.active)
    return {
      currentActive,
      qualityItemClick: (index, e) => {
        currentActive.value = index
        props.handleClick(index, e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.quality-item {
  padding: 5px 10px;
  &:hover {
    background: pink;
  }
}
.quality-item-active {
  background: pink;
}
</style>
