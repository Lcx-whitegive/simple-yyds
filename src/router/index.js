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
      },
      {
        // 权限列表页路由
        path: '/rights',
        component: () => import('views/rights/Rights'),
      },
      {
        // 角色列表页路由
        path: '/roles',
        component: () => import('views/roles/Roles'),
      },
      {
        // 商品分类页路由
        path: '/categories',
        component: () => import('views/categories/Categories'),
      },
      {
        // 商品列表页路由
        path: '/goods',
        component: () => import('views/goods/Goods'),
      },
      {
        // 商品参数页路由
        path: '/params',
        component: () => import('views/params/Params'),
      },
      {
        // 添加商品页路由
        path: '/goods/add',
        component: () => import('views/addgoods/AddGoods'),
      },
      {
        // 订单列表页路由
        path: '/orders',
        component: () => import('views/orders/Orders'),
      },
      {
        // 报表页路由
        path: '/reports',
        component: () => import('views/reports/Reports'),
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
