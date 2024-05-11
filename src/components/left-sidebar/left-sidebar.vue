<script lang="jsx">
import { reactive, ref, computed, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'

import initList from '@/static/list.js'
import leftSidebarProps from '@/common/left-sidebar-props'
import renderList from '@/common/util/renderList.js'
import leftSidebarItem from './left-sidebar-item.vue'
import leftSidebarSearch from './left-sidebar-search'

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
    const router = useRouter()
    const route = useRoute()

    let bestScroll = null
    const listContentRef = ref(null)

    const menuList = reactive(renderList(initList))
    const nowActive = ref(null)

    const initScroll = () => {
      destroyScroll()
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
      if (bestScroll) {
        bestScroll.destroy()
      }
      bestScroll = null
    }

    const leftSidebarItemClick = (e, childList, row, firstLevelIndex) => {
      if (route.query.indexPage !== row.indexPage) {
        nowActive.value = firstLevelIndex

        let targetRow = { children: menuList }
        let targetList = menuList
        row.indexPage.split('-').forEach(itemIndex => {
          targetList = targetRow.children
          targetRow = targetList[itemIndex]
        })

        targetList.map(child => {
          child.itemActive = false
          return child
        })
        targetRow.itemActive = true

        props.toggleMenu(false)
        router.push({
          path: '/',
          query: { indexPage: row.indexPage }
        })
        emit(row.link ? 'linkClick' : 'itemClick', row.link ? row.link : row.url)
      }
    }

    const leftSidebarListClick = (e, row, firstLevelIndex) => {
      let targetRow = { children: menuList }
      row.indexPage.split('-').forEach(itemIndex => {
        targetRow = targetRow.children[itemIndex]
      })

      targetRow.ifShow = !row.ifShow
      targetRow.ifHadRender = true
      nowActive.value = firstLevelIndex
    }

    watch(
      () => props.ifLarger,
      (val) => {
        if (val) {
          nextTick().then(() => {
            initScroll()
          })
        }
      },
      {
        immediate: true,
        flush: 'post'
      }
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
      <div className={this.sidebarClassName}>
        <div className='flex height100 flex-direction-column left-sidebar-content'>
          <leftSidebarSearch
            className='search'
            toggleMenu={this.toggleMenu}
            onSearchLinkClick={(link) => { this.$emit('linkClick', link) }}
            onSearchItemClick={(url) => { this.$emit('itemClick', url) }}
            list={this.menuList}/>
          <div key={this.ifLarger} className={`flex-1 flex-shrink-0 ${this.ifLarger ? 'overflow-y-hidden' : 'overflow-y-auto'} relative list-wrap`}>
            <div ref={(node) => {
              this.listContentRef = node
            }} className={`list-content height100 ${this.ifLarger ? 'overflow-y-hidden' : ''}`}>
                <div style={{ padding: '0 0 50px 0' }}>
                    {this.menuList.map((item, index) => {
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
                    })}
                </div>
            </div>
          </div>
        </div>
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
