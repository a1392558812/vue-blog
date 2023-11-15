<template>
    <div class="cursor-pointer error-string" @click="handleClick">error-string: 字符串解析失败--【{{ count }}】</div>
</template>
<script>
import { ref } from 'vue'
export default {
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
.error-string{
  background: red;
}
</style>
