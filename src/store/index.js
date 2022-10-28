import { createStore } from 'vuex'
import getters from './getter'
import {
  SET_THEME
} from './actionType'
import themeType from '@/assets/theme/type'

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
    }
  },
  actions: {
    [SET_THEME] ({ commit }, theme) {
      commit(SET_THEME, theme)
    }
  },
  modules: {

  }
})
