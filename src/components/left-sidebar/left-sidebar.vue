<script lang="jsx">
import { ref, computed, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'

import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'
import leftSidebarItem from './left-sidebar-item.vue'
import leftSidebarSearch from './left-sidebar-search'

import {
  SET_MENUS_ACTIVE,
  SET_MENUS_INIT_RENDER,
  SET_MENUS_INIT
} from '@/store/actionType'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
BScroll.use(ObserveDOM)

export default {
  name: 'LeftSidebar',
  components: {
    leftSidebarItem,
    leftSidebarSearch
  },
  props: {
    ...leftSidebarProps
  },
  setup (props, { emit }) {
    const store = useStore()
    const menuList = computed(() => store.state.menuList)
    const router = useRouter()
    const route = useRoute()

    let bestScroll = null
    const listContentRef = ref(null)

    const nowActive = ref(null)

    const initScroll = () => {
      destroyScroll()
      console.log('initScroll')
      bestScroll = new BScroll(listContentRef.value, {
        click: true,
        observeDOM: true,
        bounce: false,
        scrollbar: {
          fade: false,
          interactive: true,
          scrollbarTrackClickable: true
        },
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      })
    }

    const destroyScroll = () => {
      console.log('destroyScroll')
      if (bestScroll) {
        bestScroll.destroy()
      }
      bestScroll = null
    }

    const leftSidebarItemClick = (e, childList, row, firstLevelIndex) => {
      if (route.query.indexPage !== row.indexPage) {
        nowActive.value = firstLevelIndex

        store.dispatch(SET_MENUS_ACTIVE, row)

        props.toggleMenu(false)
        router.push({
          path: '/',
          query: { indexPage: row.indexPage }
        })
        if (row.link) {
          return emit('linkClick', row.link)
        }
        emit('itemClick', row.url)
      }
    }

    const leftSidebarListClick = (e, row, firstLevelIndex) => {
      store.dispatch(SET_MENUS_INIT_RENDER, row)
      nowActive.value = firstLevelIndex
    }

    watch(
      () => props.ifLarger,
      (val) => {
        store.dispatch(SET_MENUS_INIT).then(() => {
          if (val && menuList.value.length) {
            nextTick().then(() => {
              initScroll()
            })
          } else {
            destroyScroll()
          }
        })
      },
      { immediate: true }
    )

    onBeforeUnmount(() => {
      destroyScroll()
    })

    return {
      menuList,
      nowActive,
      listContentRef,
      sidebarClassName: computed(() => {
        let classname = 'left-sidebar flex-shrink-0 bg-white height100'
        if (!props.ifLarger) {
          classname = `${classname} absolute ${props.ifShowMenu ? 'translateX-0' : 'translateX-100'}`
        } else {
          classname = `${classname}`
        }
        return classname
      }),
      leftSidebarItemClick,
      leftSidebarListClick
    }
  },
  render () {
    return (
        <div class={this.sidebarClassName}>
          {
            this.menuList.length
              ? (
                  <div class='flex height100 relative flex-direction-column left-sidebar-content'>
                    <leftSidebarSearch
                      class='search'
                      toggleMenu={this.toggleMenu}
                      onSearchLinkClick={(link) => { this.$emit('linkClick', link) }}
                      onSearchItemClick={(url) => { this.$emit('itemClick', url) }}
                      list={this.menuList}/>
                    <div key={this.ifLarger} class={`flex-1 flex-shrink-0 ${this.ifLarger ? 'overflow-y-hidden' : 'overflow-y-auto'} relative list-wrap`}>
                      <div ref={(node) => { this.listContentRef = node }} class={`list-content height100 ${this.ifLarger ? 'overflow-y-hidden' : ''}`}>
                        <div style={{ padding: '0 0 150px 0' }}>
                          {
                            this.menuList.map((item, index) => {
                              return <leftSidebarItem
                                rowDetails={item}
                                key={index}
                                grade={-1}
                                nowActive={this.nowActive}
                                menuList={this.menuList}
                                url={[item.name]}
                                firstLevelIndex={index}
                                onItemClick={(e, list, row, firstLevelIndex) => { this.leftSidebarItemClick(e, list, row, firstLevelIndex) }}
                                onListClick={(e, row, firstLevelIndex) => { this.leftSidebarListClick(e, row, firstLevelIndex) }}
                                />
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )
              : null
          }
        </div>
    )
  }
}
</script>

<style scoped lang="scss">
.left-sidebar{
  width: v-bind(leftSidebarW);
  font-size: 16px;
  transition: transform 0.3s;
  border-right: 1px solid var(--global-border-color);
  box-sizing: border-box;
  z-index: 10;
  .search{
    padding: 20px;
    border-bottom: 1px solid var(--global-border-color);
  }
  .left-sidebar-content{
    padding-bottom: 30px;
  }
  .list-wrap {
    padding: 0 20px;
  }
}
</style>
