import { createStore } from 'vuex'

import axios from '@/common/axios/index'
import getters from './getter'
import {
  SET_THEME,
  SET_MENUS_ACTIVE,
  SET_MENUS_INIT_RENDER,
  SET_MENUS_INIT,
  SET_MENUS_CLOSE_ALL,
  SET_NOW_ACTIVE,
  SET_DEMO_ROUTE
} from './actionType'
import themeType from '@/static/theme/type'

let menuListPromise = null

const renderList = (list, parentIndex = 0, url = []) => {
  return list.map((item, index) => {
    item.indexPage = parentIndex ? `${parentIndex}-${index}` : `${index}`
    item.url = url.length ? [...url, item.name] : [item.name]
    if (item.children) {
      item.ifShow = false // 是否显示
      item.ifHadRender = false // 是否已经渲染过
      renderList(item.children, item.indexPage, item.url)
    } else {
      item.itemActive = false
    }
    return item
  })
}

const close = (list) => {
  list.map((item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'ifShow')) {
      item.ifShow = false
    }
    if (item.children && item.children.length) {
      close(item.children)
    }
    return item
  })
}

export default createStore({
  state: {
    musicList: [
      {
        name: '风姿花伝 (风姿花传)',
        author: '谷村新司 (たにむら しんじ)',
        image: new URL('@/assets/music/music-bg3.jpg', import.meta.url).href,
        url: new URL('@/assets/music/music3.mp3', import.meta.url).href
      },
      {
        name: '色は匂へど 散りぬるを (花朵艳丽 终会散落)',
        author: '森永真由美 (もりなが まゆみ)',
        image: new URL('@/assets/music/music-bg1.jpg', import.meta.url).href,
        url: new URL('@/assets/music/music1.mp3', import.meta.url).href
      },
      {
        name: '广寒宫 - 《梦幻西游》月宫门派曲',
        author: '吴碧霞',
        image: new URL('@/assets/music/music-bg2.jpg', import.meta.url).href,
        url: new URL('@/assets/music/music2.mp3', import.meta.url).href
      }
    ],
    menuData: {
      nowActive: null,
      menuList: []
    },
    theme: 'light', // light / dark
    demoRoute: []
  },
  getters,
  mutations: {
    [SET_NOW_ACTIVE](state, nowActive) {
      state.menuData.nowActive = nowActive
    },
    [SET_MENUS_CLOSE_ALL](state) {
      close(state.menuData.menuList)
    },
    [SET_MENUS_INIT](state, list) {
      state.menuData.menuList = list
    },
    [SET_THEME](state, theme) {
      if (themeType[theme]) {
        state.theme = theme
        const body = document.body
        Object.keys(themeType[theme]).forEach((key) => {
          body.style.setProperty(`${key}`, themeType[theme][key])
        })
      }
    },
    [SET_MENUS_ACTIVE](state, row) {
      let targetRow = { children: state.menuData.menuList }
      let targetList = state.menuData.menuList
      row.indexPage.split('-').forEach((itemIndex) => {
        targetList = targetRow.children
        targetRow = targetList[itemIndex]
      })

      targetList.map((child) => {
        child.itemActive = false
        return child
      })
      targetRow.itemActive = true
    },
    [SET_MENUS_INIT_RENDER](state, row) {
      let targetRow = { children: state.menuData.menuList }
      const rowIndexPageList = row.indexPage.split('-')
      rowIndexPageList.forEach((itemIndex, index) => {
        if (index !== 0 && index < rowIndexPageList.length) {
          targetRow.ifHadRender = true
          targetRow.ifShow = true
        }
        targetRow = targetRow.children[itemIndex]
      })

      targetRow.ifHadRender = true

      if (row.ifShow) {
        close(row.children)
        targetRow.ifShow = false
      } else {
        targetRow.ifShow = true
      }
    },
    [SET_DEMO_ROUTE](state, demoRoute) {
      state.demoRoute = demoRoute
    }
  },
  actions: {
    [SET_NOW_ACTIVE]({ commit }, nowActive) {
      commit(SET_NOW_ACTIVE, nowActive)
    },
    [SET_MENUS_CLOSE_ALL]({ commit }) {
      commit(SET_MENUS_CLOSE_ALL)
    },
    [SET_MENUS_INIT]({ state, commit }) {
      return new Promise((resolve) => {
        if (state.menuData.menuList.length) {
          menuListPromise = null
          resolve()
        } else {
          if (!menuListPromise) {
            menuListPromise = axios.get('./menu-list/menu-list.json')
          }
          menuListPromise.then(
            (res) => {
              commit(
                SET_MENUS_INIT,
                (() => {
                  let menuList
                  if (res && res.data && res.data.length) {
                    menuList = renderList(res.data)
                  } else {
                    menuList = []
                  }
                  return menuList
                })()
              )
              menuListPromise = null
              resolve()
            },
            () => {
              commit(SET_MENUS_INIT, [])
              resolve()
            }
          )
        }
      })
    },
    [SET_THEME]({ commit }, theme) {
      commit(SET_THEME, theme)
    },
    [SET_MENUS_ACTIVE]({ commit }, row) {
      commit(SET_MENUS_ACTIVE, row)
    },
    [SET_MENUS_INIT_RENDER]({ commit }, row) {
      commit(SET_MENUS_INIT_RENDER, row)
    },
    [SET_DEMO_ROUTE]({ commit }, demoRoute) {
      commit(SET_DEMO_ROUTE, demoRoute)
    }
  },
  modules: {}
})
