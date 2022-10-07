import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

const routes = [{
  path: '/',
  name: 'home',
  component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue')
},
{
  path: '/bingDwenDwen',
  name: 'bingDwenDwen',
  component: () => import(/* webpackChunkName: "bingDwenDwen" */ '../views/bingDwenDwen/index.vue')
},
{
  path: '/search',
  name: 'search',
  component: () => import(/* webpackChunkName: "search" */ '../views/search/index.vue')
},
{
  path: '/bookmarks',
  name: 'bookmarks',
  component: () => import(/* webpackChunkName: "bookmarks" */ '../views/bookmarks/index.vue')
},
{
  path: '/music',
  name: 'music',
  meta: {
    ifShowHeaderComponent: false
  },
  component: () => import(/* webpackChunkName: "music" */ '../views/music/index.vue')
},
{
  path: '/3d-scene',
  name: '3d-scene',
  meta: {
    ifShowHeaderComponent: false
  },
  component: () => import(/* webpackChunkName: "music" */ '../views/3d-scene/index.vue')
},
{
  path: '/360range',
  name: '360range',
  meta: {
    ifShowHeaderComponent: false
  },
  component: () => import(/* webpackChunkName: "music" */ '../views/360range/index.vue')
},
{
  path: '/panorama',
  name: 'panorama',
  meta: {
    ifShowHeaderComponent: false
  },
  component: () => import(/* webpackChunkName: "music" */ '../views/panorama/index.vue')
},
{
  path: '/404',
  name: '404',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "404" */ '../views/404/index.vue')
},
{
  path: '/error',
  name: 'Error',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "error" */ '../views/error/index.vue')
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
/**
 * 路由守卫
 */
router.beforeEach((guard) => {
  if (!routes.filter(item => item.path === guard.path).length) {
    router.replace('/404').then()
  }
})

export default router
