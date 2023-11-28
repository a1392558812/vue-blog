<script>
import { useRouter } from 'vue-router'
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
    const store = useStore()
    const goHome = () => {
      emit('goHome')
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
    return {
      linkList: [
        {
          name: '书签',
          newPage: false,
          url: '/bookmarks'
        },
        {
          name: '首页',
          newPage: false,
          url: '/',
          imageUrl: require('@/static/image/heishou2.jpg'),
          imageClass: 'heishou',
          onClick: goHome
        },
        {
          name: '一些特效demo',
          newPage: false,
          url: '/demo'
        },
        {
          name: '切换主题',
          newPage: false,
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
    const navigatorTo = (item, e) => {
      e && e.preventDefault()
      item.onClick ? item.onClick(e) : this.navigatorTo(item)
    }
    const createNavBtn = (item) => {
      const commonLink = () => (
        <a
          className={
            'go-home display-block cursor-pointer flex align-items-center justify-content-start'
          }
          href={`/#${item.url}`}
          onClick={(e) => {
            navigatorTo(item, e)
          }}
        >
          {item.imageUrl
            ? (
            <img className={item.imageClass} src={item.imageUrl} />
              )
            : null}
          <p>{item.name}</p>
        </a>
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
          ? <div className="flex align-items-center">
              {this.linkList.map((item) => createNavBtn(item))}
            </div>
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
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 1;
}
.heishou {
  width: 1em;
  height: 1em;
}
</style>
