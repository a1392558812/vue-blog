import Layout from '@/views/demo/index/index.vue'

const loadView = (view) => {
  return () => import(`../views/demo/children/${view}/index.vue`)
}
export const setDemoRouteList = (list = []) => {
  const newModuleRoute = []

  list.forEach((item) => {
    let component
    if (item.component === 'Layout') {
      component = Layout
    } else {
      if (item.fileType === 'vue') {
        component = () => import('../views/demo/async-view/index.vue')
      } else {
        component = loadView(item.component)
      }
    }

    let children
    if (item.children && item.children.length > 0) {
      children = setDemoRouteList(item.children)
    }

    newModuleRoute.push({
      ...item,
      component,
      children
    })
  })

  return {
    newModuleRoute,
    list
  }
}

export const addDemoRouteList = (router, data) => {
  const result = {
    path: '/demo',
    name: 'demo',
    component: () => import('../views/demo/index.vue'),
    children: [
      {
        path: '',
        name: 'demo-index',
        component: () => import('../views/demo/index/index.vue')
      }
    ].concat(data.newModuleRoute)
  }
  router.addRoute(result)

  return result
}
