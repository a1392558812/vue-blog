<script lang="jsx">
import { ref, computed, onBeforeUnmount, watch, nextTick } from 'vue'
import { useStore } from 'vuex'

import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'

import debounce from '@/common/util/debounce.js'
import leftSidebarProps from '@/common/props/left-sidebar-props/index.js'

import leftSidebarItem from './components/left-sidebar-item.vue'
import commonmBtn from '@/components/commonm-btn/index.vue'
import leftSidebarSearch from './components/left-sidebar-search.vue'

import {
  SET_MENUS_ACTIVE,
  SET_MENUS_INIT_RENDER,
  SET_MENUS_INIT,
  SET_MENUS_CLOSE_ALL,
  SET_NOW_ACTIVE
} from '@/store/actionType'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)
BScroll.use(ObserveDOM)

export default {
  name: 'components-left-sidebar',
  components: {
    leftSidebarItem,
    leftSidebarSearch,
    commonmBtn
  },
  props: {
    ...leftSidebarProps
  },
  setup(props, { emit }) {
    const store = useStore()
    // 初始化菜单
    const menuList = computed(() => store.state.menuData.menuList)

    // 左侧菜单的样式
    const sidebarClassName = computed(() => {
      let classname = 'left-sidebar shrink-0 bg-style h-[100%]'
      if (!props.ifLarger) {
        classname = `${classname} absolute ${props.ifShowMenu ? 'translate-x-[0]' : 'translate-x-[-100%]'}`
      } else {
        classname = `${classname}`
      }
      return classname
    })

    const bestScroll = ref(null)
    const listContentRef = ref(null)

    // 初始化滚动
    const initScroll = () => {
      console.log('initScroll')
      bestScroll.value = new BScroll(listContentRef.value, {
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

    // 销毁滚动
    const destroyScroll = () => {
      console.log('destroyScroll')
      if (bestScroll.value) {
        bestScroll.value.destroy()
      }
      bestScroll.value = null
    }

    // 左侧菜单的点击事件
    const leftSidebarItemClick = (e, childList, row) => {
      store.dispatch(SET_NOW_ACTIVE, row.indexPage)
      store.dispatch(SET_MENUS_ACTIVE, row)

      props.toggleMenu(false)
      emit('itemClick', row)
    }

    // 左侧菜单列表的点击事件
    const leftSidebarListClick = (e, row) => {
      store.dispatch(SET_MENUS_INIT_RENDER, row)
      store.dispatch(SET_NOW_ACTIVE, row.indexPage)
      emit('listClick', row)
    }

    // 关闭所有菜单
    const menuListCloseAll = () => {
      debounce(
        () => {
          console.log('menuListCloseAll ---> store.dispatch(SET_MENUS_CLOSE_ALL)')
          store.dispatch(SET_MENUS_CLOSE_ALL)
        },
        1000,
        true
      )
    }

    watch(
      () => props.ifLarger,
      (val) => {
        store.dispatch(SET_MENUS_INIT).then(() => {
          if (val && menuList.value.length) {
            destroyScroll()
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
      listContentRef,
      menuListCloseAll,
      sidebarClassName,
      leftSidebarItemClick,
      leftSidebarListClick
    }
  },
  render() {
    return (
      <div class={this.sidebarClassName}>
        {this.menuList.length ? (
          <div class="flex h-[100%] relative flex-col left-sidebar-content">
            <leftSidebarSearch
              class="search"
              toggleMenu={this.toggleMenu}
              onItemClick={(e, row) => {
                this.leftSidebarItemClick(e, [], row)
              }}
              onMenuListCloseAll={this.menuListCloseAll}
            />
            <div
              key={this.ifLarger}
              class={`flex-1 shrink-0 relative list-wrap ${this.ifLarger ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
            >
              <div
                ref={(node) => {
                  this.listContentRef = node
                }}
                class={`list-content h-[100%] ${this.ifLarger ? 'overflow-y-hidden' : ''}`}
              >
                <div style={{ padding: '0 0 50px 0' }}>
                  {this.menuList.map((item, index) => {
                    return (
                      <leftSidebarItem
                        rowDetails={item}
                        key={`-1-${index}-${item.indexPage}`}
                        grade={-1}
                        menuList={this.menuList}
                        url={[item.name]}
                        onItemClick={(e, list, row) => {
                          this.leftSidebarItemClick(e, list, row)
                        }}
                        onListClick={(e, row) => {
                          this.leftSidebarListClick(e, row)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
.left-sidebar {
  width: v-bind(leftSidebarW);
  font-size: 16px;
  transition: transform 0.3s;
  border-right: 1px solid var(--global-border-color);
  box-sizing: border-box;
  z-index: 10;
  .search {
    padding: 10px 20px;
    border-bottom: 1px solid var(--global-border-color);
  }
  .left-sidebar-content {
  }
  .list-wrap {
    padding: 0 20px;
  }
}
</style>
