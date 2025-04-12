<template>
  <div class="flex flex-wrap" style="padding: 10px">
    <div class="shrink-0 filed">
      <div>输入css代码</div>
      <textarea class="w-[100%]" style="height: 300px; resize: none" v-model="cssCode" />
    </div>

    <div class="shrink-0 filed" style="width: 1200px">
      <div>输出css代码</div>
      <div class="w-[100%] overflow-auto" style="height: 300px">
        <div style="margin-bottom: 10px; padding: 10px">
          <div class="w-[100%]" style="word-wrap: break-word">{{ result[0] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import * as unocssTransform from 'transform-to-unocss-core'

const cssCode = ref(`
.content-body {
  width: 23rpx;
  height: 12rpx;
  
  font-family: Source Han Sans, Source Han Sans;
  font-weight: 500;
  font-size: 12rpx;
  color: #FFFFFF;
  line-height: 12rpx;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
`)

const result = computed(() => {
  try {
    const conversionResult = unocssTransform.toUnocssClass(cssCode.value)
    if (conversionResult) {
      return conversionResult
    } else {
      return ['代码输入格式有误']
    }
  } catch (e) {
    return ['代码输入格式有误']
  }
})
</script>
<style lang="scss" scoped>
.filed {
  width: 600px;
  border: 1px solid #000;
}
</style>
