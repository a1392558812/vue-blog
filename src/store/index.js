import { createStore } from 'vuex'
import getters from './getter'
import {
  SET_THEME,
  SET_MENUS_ACTIVE,
  SET_MENUS_INIT_RENDER
} from './actionType'
import themeType from '@/assets/theme/type'
import initList from '@/static/list.js'

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

export default createStore({
  state: {
    musicList: [
      {
        name: '风姿花伝 (风姿花传)',
        author: '谷村新司 (たにむら しんじ)',
        image: require('@/assets/music/music-bg3.jpg'),
        url: require('@/assets/music/music3.mp3')
      },
      {
        name: '色は匂へど 散りぬるを (花朵艳丽 终会散落)',
        author: '森永真由美 (もりなが まゆみ)',
        image: require('@/assets/music/music-bg1.jpg'),
        url: require('@/assets/music/music1.mp3')
      },
      {
        name: '广寒宫 - 《梦幻西游》月宫门派曲',
        author: '吴碧霞',
        image: require('@/assets/music/music-bg2.jpg'),
        url: require('@/assets/music/music2.mp3')
      }
    ],
    menuList: renderList(initList),
    theme: 'light' // light / dark
  },
  getters,
  mutations: {
    [SET_THEME] (state, theme) {
      if (themeType[theme]) {
        state.theme = theme
        const body = document.body
        Object.keys(themeType[theme]).forEach(key => {
          body.style.setProperty(`${key}`, themeType[theme][key])
        })
      }
    },
    [SET_MENUS_ACTIVE] (state, row) {
      let targetRow = { children: state.menuList }
      let targetList = state.menuList
      row.indexPage.split('-').forEach(itemIndex => {
        targetList = targetRow.children
        targetRow = targetList[itemIndex]
      })

      targetList.map(child => {
        child.itemActive = false
        return child
      })
      targetRow.itemActive = true
    },
    [SET_MENUS_INIT_RENDER] (state, row) {
      let targetRow = { children: state.menuList }
      row.indexPage.split('-').forEach(itemIndex => {
        targetRow = targetRow.children[itemIndex]
      })

      targetRow.ifHadRender = true
      targetRow.ifShow = !row.ifShow
    }
  },
  actions: {
    [SET_THEME] ({ commit }, theme) {
      commit(SET_THEME, theme)
    },
    [SET_MENUS_ACTIVE] ({ commit }, row) {
      commit(SET_MENUS_ACTIVE, row)
    },
    [SET_MENUS_INIT_RENDER] ({ commit }, row) {
      commit(SET_MENUS_INIT_RENDER, row)
    }
  },
  modules: {

  }
})
