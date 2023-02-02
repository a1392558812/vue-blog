<script>
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { useStore } from 'vuex'

import { SET_THEME } from '@/store/actionType'
import themeType from '@/assets/theme/type'

import commonmBtn from '@/components/button'
export default {
  name: 'NavLink',
  components: {
    commonmBtn
  },
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
    const store = useStore()
    const goHome = () => {
      emit('goHome')
    }
    const showDropdown = ref(false)
    onClickOutside(dropdownRefDom, (event) => {
      showDropdown.value = false
    })
    const toggleTheme = () => {
      const theme = localStorage.getItem('--global-theme')
      if (themeType[theme]) {
        if (theme === 'light') {
          localStorage.setItem('--global-theme', 'dark')
          store.dispatch(SET_THEME, 'dark')
          return
        }
        if (theme === 'dark') {
          localStorage.setItem('--global-theme', 'light')
          store.dispatch(SET_THEME, 'light')
        }
      } else {
        localStorage.setItem('--global-theme', 'dark')
        store.dispatch(SET_THEME, 'dark')
      }
    }
    return {
      showDropdown,
      dropdownRefDom,
      linkList: [
        { name: '掘金大佬css图片', url: '/bingDwenDwen' },
        { name: 'krpano制作全景跳转', url: '/panorama', newPage: true },
        { name: '360°全景风景', url: '/360range', newPage: true },
        { name: 'listen music', url: '/music', newPage: true },
        { name: '水印', url: '/waterMarker', newPage: true },
        { name: '3D-ikun集合', url: '/3d-scene', newPage: true },
        { name: '3D-模型', url: '/3d-doctor', newPage: true },
        { name: '3D-DOA5玛丽罗斯', url: '/3d-Marie-Rose', newPage: true },
        { name: '书签', url: '/bookmarks' },
        {
          name: '首页',
          url: '/',
          imageUrl: require('@/static/image/heishou2.jpg'),
          imageClass: 'heishou',
          onClick: goHome
        },
        {
          name: '切换主题',
          tag: 'commonmBtn',
          onClick: toggleTheme
        }
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
    const createNavBtn = (item) => {
      const commonLink = () => (
        <div
          className={
            'go-home nav-link-item cursor-pointer flex align-items-center justify-content-start'
          }
          onClick={() => {
            navigatorTo(item)
          }}
        >
          {item.imageUrl
            ? (
            <img className={item.imageClass} src={item.imageUrl} />
              )
            : null}
          <p>{item.name}</p>
        </div>
      )
      const componentBtn = () => (
        <div class="flex">
          <commonmBtn
            style={{ height: '1em', marginRight: '1em' }}
            onClick={() => {
              navigatorTo(item)
            }}
          >
            {item.name}
          </commonmBtn>
        </div>
      )
      if (item.tag === 'commonmBtn') {
        return componentBtn()
      } else {
        return commonLink()
      }
    }
    return (
      <>
        {this.ifLarger
          ? (
              (() => {
                const showNumber = 3
                const sliceIndex = this.linkList.length - showNumber
                const showList = this.linkList.slice(
                  sliceIndex,
                  this.linkList.length
                )
                const moreList = this.linkList.slice(0, sliceIndex)

                return (
              <div className="flex align-items-center">
                {showList.map((item) => createNavBtn(item))}
                <div
                  ref="dropdownRefDom"
                  onClick={() => {
                    this.showDropdown = !this.showDropdown
                  }}
                  style={
                    this.showDropdown
                      ? { border: '1px solid var(--global-primary-color)' }
                      : {}
                  }
                  className="go-home select relative cursor-pointer flex align-items-center justify-content-start"
                >
                  <div
                    className="dropdown-content-item width100 flex align-items-center justify-content-space-between"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.showDropdown = !this.showDropdown
                    }}
                  >
                    <span style={{ marginRight: '1em' }}>一些特效</span>
                    <svg
                      style={{
                        width: '1em',
                        height: '1em',
                        verticalAlign: 'middle',
                        fill: 'currentColor',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        transform: this.showDropdown
                          ? 'rotate(0)'
                          : 'rotate(180deg)'
                      }}
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="1862"
                    >
                      <path
                        d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z"
                        p-id="1863"
                      ></path>
                    </svg>
                  </div>
                  <div
                    style={this.showDropdown ? {} : { display: 'none' }}
                    className="absolute overflow-y-auto overflow-hidden dropdown-content"
                  >
                    {moreList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            navigatorTo(item)
                          }}
                          class="dropdown-content-item"
                        >
                          {item.name}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
                )
              })()
            )
          : (
          <div className={smallScreenClass}>
            {this.linkList.map((item) => createNavBtn(item))}
          </div>
            )}
      </>
    )
  }
}
</script>

<style scoped lang="scss">
.go-home {
  margin-right: 30px;
  min-height: 1.5em;
  color: var(--global-primary-color);
  text-decoration: none;
  border: none;
  font-size: 16px;
}
.heishou {
  width: 1em;
  height: 1em;
}
.nav-link-item {
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 1;
}
.dropdown-content {
  padding: 15px 0;
  bottom: -10px;
  transform: translateY(100%);
  border: 1px solid var(--global-primary-color);
  border-radius: 5px;
  background: var(--global-background-color);
  max-height: 400px;
  transform-origin: center top;
  transition: all 0.5s;
}
.select {
  width: 9em;
  border: 1px solid var(--global-border-color);
  border-radius: 5px;
}
.dropdown-content-item {
  padding: 5px 15px;
  white-space: nowrap;
}
</style>
