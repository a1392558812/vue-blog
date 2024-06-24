<script lang="jsx">
import { toRefs, computed } from 'vue'
export default {
  name: 'left-sidebar-item',
  props: {
    grade: {
      type: Number,
      default: -1
    },
    rowDetails: {
      type: Object,
      default: () => ({})
    },
    menuList: {
      type: Array,
      default: () => []
    },
    firstLevelIndex: {
      type: Number,
      default: -1
    },
    ifShow: {
      type: Boolean,
      default: true
    },
    nowActive: {
      type: [Number, null],
      default: null
    }
  },
  setup (props, { emit }) {
    const { rowDetails } = toRefs(props)
    const currentGrade = computed(() => props.grade + 1)
    const renderList = computed(() => rowDetails.value && rowDetails.value.children ? rowDetails.value.children : [])
    const tag = computed(() => renderList.value.length ? 'div' : 'a')
    const hrefMap = computed(() => renderList.value.length ? {} : { href: `/#/?indexPage=${rowDetails.value.indexPage}` })
    const titleStyleName = computed(() => ({
      marginLeft: `${currentGrade.value + 1 * 25}px`,
      display: rowDetails.value.ifShow ? 'block' : 'none'
    }))
    const ifRender = computed(() => ('ifHadRender' in rowDetails.value) && rowDetails.value.ifHadRender && 'ifShow' in rowDetails.value)
    const className = computed(() => {
      let className = 'cursor-pointer cell'
      if (rowDetails.value.link) {
        className = `${className} link-cell`
      } else {
        className = `${className} ${renderList.value.length ? 'list-cell' : 'display-block item-cell'}`
      }
      if (rowDetails.value.itemActive) {
        className = `${className} item-active`
      }
      return className
    })

    const listClick = (e, row, firstLevelIndex) => {
      e.stopPropagation()
      emit('listClick', e, row, firstLevelIndex)
    }
    // 子项点击
    const itemClick = (e, menuList, item, firstLevelIndex) => {
      e.stopPropagation()
      e.preventDefault()
      emit('itemClick', e, menuList, item, firstLevelIndex)
    }

    return {
      tag,
      currentGrade,
      renderList,
      hrefMap,
      className,
      titleStyleName,
      ifRender,
      listClick,
      itemClick
    }
  },
  render () {
    const tag = this.tag
    return (this.rowDetails && this.rowDetails.name)
      ? (
            <tag
              class={this.className}
              {...this.hrefMap}
              title={this.rowDetails.name}
              onClick={(e) => {
                this.renderList.length
                  ? this.listClick(e, this.rowDetails, this.firstLevelIndex)
                  : this.itemClick(e, this.menuList, this.rowDetails, this.firstLevelIndex)
              }}
              key={this.rowDetails.index}>
              {this.currentGrade === 0 && this.nowActive === this.firstLevelIndex ? (<div class='list-active'></div>) : null}
              <div
                onClick={(e) => {
                  this.renderList.length
                    ? this.listClick(e, this.rowDetails, this.firstLevelIndex)
                    : this.itemClick(e, this.menuList, this.rowDetails, this.firstLevelIndex)
                }}
                class='cell-item-title flex align-items-center justify-content-start'>
                  {this.rowDetails.link ? (<div class='cell-item-link'>链接</div>) : null}
                  <span>{this.rowDetails.name}</span>
                  {this.rowDetails.topping ? (<div class='topping'>置顶</div>) : null}
              </div>
              {this.ifRender
                ? (
                    <div style={this.titleStyleName}>
                      {
                        this.renderList.map((child, childIndex) => {
                          return (<left-sidebar-item
                            rowDetails={child}
                            menuList={this.renderList}
                            nowActive={this.nowActive}
                            key={childIndex}
                            ifShow={this.rowDetails.ifShow}
                            firstLevelIndex={this.firstLevelIndex}
                            grade={this.currentGrade}
                            onListClick={this.listClick}
                            onItemClick={this.itemClick}/>)
                        })
                      }
                    </div>
                  )
                : null }
            </tag>
        )
      : null
  }
}
</script>
<style scoped lang="scss">
  .cell {
    line-height: 1.5;
    .cell-item-title{
      text-indent: 0.5em;
      border-bottom: 1px solid var(--global-border-color);
    }
    .topping{
      margin: 0 5px;
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
  .list-cell {
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
  .item-cell {
    display: block;
    color: var(--global-text2-color);
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
  .link-cell {
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
  .item-active {
    color: var(--global-primary-color);
  }
</style>
