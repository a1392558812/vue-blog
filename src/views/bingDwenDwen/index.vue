<template>
  <div class="relative width100 height100 flex flex-direction-row">
    <layout-left-sidebar
      :left-sidebar-w="leftSidebarW"
      :if-show-menu="ifShowMenu"
      :if-larger="ifLarger"
      :header-h="headerH"
      :toggle-menu="toggleMenu"
    />
    <div class="width100 height100 overflow-y-auto">
      <div class="relative flex flex-direction-column align-items-center justify-content-center model-wrap">
        <model1 style="margin-bottom: 30px"></model1>
        <model2></model2>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import layoutLeftSidebar from '@/components/left-sidebar/left-sidebar'
import leftSidebarProps from '@/common/left-sidebar-props'
import model1 from './components/model1.vue'
import model2 from './components/model2.vue'
defineProps(leftSidebarProps)
</script>
<style scoped lang="scss">
.model-wrap{
  padding-top: 80px;
}
</style>
