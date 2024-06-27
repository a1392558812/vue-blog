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
      marginLeft: '1em',
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
                class='cell-item-title'>
                  {
                    this.renderList.length
                      ? (
                          <svg class="icon"
                            style={{
                              transform: `rotate(${this.rowDetails.ifShow ? 90 : 0}deg)`,
                              transition: 'all 0.3s',
                              marginTop: '-2.5px',
                              width: '1em',
                              height: '1em',
                              verticalAlign: 'middle',
                              fill: 'currentColor',
                              overflow: 'hidden'
                            }}
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34097"><path d="M349.184 208.384l346.624 261.632c22.528 16.896 27.136 49.152 10.24 71.68-3.072 3.584-6.144 7.168-10.24 10.24l-346.624 261.632c-11.264 8.704-27.136 6.144-35.84-5.12-3.584-4.608-5.12-9.728-5.12-15.36V228.864c0-14.336 11.264-25.6 25.6-25.6 5.12 0 10.752 2.048 15.36 5.12z" p-id="34098"></path></svg>
                        )
                      : null
                  }
                  <span>{this.rowDetails.name}</span>
                  {this.rowDetails.link ? (<div class='cell-item-link display-inline'>链接</div>) : null}
                  {this.rowDetails.topping ? (<div class='topping display-inline'>置顶</div>) : null}
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
      word-break: break-all;
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
        margin: 0 5px;
        border-radius: 5px;
        padding: 0 8px;
        white-space: nowrap;
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
