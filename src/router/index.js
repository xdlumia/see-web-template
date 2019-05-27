import Vue from 'vue'
import Router from 'vue-router'

import systemRoute from 'see-web-system'

// 登录
import Login from '@/components/login'
// 框架
import Layout from '@/components/layout'

const Ero403 = () => import('@/components/403')
const Ero404 = () => import('@/components/404')
const Ero500 = () => import('@/components/500')

Vue.use(Router)

let routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'a系统平台'
    }
  },
  {
    path: '/',
    component: Layout,
    // redirect: '/login',
    children: [
      // 404
      {
        path: '/404',
        name: '404',
        component: Ero404,
        meta: {
          title: '抱歉，您访问的页面不存在'
        }
      },
      ...Object.values(systemRoute)
    ]
  },
  {
    path: '*', // 如果找不到页面跳转到404
    redirect: '/404'
  }
]

if (process.env.NODE_ENV === 'development') {
  const Example = () => import('@/views/example')

  routes[1].children.unshift({
    path: '/example',
    name: 'example',
    component: Example
  })
}

export default new Router({
  mode: 'history',
  routes
})
