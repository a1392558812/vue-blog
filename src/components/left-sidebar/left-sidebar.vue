<script>
import list from '@/static/list.js'
import { reactive, ref, computed } from 'vue'
import leftSidebarProps from '@/common/left-sidebar-props'
import { renderList } from '@/common/methods'
import leftSidebarRenderFactoryFun from './renderFun'
import leftSidebarSearch from './left-sidebar-search'
import dragScroll from '@/directive/drag-scroll'

export default {
  name: 'LeftSidebar',
  props: {
    ...leftSidebarProps
  },
  directives: {
    dragScroll: dragScroll()
  },
  setup (props) {
    console.log('props', props.ifLarger)
    return {
      list: reactive(renderList(list)),
      nowActive: ref(null),
      sidebarClassName: computed(() => {
        let classname = 'left-sidebar flex-shrink-0 bg-white height100'
        if (!props.ifLarger) {
          classname = `${classname} absolute ${props.ifShowMenu ? 'translateX-0' : 'translateX-100'}`
        } else {
          classname = `${classname}`
        }
        return classname
      })
    }
  },
  render () {
    const renderFun = leftSidebarRenderFactoryFun.bind(this)()
    return (
      <div className={this.sidebarClassName}>
        <div className='flex height100 flex-direction-column left-sidebar-content'>
          <leftSidebarSearch
            className='search'
            toggleMenu={this.toggleMenu}
            onSearchLinkClick={(link) => { this.$emit('linkClick', link) }}
            onSearchItemClick={(url) => { this.$emit('itemClick', url) }}
            list={this.list}/>
          <div vDragScroll={this.ifLarger} className='flex-1 flex-shrink-0 scroll-bar-y overflow-y-auto list-wrap'>
            <div>
                {this.list.map((item, index) => {
                  return <renderFun
                      item={item}
                      key={index}
                      grade={-1}
                      list={this.list}
                      url={[item.name]}
                      firstLevelIndex={index}></renderFun>
                })}
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
    ::v-deep(.cell){
      line-height: 1.5;
      .cell-item-title{
        text-indent: 0.5em;
        border-bottom: 1px solid var(--global-border-color);
      }
      .topping{
        margin: 5px;
        height: 14px;
        border-radius: 5px;
        padding: 5px 10px;
        display: inline-block;
        font-size: 14px;
        line-height: 1;
        white-space:nowrap;
        background-color: var(--global-primary-color);
        text-indent: 0;
        color: var(--global-primary-button-text-color);
      }
    }
    ::v-deep(.list-cell){
      position: relative;
      z-index: 0;
      color: var(--global-text-color);
      font-size: 18px;
      font-weight: 600;
      .cell-item-title{
        padding-top: 20px;
        padding-bottom: 20px;
        .cell-item-link{
          margin: 5px;
          height: 14px;
          border-radius: 5px;
          padding: 5px 10px;
          display: inline-block;
          font-size: 14px;
          line-height: 1;
          white-space:nowrap;
          text-indent: 0;
          background-color: skyblue;
          color: var(--global-primary-button-text-color);
        }
      }
      .list-active{
        position: absolute;
        top: 33px;
        transform: translateY(-50%);
        width: 4px;
        border-radius: 200px;
        height: 20px;
        background-color: var(--global-primary-color);
      }
    }
    ::v-deep(.item-cell){
      display: block;
      color: #505d6b;
      font-size: 16px;
      font-weight: 400;
      .cell-item-title{
        padding-top: 10px;
        padding-bottom: 10px;
        .cell-item-link{
          margin: 5px;
          height: 14px;
          border-radius: 5px;
          padding: 5px 10px;
          display: inline-block;
          font-size: 14px;
          line-height: 1;
          white-space:nowrap;
          text-indent: 0;
          background-color: skyblue;
          color: var(--global-primary-button-text-color);
        }
      }
      &:hover{
        color: var(--global-primary-color);
      }
    }
    ::v-deep(.link-cell){
      color: #006895;
      font-size: 16px;
      font-weight: 400;
      .cell-item-title{
        padding-top: 10px;
        padding-bottom: 10px;
      }
      &:hover{
        color: var(--global-primary-color);
      }
    }
    ::v-deep(.item-active){
      color: var(--global-primary-color);
    }
  }
  .list-wrap {
    padding: 0 20px;
  }
}
</style>
