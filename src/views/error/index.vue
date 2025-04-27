<template>
  <div class="bg-style h-[100%] w-full flex flex-col items-center">
    <div class="text-[17px] text-[var(--global-text-color)] px-[0] py-[15px]">
      你又进行了什么操作才进了这个页面
    </div>
    <router-link replace to="/">
      <img class="border-[1px] border-solid border-[#000]" :src="imgSrc" alt="" />
    </router-link>
    <router-link
      class="text-[17px] px-[0] py-[15px] text-[var(--global-text-color)] hover:text-[var(--global-primary-color)] hover:underline cursor-pointer"
      replace
      to="/"
    >
      返回首页
    </router-link>
  </div>
</template>
<script setup>
import { ref } from 'vue'

defineOptions({ name: 'view-error' })

const imgSrc = ref(new URL('@/assets/images/heishou.png', import.meta.url).href)
</script>
<style lang="scss" scoped></style>
