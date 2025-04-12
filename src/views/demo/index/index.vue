<template>
  <div class="w-[100%] h-[100%] bg-style overflow-auto">
    <template v-if="ifLarger">
      <div class="demo-view flex flex-wrap">
        <div
          class="lh-none demo-view-item"
          style="width: 33.33%"
          v-for="(item, index) in demoList"
          :key="index"
        >
          <a class="cursor-pointer" :href="`/#${item.path}`" target="_blank">{{
            `${index + 1}、 ` + item.name
          }}</a>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="demo-view">
        <div class="lh-none demo-view-item" v-for="(item, index) in demoList" :key="index">
          <a class="cursor-pointer" :href="`/#${item.path}`" target="_blank">{{
            `${index + 1}、 ` + item.name
          }}</a>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { demoMenuList } from '@/router/create-demo-list'
import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'

defineOptions({ name: 'view-demo-index' })
defineProps(leftSidebarProps)

const demoList = demoMenuList()
</script>
<style lang="scss" scoped>
.demo-view {
  padding: 20px 10px;
  margin-bottom: 150px;
  .demo-view-item {
    font-size: 16px;
    padding: 10px 0;
    color: var(--global-primary-color);
    a {
      color: var(--global-primary-color);
    }
  }
}
</style>
