import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    // 登录路由
    path: '/login',
    component: () => import('views/login/Login'),
  },
  {
    // 首页路由
    path: '/home',
    component: () => import('views/home/Home'),
    children: [
      {
        //欢迎页路由
        path: '',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        component: () => import('views/welcome/Welcome')
      },
      {
        path: '/users',
        component: () => import('views/users/Users'),
        children: [
          {
            path: '',
            redirect: 'userlist',
          },
          {
            // 用户管理页路由
            path: 'usermanage',
            component: () => import('views/usermanage/UserManage'),
          },
          {
            // 用户列表页路由
            path: 'userlist',
            component: () => import('views/userlist/UserList'),
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path == '/login') {
    next()
  }else {
    const token = window.sessionStorage.getItem('token')
    if(token) {
      next()
    }else {
      next('/login')
    }
  }
})

export default router
