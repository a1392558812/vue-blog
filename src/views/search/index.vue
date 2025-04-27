<template>
  <div
    style="color: var(--global-text-color)"
    class="bg-style relative w-[100%] h-[100%] flex flex-row"
    v-loading="!menuList.length"
  >
    <layout-left-sidebar
      :left-sidebar-w="leftSidebarW"
      :if-show-menu="ifShowMenu"
      :if-larger="ifLarger"
      :header-h="headerH"
      :toggle-menu="toggleMenu"
      @itemClick="itemClick"
    />
    <div class="w-[100%] h-[100%] flex flex-col" v-if="menuList.length">
      <div
        class="px-[0] py-[20px] text-[25px] [border-bottom:1px_solid_var(--global-border-color)] w-[100%] flex items-center justify-center"
      >
        <div class="flex items-baseline">
          <p style="margin-right: 10px">搜索结果</p>
          <p class="text-[13px] text-[#999999]">(共计{{ searchResult.length }}条)</p>
        </div>
      </div>
      <ul class="overflow-y-scroll pl-[10px] pr-[10px] py-[30px] flex-1">
        <li
          v-for="(item, index) in searchResult"
          :key="index"
          class="text-[16px] px-[20px] py-[10px]"
        >
          <a
            class="text-[var(--global-text-color)] hover:text-[var(--global-primary-color)] hover:underline cursor-pointer"
            :href="`/#/?indexPage=${item.indexPage}`"
            @click="
              function (e) {
                gotoDetails(item, e)
              }
            "
          >
            <linkTag class="inline" v-if="item.link" />
            {{ item.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup="props">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import layoutLeftSidebar from '@/components/left-sidebar/index.vue'
import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'
import linkTag from '@/components/left-sidebar/components/link-tag.vue'

import { SET_MENUS_INIT } from '@/store/actionType'

defineOptions({ name: 'view-search' })

defineProps(leftSidebarProps)

const store = useStore()
const route = useRoute()
const router = useRouter()

const menuList = computed(() => store.state.menuData.menuList)
const searchResult = ref([])
let inputValue = decodeURI(route.query.key)

const gotoDetails = (item, e) => {
  e.preventDefault()
  if (item.noResult) return
  if (item.link) return window.open(item.link)
  router.push({
    path: '/',
    query: { indexPage: item.indexPage }
  })
}

const init = () => {
  inputValue = decodeURI(route.query.key)
  if (inputValue === '') {
    searchResult.value = [{ name: '请输入关键字', noResult: true }]
    return
  }
  const searchArr = []
  const filter = (list) => {
    list.forEach((item) => {
      if (!item.children) {
        if (item.name.trim().toLowerCase().indexOf(inputValue.trim().toLowerCase()) !== -1) {
          searchArr.push(item)
        }
      } else {
        filter(item.children)
      }
    })
  }
  filter(menuList.value)
  searchResult.value = searchArr.length ? searchArr : [{ name: '暂无搜索结果', noResult: true }]
}

const itemClick = (row) => {
  router.push({
    path: '/',
    query: { indexPage: row.indexPage }
  })
}

watch(
  route,
  () => {
    store.dispatch(SET_MENUS_INIT).then(() => {
      init()
    })
  },
  { immediate: true }
)
</script>

<style scoped lang="scss"></style>
