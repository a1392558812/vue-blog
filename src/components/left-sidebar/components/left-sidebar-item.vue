<script lang="jsx">
import { computed, Transition } from 'vue'
import { useStore } from 'vuex'
import linkTag from './link-tag.vue'

export default {
  name: 'left-sidebar-item',
  components: {
    linkTag,
    Transition
  },
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
    ifShow: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    const store = useStore()
    const nowActive = computed(() => store.state.menuData.nowActive)

    const rowDetails = computed(() => props.rowDetails)
    // 当前层级
    const currentGrade = computed(() => props.grade + 1)
    const ifActiveList = computed(() => {
      if (currentGrade.value === 0 && nowActive.value) {
        const firstIndex = nowActive.value.split('-')[0]
        const targetIndex = rowDetails.value.indexPage.split('-')[0]
        return +firstIndex === +targetIndex
      }
      return false
    })
    const renderList = computed(() => rowDetails.value && rowDetails.value.children ? rowDetails.value.children : [])
    const tag = computed(() => renderList.value.length ? 'div' : 'a')
    const hrefMap = computed(() => renderList.value.length ? {} : { href: `/#/?indexPage=${rowDetails.value.indexPage}` })
    const titleStyleName = computed(() => ({
      marginLeft: '1em',
      display: rowDetails.value.ifShow ? 'block' : 'none'
    }))
    const className = computed(() => {
      let className = 'cursor-pointer cell'
      if (rowDetails.value.link) {
        className = `link-cell ${className}`
      } else {
        className = `${className} ${renderList.value.length ? 'list-cell' : 'display-block item-cell'}`
      }
      if ((nowActive.value === rowDetails.value.indexPage) && !rowDetails.value.children) {
        className = `item-active ${className}`
      }
      return className
    })

    const onRowClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (renderList.value.length) {
        listClick(e, rowDetails.value)
      } else {
        itemClick(e, props.menuList, rowDetails.value)
      }
    }

    // 子项list点击
    const listClick = (e, row) => {
      emit('listClick', e, row)
    }
    // 子项item点击
    const itemClick = (e, menuList, item) => {
      emit('itemClick', e, menuList, item)
    }

    return {
      tag,
      currentGrade,
      renderList,
      hrefMap,
      className,
      titleStyleName,
      ifActiveList,
      onRowClick,
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
              onClick={this.onRowClick}>
              {
                this.ifActiveList
                  ? (<div class='list-active'></div>)
                  : null
              }
              <div
                onClick={this.onRowClick}
                class='cell-item-title flex'>
                  <span style="margin-left: 0.5em">{this.rowDetails.name}</span>
                  {
                    this.renderList.length
                      ? (
                          <svg class="icon flex-shrink-0 overflow-hidden"
                            style={{
                              transform: `rotate(${this.rowDetails.ifShow ? 90 : 0}deg)`,
                              transition: 'all 0.3s',
                              width: '1em',
                              height: '1.5em',
                              verticalAlign: 'middle',
                              fill: 'currentColor'
                            }}
                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34097"><path d="M349.184 208.384l346.624 261.632c22.528 16.896 27.136 49.152 10.24 71.68-3.072 3.584-6.144 7.168-10.24 10.24l-346.624 261.632c-11.264 8.704-27.136 6.144-35.84-5.12-3.584-4.608-5.12-9.728-5.12-15.36V228.864c0-14.336 11.264-25.6 25.6-25.6 5.12 0 10.752 2.048 15.36 5.12z" p-id="34098"></path></svg>
                        )
                      : null
                  }
                  {
                    this.rowDetails.link
                      ? <linkTag/>
                      : null
                  }
                  {
                    this.rowDetails.topping
                      ? (<div class='flex-shrink-0 flex align-items-center justify-content-center topping'><span>置顶</span></div>)
                      : null
                  }
              </div>
                {
                  this.rowDetails.ifHadRender
                    ? (
                        <div style={this.titleStyleName}>
                          {
                            this.renderList.map((child, childIndex) => {
                              return (<left-sidebar-item
                                rowDetails={child}
                                menuList={this.renderList}
                                key={`${this.currentGrade}-${childIndex}-${child.indexPage}`}
                                ifShow={this.rowDetails.ifShow}
                                grade={this.currentGrade}
                                onListClick={this.listClick}
                                onItemClick={this.itemClick}/>)
                            })
                          }
                        </div>
                      )
                    : null
                }
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
      text-indent: 0;
      word-break: break-all;
      border-bottom: 1px solid var(--global-border-color);
    }
    .topping{
      margin: 0 5px;
      height: 1.5em;
      border-radius: 5px;
      padding: 0 10px;
      line-height: 1;
      white-space:nowrap;
      background-color: var(--global-primary-color);
      text-indent: 0;
      color: var(--global-primary-button-text-color);
      span {
        font-size: 14px;
      }
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
