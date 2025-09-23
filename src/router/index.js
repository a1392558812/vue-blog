import { createRouter, createWebHashHistory } from 'vue-router'
import { isArray } from '@/common/util/typeCheck'
import routerSwitchLoading from '@/components/router-switch-loading/index.jsx'
import { useStore } from 'vuex'
import axios from '@/common/axios/index.js'
import { SET_DEMO_ROUTE } from '@/store/actionType'
import { setDemoRouteList, addDemoRouteList } from '@/router/dynamic-demo-route-list'

const routerSwitchLoadingInstance = routerSwitchLoading()

let routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: () => import('../views/bookmarks/index.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404/index.vue')
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/error/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
/**
 * 路由守卫
 */
const ruoterCheck = (list, path, parentPath = '') => {
  let flag = false
  for (let index = 0; index < list.length; index++) {
    const completePath = parentPath ? `${parentPath}/${list[index].path}` : list[index].path
    flag = completePath === path
    if (flag) return flag
    if (isArray(list[index].children)) {
      flag = ruoterCheck(list[index].children, path, completePath)
      if (flag) return flag
    }
  }
  return flag
}
let initialeEntry = true // 是否初次进入博客，展示加载路由动画

router.beforeEach(async (guard, form, next) => {
  console.log('beforeEach', routerSwitchLoadingInstance)
  if (initialeEntry) {
    initialeEntry = false
  } else {
    routerSwitchLoadingInstance.startLoading({})
  }

  const store = useStore()
  const ifHasAddRoute = store.state.demoRoute && store.state.demoRoute.length

  console.log('ifHasAddRoute', ifHasAddRoute, guard)

  if (!ifHasAddRoute) {
    const res = await axios.get('./route-list.json')
    const asyncRoutes = res.data || []
    const demoRoute = setDemoRouteList(asyncRoutes)

    routes = routes.concat(addDemoRouteList(router, demoRoute))
    await store.dispatch(SET_DEMO_ROUTE, demoRoute.list)
  }

  const checkoutRes = ruoterCheck(routes, guard.path)
  console.log('current routes', checkoutRes, routes)
  if (checkoutRes) {
    return ifHasAddRoute ? next() : next({ ...guard })
  } else {
    return next({
      path: '/404',
      replace: true
    })
  }
})
router.afterEach((to, from) => {
  console.log('afterEach', routerSwitchLoadingInstance)
  routerSwitchLoadingInstance.endLoading()
})
export default router
