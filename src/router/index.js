import { createRouter, createWebHashHistory } from 'vue-router'
import { isArray } from '@/common/util/typeCheck'
import { demoList } from './create-demo-list'
import routerSwitenLoading from '@/components/router-switch-loading/index'
const { startLoading, endLoading } = routerSwitenLoading()

const routes = [
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
    path: '/demo',
    name: 'demo',
    component: () => import('../views/demo/index.vue'),
    children: [
      {
        path: '',
        name: 'demo-index',
        component: () => import('../views/demo/index/index.vue')
      },
      ...demoList
    ]
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
router.beforeEach((guard) => {
  console.log('beforeEach', guard)
  if (initialeEntry) {
    initialeEntry = false
  } else {
    startLoading({})
  }

  if (!ruoterCheck(routes, guard.path)) {
    router.replace('/404').then()
  }
})
router.afterEach((to, from) => {
  console.log('afterEach')
  endLoading()
})
export default router
