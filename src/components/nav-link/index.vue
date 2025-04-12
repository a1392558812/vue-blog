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

    const toggleTheme = (e) => {
      const theme = localStorage.getItem('--global-theme')
      document.startViewTransition(() => {
        // 执行切换主题的操作
        const transition = document.startViewTransition(() => {
          // 动画过渡切换主题色
          if (themeType[theme]) {
            if (theme === 'light') {
              localStorage.setItem('--global-theme', 'dark')
              store.dispatch(SET_THEME, 'dark')
              return
            }
            if (theme === 'dark') {
              localStorage.setItem('--global-theme', 'light')
              store.dispatch(SET_THEME, 'light')
              return
            }
          } else {
            localStorage.setItem('--global-theme', 'dark')
            store.dispatch(SET_THEME, 'dark')
          }
        })

        // document.startViewTransition 的ready 返回一个 Promise
        transition.ready.then(() => {
          // 获取鼠标的坐标
          const { clientX, clientY } = e

          // 计算最大半径
          const radius = Math.hypot(
            Math.max(clientX, innerWidth - clientX),
            Math.max(clientY, innerHeight - clientY)
          )

          // 圆形动画扩散开始
          document.documentElement.animate(
            [
              {
                clipPath: `circle(0% at ${clientX}px ${clientY}px)`
              },
              {
                clipPath: `circle(${radius}px at ${clientX}px ${clientY}px)`
              }
            ],
            // 设置时间，已经目标伪元素
            {
              duration: 300,
              pseudoElement: '::view-transition-new(root)'
            }
          )
        })
      })
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
        class="go-home block shrink-0 cursor-pointer flex items-center justify-start"
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
        <div class={`flex ${this.ifLarger ? 'items-center' : 'flex-col'}`}>
          {this.ifLarger ? (
            <div class="go-home-list relative">
              <div class="go-home flex flex-nowrap items-center justify-center cursor-pointer">
                <span class="shrink-0">导航</span>
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
                class="bg-style box-sizing w-[100%] absolute go-home-list-content"
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

          <div class="flex shrink-0">
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
