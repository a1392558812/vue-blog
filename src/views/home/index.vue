<template>
  <div
    class="content-inner bg-style text-[var(--global-primary-color)] text-[15px] overflow-hidden w-[100%] h-[100%] flex flex-row"
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
    <div
      :style="
        ifLarger
          ? {
              width: `calc(100% - ${leftSidebarW})`
            }
          : { width: '100%' }
      "
      class="relative h-[100%]"
    >
      <!-- 背景图 -->
      <div class="bg-image overflow-hidden w-[100%] h-[100%] absolute" />
      <div class="home overflow-auto relative w-[100%] h-[100%]">
        <template v-if="menuList.length">
          <!-- 标题 -->
          <div
            v-if="!markdownType"
            class="w-[100%] flex items-center justify-center box-border px-[30px] py-[0] min-h-[70px] text-20px font-600 text-[var(--global-text-color)] border-b-1px border-b-solid border-b-[var(--global-border-color)]"
          >
            {{ title }}
          </div>
          <!-- md格式 -->
          <markdown-type
            v-if="markdownType"
            :title="title"
            :markdown-title-width="markdownTitleWidth"
            :loading="loading"
            :if-larger="ifLarger"
            :header-h="headerH"
            :html-m-d="htmlMD"
          />
          <!-- 图片格式   -->
          <image-type
            v-else-if="imageType"
            :html-m-d="htmlMD"
            :loading="loading"
            @image-load="loading = false"
          />
          <!-- 链接格式,有 一些浏览器阻止页面打开新页面 -->
          <div v-else-if="linkType" class="p-[20px]">
            <a :href="htmlMD" class="text-[var(--global-text-color)]">链接： {{ htmlMD }}</a>
          </div>
          <!-- 其他格式 -->
          <other-type v-else :download-name="downloadName" :html-m-d="htmlMD" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import {
  SET_MENUS_INIT,
  SET_MENUS_INIT_RENDER,
  SET_NOW_ACTIVE,
  SET_MENUS_ACTIVE,
  SET_MENUS_CLOSE_ALL
} from '@/store/actionType'

import axios from '@/common/axios/index.js'
import {
  markdownTypeCheck,
  markdownTypeList,
  imgTypeCheck,
  cancelablePromise
} from '@/common/util/methods'

import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'
import layoutLeftSidebar from '@/components/left-sidebar/index.vue'
import otherType from './components/home/other-type.vue'
import imageType from './components/home/image-type.vue'
import markdownType from './components/home/markdown-type.vue'

