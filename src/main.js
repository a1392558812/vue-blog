import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'jquery'
import './assets/common.scss'
import './assets/reset.css'

import loading from './components/loading/loading.vue'
import createLoadingLikeDirective from './directive/loading'

// 设置主题色
import { SET_THEME } from './store/actionType'
import themeType from '@/static/theme/type'

const theme = localStorage.getItem('--global-theme')

store.dispatch(SET_THEME, theme && themeType[theme] ? theme : 'light')

console.log('router', router)

const app = createApp(App)

app.directive('loading', createLoadingLikeDirective(loading))

app.use(store)
app.use(router)
app.use(store)
app.use(
  (app, option) => {
    console.log('app, option', app, option)
  },
  { data: '这是一个🐮🍺插件' }
)

app.mount('#app')

if (import.meta.env.MODE === 'production') {
  app.config.errorHandler = (err, vm, info) => {
    throw { message: '🚀🚀🚀[全局Error-log]', err, vm, info }
  }
}
