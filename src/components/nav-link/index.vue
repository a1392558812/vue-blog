<script lang="jsx">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from 'vuex'

import { SET_THEME } from '@/store/actionType'
import themeType from '@/static/theme/type'

import commonmBtn from '@/components/commonm-btn/index.vue'
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
        imageUrl: require('@/assets/images/heishou2.jpg'),
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
        style={{ marginRight: (index < (linkList.value.length - 1)) ? '15px' : '' }}
        class='go-home display-block flex-shrink-0 cursor-pointer flex align-items-center justify-content-start'
        href={`/#${item.url}`}
        onClick={(e) => { handleClick(item, e) }}
      >
        {item.imageUrl
          ? (
          <img class={item.imageClass} src={item.imageUrl} />
            )
          : null}
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
  render () {
    return (
      <>
        <div class={`flex ${this.ifLarger ? 'align-items-center' : 'flex-direction-column'}`}>
          <div class={`${this.ifLarger ? 'flex flex-1 overflow-auto link-list-wrap' : ''}`}>
            {
              this.linkList.map((item, index) => {
                return this.commonLink(item, index)
              })
            }
          </div>
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
    .link-list-wrap {
      margin: 0 15px;
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
    }

    .heishou {
      width: 1em;
      height: 1em;
    }
</style>
