<script lang="jsx">
export default {
  name: 'BookmarksItem',
  props: {
    level: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    // 定义一个渲染函数，用于生成 Vue 组件或元素
    const renderFun = () => ({ level, data, index = -1 }) => {
      // 定义一个点击事件处理函数
      const handelClick = (item) => {
        // 如果 level 未定义，不执行任何操作
        if (!level) return
        // 设置当前点击项的 ifRender 属性为 true
        item.ifRender = true
        // 切换显示/隐藏状态
        item.ifShow = !item.ifShow
      }
      // 定义一个函数，用于判断是否渲染
      const ifRender = () => {
        // 如果 level 未定义，返回 true，表示渲染
        if (!level) return true
        // 返回 data 对象中是否存在 ifRender 和 ifShow 属性，并且 ifRender 为 true
        return ('ifRender' in data) && data.ifRender && 'ifShow' in data
      }
      // 调用自身，可能是为了实现递归渲染
      const vNode = renderFun()
      // 返回一个片段，包含要渲染的内容
      return (<>
        {
          // 根据 data.href 是否为空来决定渲染内容
          data.href
            ? (
              <div className='link flex'>
                {index !== -1 ? (<div className='link-item'>{index + 1}-</div>) : null}
                {
                  // 根据 data.icon 是否为空来渲染图片或默认图标
                  data.icon
                    ? (<img className='link-img' src={data.icon} />)
                    : (<div className='link-img flex align-items-center justify-content-space-between'>🥵</div>)
                }
                <a className='link-item' href={data.href}>{data.name}</a>
              </div>
              )
            : (
              // 如果 data.href 为空，渲染一个文本项，并带有可点击切换的图标
              <div className='flex align-items-center'>
                <div className='title-item' onClick={() => handelClick(data)}>
                  <span className='cursor-pointer '>{data.name}</span>
                </div>
                {
                  // 是否渲染下拉图标，取决于 level 是否定义
                  level
                    ? (
                      <svg className='drop-down-icon'
                        style={{
                          width: '1em',
                          height: '1em',
                          verticalAlign: 'iddle',
                          fill: 'currentColor',
                          color: 'var(--global-text-color)',
                          overflow: 'hidden',
                          transition: 'all 0.5s',
                          transform: `rotate(${!level ? true : data.ifShow ? 0 : 180}deg)`
                        }}
                        viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='5880'>
                        <path
                          d='M878.592 250.88q29.696 0 48.128 11.264t24.576 29.696 0 41.472-26.624 45.568q-82.944 92.16-159.744 180.224t-148.48 164.864q-19.456 20.48-45.568 31.744t-53.76 11.776-53.248-8.704-43.008-28.672q-39.936-44.032-82.944-90.112l-88.064-92.16q-43.008-46.08-85.504-90.624t-79.36-86.528q-17.408-19.456-22.528-40.448t1.024-38.4 23.552-28.672 45.056-11.264q35.84 0 98.816-0.512t137.728-0.512l153.6 0 150.528 0 125.952 0 79.872 0z'
                          p-id='5881'></path>
                      </svg>
                      )
                    : null
                }
              </div>
              )
        }

        {
          // 判断是否渲染子内容，条件为 level 有定义并且 data 对象有 child 属性且 child 属性不为空
          (ifRender() && data.child && data.child.length)
            ? (
              <div className={`content ${!level ? true : data.ifShow ? '' : 'display-none'}`}>
                {
                  // 循环渲染子项，并且每一项都递归调用 renderFun 函数
                  data.child.map((item, index) => {
                    return (
                      <div
                        style={{ marginLeft: '15px' }}
                        key={index}>
                        <vNode level={level + 1} data={item} index={index} />
                      </div>
                    )
                  })
                }
              </div>
              )
            : null
        }
      </>)
    }
    return {
      renderFun
    }
  },
  render () {
    const vNode = this.renderFun()
    return <div class='bookmarks-main'>
      <vNode level={this.level} data={this.data} />
    </div>
  }
}
</script>

<style scoped lang="scss">
.bookmarks-main {
  ::v-deep(.link) {
    padding: 5px;
    font-size: 15px;

    .link-img {
      margin: 0.25em;
      width: 1.25em;
      height: 1.25em;
      line-height: 1.25;
    }

    .link-item {
      display: inline-block;
      margin: 0 0 0 0.25em;
      line-height: 1.5;
      color: var(--global-text-color);
      &:hover {
        color: var(--global-primary-color);
      }
    }
  }

  ::v-deep(.title-item) {
    display: inline-block;
    word-spacing: 0.04em;
    color: var(--global-primary-color);
    font-weight: bold;
    padding: 5px;
    font-size: 18px;
  }
}
</style>