export default {
  name: 'view-home',
  components: {
    layoutLeftSidebar,
    markdownType,
    otherType,
    imageType
  },
  props: {
    ...leftSidebarProps
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const htmlMD = ref('')
    const title = ref('ReadMe-前言')
    const fileSuffix = ref('')
    const downloadName = ref('文件')
    const loading = ref(true)

    let lastAxiosCancelFun = () => {}

    // markdown类型
    const markdownType = computed(() => markdownTypeCheck(fileSuffix.value))
    // img类型
    const imageType = computed(() => imgTypeCheck(fileSuffix.value))
    // 连接类型
    const linkType = computed(() => fileSuffix.value === 'link')

    // 菜单列表
    const menuList = computed(() => store.state.menuData.menuList)

    // 滚动到顶部
    const scrollTop = () => {
      nextTick().then(() => {
        document.querySelector('.home').scrollTop = 0
      })
    }

    // 项目点击不同类型回调
    const itemImageTypeClick = (urlLink) => {
      htmlMD.value = urlLink
      scrollTop()
    }
    const itemMarkdownTypeClick = (urlLink) => {
      console.log('itemMarkdownTypeClick', urlLink)
      const { promise, cancel } = cancelablePromise(axios.get(urlLink))
      lastAxiosCancelFun({ type: 'cancel' })
      lastAxiosCancelFun = cancel
      promise
        .then((response) => {
          loading.value = false
          htmlMD.value = markdownTypeList
            .find((item) => item.suffix === fileSuffix.value.toLocaleLowerCase())
            .formatFun(response.data)
          scrollTop()
        })
        .catch((err) => {
          if (err.type && err.type === 'cancel') return
          console.log('err', err)
          htmlMD.value = '网络寄了，我哭哭~~'
          fileSuffix.value = 'md'
          loading.value = false
        })
    }
    const itemOtherTypeClick = (url, urlLink) => {
      // 其他类型
      downloadName.value = url[url.length - 1]
      htmlMD.value = urlLink
      scrollTop()
    }
    const linkClick = (url) => {
      loading.value = false
      fileSuffix.value = 'link'
      title.value = '链接'
      htmlMD.value = url
      window.open(url)
    }

    // left-sadebar 项目点击
    const itemClick = (row) => {
      if (row.indexPage !== route.query.indexPage) {
        router.push({
          path: '/',
          query: { indexPage: row.indexPage }
        })
      }
    }

    // 携带路由参数
    const hasParamas = (indexPage) => {
      // 切割路由参数，路由参数格式 indexPage=1-1-1
      const pageIndexArr = indexPage.split('-')
      try {
        let result = { children: menuList.value }
        pageIndexArr.forEach((index) => {
          result = result.children[+index]
        })
        // 没有找到文章索引,跳转到首页即可
        if (!result) {
          return router.push('/')
        }
        // result结果中仍然有子选项
        if (Object.prototype.hasOwnProperty.call(result, 'children')) {
          throw new Error('不合法的路由参数')
        }

        store.dispatch(SET_MENUS_INIT_RENDER, { indexPage })
        store.dispatch(SET_NOW_ACTIVE, indexPage)
        store.dispatch(SET_MENUS_ACTIVE, { indexPage })

        if (result && result.link) {
          return linkClick(result.link)
        }
        // 正常的路由跳转
        const urlSplitArr = result.url[result.url.length - 1].split('.')
        fileSuffix.value = urlSplitArr[urlSplitArr.length - 1]
          ? urlSplitArr[urlSplitArr.length - 1]
          : ''
        const urlLink = `./${result.url.join('/')}`
        title.value = result.url.join(' > ')
        loading.value = true
        // 图片类型
        if (imageType.value) {
          return itemImageTypeClick(urlLink)
        }
        // markdown类型
        if (markdownType.value) {
          return itemMarkdownTypeClick(urlLink)
        }
        // 其他类型
        itemOtherTypeClick(result.url, urlLink)
      } catch (e) {
        if (import.meta.env.MODE === 'development') {
          console.error(`${import.meta.env.MODE}menuList解析: `, e)
        } else {
          router.push('/error')
        }
      }
    }
    // 不携带路由参数
    const hsaNotParams = () => {
      const urlLink = './README.md'
      fileSuffix.value = 'md'
      loading.value = true
      const { promise, cancel } = cancelablePromise(axios.get(urlLink))
      lastAxiosCancelFun({ type: 'cancel' })
      lastAxiosCancelFun = cancel
      promise
        .then((response) => {
          loading.value = false
          htmlMD.value = response.data
        })
        .catch((err) => {
          if (err.type && err.type === 'cancel') return
          loading.value = false
          htmlMD.value = '寄拉！'
        })
    }

    // 页面即将初始化
    watch(
      () => route.query,
      () => {
        console.log('watch ---> route.query', route.query)
        store.dispatch(SET_MENUS_INIT).then(() => {
          const indexPage = route.query.indexPage || ''
          props.toggleMenu(false)
          // 当前路由携带参数
          if (indexPage) {
            hasParamas(indexPage)
          } else {
            store.dispatch(SET_MENUS_CLOSE_ALL, { indexPage })
            hsaNotParams()
          }
        })
      },
      { immediate: true }
    )

    return {
      menuList,
      markdownType,
      markdownTitleWidth: ref('300px'), // 侧边导航标题栏宽度
      imageType,
      linkType,
      loading,
      htmlMD,
      title,
      fileSuffix,
      downloadName,
      itemClick
    }
  }
}
</script>
<style lang="scss" scoped>
.content-inner {
  .bg-image {
    background-attachment: fixed;
    background-image: url('@/assets/images/huge.jpg');
    background-size: calc(864px / 1.7) calc(836px / 1.7);
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 0.15;
    z-index: 0;
  }
}
</style>
