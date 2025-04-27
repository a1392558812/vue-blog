<template>
  <div class="w-[100%] h-[100%] bg-style overflow-auto">
    <template v-if="ifLarger">
      <div class="py-[20px] px-[10px] mb-[150px] flex flex-wrap">
        <div
          class="lh-[1.5] text-[16px] py-[10px] text-[var(--global-primary-color)]"
          style="width: 33.33%"
          v-for="(item, index) in demoList"
          :key="index"
        >
          <a
            class="cursor-pointer text-[var(--global-primary-color)]"
            :href="`/#${item.path}`"
            target="_blank"
            >{{ `${index + 1}、 ` + item.name }}</a
          >
        </div>
      </div>
    </template>
    <template v-else>
      <div class="py-[20px] px-[10px] mb-[150px]">
        <div class="lh-[1.5] text-[16px] py-[10px]" v-for="(item, index) in demoList" :key="index">
          <a
            class="cursor-pointer text-[var(--global-primary-color)]"
            :href="`/#${item.path}`"
            target="_blank"
            >{{ `${index + 1}、 ` + item.name }}</a
          >
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
<style lang="scss" scoped></style>
