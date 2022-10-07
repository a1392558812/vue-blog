<script>
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
export default {
  name: 'NavLink',
  props: {
    ifLarger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['goHome', 'toggleShowNavLink'],
  setup (props, { emit }) {
    const router = useRouter()
    const dropdownRefDom = ref(null)
    const goHome = () => {
      emit('goHome')
    }
    const showDropdown = ref(false)
    onClickOutside(dropdownRefDom, (event) => { showDropdown.value = false })
    return {
      showDropdown,
      dropdownRefDom,
      linkList: [
        { name: '掘金大佬css图片', url: '/bingDwenDwen' },
        { name: 'krpano制作全景跳转', url: '/panorama', newPage: true },
        { name: '360°全景风景', url: '/360range', newPage: true },
        { name: 'ikun集合', url: '/3d-scene', newPage: true },
        { name: 'listen music', url: '/music', newPage: true },
        { name: '书签', url: '/bookmarks' },
        { name: '首页', url: '/', imageUrl: require('@/static/image/heishou2.jpg'), imageClass: 'heishou', onClick: goHome }
      ],
      navigatorTo: (item) => {
        if (item.newPage) return window.open(`./#${item.url}`)
        emit('toggleShowNavLink', false)
        router.push(item.url)
      }
    }
  },
  render () {
    const smallScreenClass = 'flex flex-direction-column'
    const navigatorTo = (item) => {
      item.onClick ? item.onClick() : this.navigatorTo(item)
    }
    return (
      <>
        {
          this.ifLarger
            ? (() => {
                const showNumber = 2
                const sliceIndex = this.linkList.length - showNumber
                const showList = this.linkList.slice(sliceIndex, this.linkList.length)
                const moreList = this.linkList.slice(0, sliceIndex)

                return (
                  <div className='flex'>
                    {
                      showList.map(item => {
                        return (
                            <div
                              className='go-home cursor-pointer nav-link-item flex align-items-center justify-content-start'
                              onClick={() => { navigatorTo(item) }}>
                              {
                                item.imageUrl
                                  ? (<img className={item.imageClass} src={item.imageUrl}/>)
                                  : null
                              }
                              <p>{item.name}</p>
                            </div>
                        )
                      })
                    }
                    <div
                      ref="dropdownRefDom"
                      onClick={() => { this.showDropdown = !this.showDropdown }}
                      style={this.showDropdown ? { border: '1px solid #00aa88' } : {}}
                      className="go-home select relative cursor-pointer flex align-items-center justify-content-start">
                      <div className="dropdown-content-item width100 flex align-items-center justify-content-space-between" onClick={(e) => {
                        e.stopPropagation()
                        this.showDropdown = !this.showDropdown
                      }}>
                        <span style={{ marginRight: '1em' }}>一些特效</span>
                        <svg style={{
                          width: '1em',
                          height: '1em',
                          verticalAlign: 'middle',
                          fill: 'currentColor',
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          transform: this.showDropdown ? 'rotate(0)' : 'rotate(180deg)'
                        }} class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1862"><path d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="1863"></path></svg>
                      </div>
                      <div
                        style={this.showDropdown ? {} : { display: 'none' }}
                        className="absolute overflow-y-auto overflow-hidden dropdown-content">
                        {
                          moreList.map((item, index) => {
                            return (<div key={index} onClick={() => { navigatorTo(item) }} class="dropdown-content-item">{item.name}</div>)
                          })
                        }
                      </div>
                    </div>
                  </div>
                )
              })()
            : (
              <div className={smallScreenClass}>
                {
                  this.linkList.map(item => {
                    return (
                      <div
                        className='go-home cursor-pointer nav-link-item flex align-items-center justify-content-start'
                        onClick={() => { navigatorTo(item) }}>
                        {
                          item.imageUrl
                            ? (<img className={item.imageClass} src={item.imageUrl}/>)
                            : null
                        }
                        <p>{item.name}</p>
                      </div>
                    )
                  })
                }
              </div>
              )
      }
      </>
    )
  }
}
</script>

<style scoped lang="scss">
  .go-home{
    margin-right: 30px;
    min-height: 1.5em;
    color: #00aa88;
    text-decoration: none;
    border: none;
    font-size: 16px;
    .heishou{
      width: 1em;
      height: 1em;
    }
  }
  .nav-link-item{
    padding-top: 5px;
    padding-bottom: 5px;
    line-height: 1;
  }
  .dropdown-content{
    padding: 15px 0;
    bottom: -10px;
    transform: translateY(100%);
    border: 1px solid #00aa88;
    border-radius: 5px;
    background: #fff;
    max-height: 400px;
    transform-origin: center top;
    transition: all 0.5s;
  }
  .select{
    width: 9em;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .dropdown-content-item{
    padding: 5px 15px;
    white-space: nowrap;
  }
</style>
