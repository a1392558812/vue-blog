<template>
  <div class="w-full h-full overflow-auto">
    <!-- 页面标题区域 -->
    <div class="pt-10 pb-6 px-8 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-[var(--global-primary-color)]">
        Vue.js 演示集合
      </h1>
      <p class="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
        探索丰富的Vue.js示例，涵盖各种交互效果、组件和功能实现
      </p>
    </div>

    <!-- 内容容器 -->
    <div class="max-w-6xl mx-auto px-4 pb-20">
      <template v-if="ifLarger">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            class="p-5 rounded-xl bg-[var(--global-background-color)] shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            v-for="(item, index) in demoList" :key="index">
            <a class="text-[14px] block w-full text-left cursor-pointer font-medium text-[var(--global-primary-color)] hover:text-teal-600 transition-colors duration-200"
              :href="`/#${item.path}`" target="_blank">
              <span class="text-lg font-semibold text-teal-700 mr-2">{{ index + 1 }}、</span>
              {{ item.name }}
            </a>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="bg-[var(--global-background-color)] rounded-xl shadow-md p-6">
          <div class="py-4 border-b border-gray-100 last:border-0" v-for="(item, index) in demoList" :key="index">
            <a class="text-[14px] cursor-pointer text-[var(--global-primary-color)] hover:text-teal-600 transition-colors duration-200 inline-block"
              :href="`/#${item.path}`" target="_blank">
              <span class="font-semibold text-teal-700 mr-2">{{ index + 1 }}、</span>
              {{ item.name }}
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { demoMenuList } from '@/router/create-demo-list'
import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'

defineOptions({ name: 'view-demo-index' })
defineProps(leftSidebarProps)

const demoList = demoMenuList()
</script>
<style lang="scss" scoped></style>
