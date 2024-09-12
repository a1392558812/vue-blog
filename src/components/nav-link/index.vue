<script lang="jsx">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from 'vuex'

import { SET_THEME } from '@/store/actionType'
import themeType from '@/static/theme/type'

import commonmBtn from '@/components/commonm-btn/index.vue'
export default {
  name: 'components-nav-link',
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
  setup(props, { emit }) {
    const router = useRouter()
    const store = useStore()
    const goHome = () => {
      emit('goHome')
    }
    const navigatorTo = (item) => {
      if (item.newPage) return window.open(`./#${item.url}`)
      emit('toggleShowNavLink', false)
      router.push(item.url)
    }

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

    const linkList = ref([
      {
        name: '书签',
        newPage: false,
        url: '/bookmarks'
      },
      {
        name: '首页',
        newPage: false,
        url: '/',
        imageUrl: new URL('@/assets/images/heishou2.jpg', import.meta.url).href,
        imageClass: 'heishou',
        onClick: goHome
      },
      {
        name: '一些特效demo',
        newPage: false,
        url: '/demo'
      },
      {
        name: '代码操练',
        newPage: true,
        url: '/demo/playground'
      }
    ])

    const handleClick = (item, e) => {
      e && e.preventDefault()
      item.onClick ? item.onClick(e) : navigatorTo(item)
    }

    const commonLink = (item, index) => (
      <a
        key={index}
        style={{ marginRight: index < linkList.value.length - 1 ? '15px' : '' }}
        class="go-home display-block flex-shrink-0 cursor-pointer flex align-items-center justify-content-start"
        href={`/#${item.url}`}
        onClick={(e) => {
          handleClick(item, e)
        }}
      >
        {item.imageUrl ? <img class={item.imageClass} src={item.imageUrl} /> : null}
        <p>{item.name}</p>
      </a>
    )

    return {
      linkList,
      navigatorTo,
      handleClick,
      toggleTheme,
      commonLink
    }
  },
  render() {
    return (
      <>
        <div class={`flex ${this.ifLarger ? 'align-items-center' : 'flex-direction-column'}`}>
          {this.ifLarger ? (
            <div class="go-home-list relative">
              <div class="go-home flex flex-nowrap align-items-center justify-content-center cursor-pointer">
                <span class="flex-shrink-0">导航</span>
                <svg
                  style="margin-left: .25em;width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z"></path>
                </svg>
              </div>
              <div
                style={{
                  width: `${(() => {
                    const target = this.linkList.reduce((longest, current) => {
                      return longest.name.length > current.name.length ? longest : current
                    })
                    return target.name.length + 1
                  })()}em`
                }}
                class="bg-white box-sizing width100 absolute go-home-list-content"
              >
                {this.linkList.map((item, index) => {
                  return this.commonLink(item, index)
                })}
              </div>
            </div>
          ) : (
            <div>
              {this.linkList.map((item, index) => {
                return this.commonLink(item, index)
              })}
            </div>
          )}

          <div class="flex flex-shrink-0">
            <commonmBtn style={{ height: '1em', marginRight: '1em' }} onClick={this.toggleTheme}>
              切换主题
            </commonmBtn>
          </div>
        </div>
      </>
    )
  }
}
</script>

<style scoped lang="scss">
.go-home-list {
  margin-right: 1em;
  .go-home-list-content {
    visibility: hidden;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%) translateY(calc(100% - 10px));
    border-radius: 8px;
    padding: 15px;
    border: 1px solid var(--global-border-color);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.1),
      0 2px 6px rgba(0, 0, 0, 0.08);
    transition: all 0.25s;
    overflow: auto;
    opacity: 0;
    z-index: 100;
  }
  &:hover {
    .go-home-list-content {
      display: block;
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(100%);
    }
  }
}
.go-home {
  min-height: 1.5em;
  color: var(--global-primary-color);
  text-decoration: none;
  border: none;
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 1;
  &:hover {
    text-decoration: underline;
  }
}

.heishou {
  width: 1em;
  height: 1em;
  margin-right: 0.25rem;
}
</style>
