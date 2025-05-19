<template>
  <div id="page" class="h-[100vh] overflow-hidden relative">
    <layout-header
      v-if="ifShowHeaderComponent"
      :if-larger="ifLarger"
      :header-h="headerH"
      :show-nav-link="showNavLink"
      :if-show-header-popup-btn="ifShowHeaderPopupBtn"
      @toggleMenu="toggleMenu"
      @toggleShowNavLink="toggleShowNavLink"
      @refreshView="refreshView"
    />
    <div class="relative bg-style" :class="ifShowHeaderComponent ? 'content' : ''">
      <left-nav-link
        v-if="ifShowHeaderComponent"
        :show-nav-link="showNavLink"
        :left-sidebar-w="leftSidebarW"
        :if-larger="ifLarger"
        @toggleShowNavLink="toggleShowNavLink"
        @refreshView="refreshView"
      />
      <router-view v-slot="{ Component }">
        <transition>
          <component
            :is="Component"
            :key="refreshViewKey"
            :if-larger="ifLarger"
            :header-h="headerH"
            :if-show-menu="ifShowMenu"
            :toggle-menu="toggleMenu"
            :left-sidebar-w="leftSidebarW"
          />
        </transition>
      </router-view>
    </div>
  </div>
  <PWABadge />
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useRoute } from 'vue-router'
import PWABadge from '@/components/update-tips/index.vue'

import guid from '@/common/util/guid.js'

import leftNavLink from '@/components/left-nav-link/index.vue'
import layoutHeader from '@/components/layout-header/index.vue'
const ifShowMenu = ref(false) // 是否展示公用头部组件展开左侧抽屉（移动端）的控制按钮
const showNavLink = ref(false) // 移动端的公用头部组件展开后的左侧【导航抽屉】显影
const headerH = ref('70px') // 公用头部组件高度
const ifShowHeaderPopupBtn = ref(false) // 移动端的公用头部组件展开后的左侧【文章抽屉】显影
const ifShowHeaderComponent = ref(false) // 是否展示公用头部组件
const ifLarger = useBreakpoints(breakpointsTailwind).greater('sm') // 视口断点 是否大屏
const leftSidebarW = computed(() => (ifLarger.value ? '330px' : '100vw'))
const refreshViewKey = ref(guid()) // 刷新视图的唯一标识
const route = useRoute()

// 切换菜单状态
const toggleMenu = (state) => {
  ifShowMenu.value = state !== undefined ? state : !ifShowMenu.value
  showNavLink.value = false
}

// 切换导航状态
const toggleShowNavLink = (state) => {
  showNavLink.value = state !== undefined ? state : !showNavLink.value
  ifShowMenu.value = false
}

// 刷新视图
const refreshView = () => {
  refreshViewKey.value = guid()
}

watch(
  () => route.path,
  () => {
    const { ifShowHeaderComponent: flag } = route.meta
    ifShowHeaderComponent.value = flag !== undefined ? flag : true
    ifShowHeaderPopupBtn.value = ['/', '/search'].includes(route.path)
  },
  { immediate: true }
)
</script>
<style lang="scss">
::view-transition-new(root),
::view-transition-old(root) {
  /* 关闭默认动画 */
  animation: none;
}
body,
* {
  &::-webkit-scrollbar {
    /* 滚动条整体部分 */
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track-piece {
    /* 内层轨道，滚动条中间部分（除去） */
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    /* 滚动条里面可以拖动的那个 */
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-corner {
    /* 边角 */
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-corner {
    /* 边角 */
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb {
    /* 滚动条里面可以拖动的那个 */
    background: #979797;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-track {
    /* 内层轨道，滚动条中间部分（除去） */
    background: rgba(0, 0, 0, 0.05);
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-button {
    /* 滚动条两端的按钮 */
    display: none;
  }
}
</style>
<style scoped lang="scss">
#page {
  .content {
    height: calc(100vh - v-bind(headerH));
    margin-top: v-bind(headerH);
  }
}
</style>
