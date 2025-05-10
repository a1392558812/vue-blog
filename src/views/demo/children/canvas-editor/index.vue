<template>
  <canvasEditor />
</template>
<script setup lang="jsx">
import { defineAsyncComponent } from 'vue'
import loadingComponent from '@/components/loading/loading.vue'

const canvasEditor = defineAsyncComponent({
  loader: () => import('./components/index.vue'),
  errorComponent: () => <div>加载错误</div>,
  loadingComponent: () => {
    return (
      <div class="flex w-[100vw] items-center justify-center text-[12px] font-900 h-[100vh]">
        <div class="w-[100%] h-[100%] relative">
          <loadingComponent style="background: transparent" showModal={true}>
            <div class="w-[100%] h-[100%] flex items-center justify-center">加载中...</div>
          </loadingComponent>
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss" scoped></style>
