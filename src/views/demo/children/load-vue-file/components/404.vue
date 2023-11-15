<template>
    <div class="cursor-pointer custom-not-find" @click="handleClick">加载失败了，请刷新重新加载--【{{ count }}】--【{{ inputValue }}】</div>
</template>
<script>
import { ref } from 'vue'
export default {
  props: {
    inputValue: {
      type: String,
      default: ''
    }
  },
  setup () {
    const count = ref(0)
    return {
      count,
      handleClick: () => {
        count.value = count.value + 1
      }
    }
  }
}
</script>
<style scoped>
.custom-not-find{
    font-size: 16px;
}
</style>
