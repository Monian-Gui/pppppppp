import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/Login.vue'),
  //   hidden: true
  // },
  {
    path: '/',
    redirect: '/economy',
    hidden: true
  },
  {
    path: '/overview',
    component: () => import('@/views/overview/Overview.vue'),
    name: 'Overview',
    meta: {
      title: '功能区总览',
      mapHidden: true
    }
  },
  {
    path: '/economy',
    component: Layout,
    redirect: '/economy/home',
    meta: {
      title: '经济运行'
    },
    children: [
      {
        path: '/economy/home',
        component: () => import('@/views/economy/Home.vue'),
        name: 'economyHome',
        meta: {
          title: '首页',
          icon: 'icon-shouye',
          // mapHidden: true
        }
      },
      {
        path: '/economy/industry',
        component: () => import('@/views/economy/Industry.vue'),
        name: 'economyIndustry',
        meta: {
          title: '产业发展',
          icon: 'icon-chanye',
          mapHidden: true
        }
      },
      {
        path: '/economy/building',
        component: () => import('@/views/economy/Building.vue'),
        name: 'economyBuilding',
        meta: {
          title: '楼宇经济',
          icon: 'icon-lou',
          mapHidden: true
        }
      },
      {
        path: '/economy/shop',
        component: () => import('@/views/economy/Shop.vue'),
        name: 'economyShop',
        meta: {
          title: '店铺发展',
          icon: 'icon-mall'
        }
      },
      // {
      //   path: '/economy/serve',
      //   component: () => import('@/views/economy/Serve.vue'),
      //   name: 'economyServe',
      //   meta: {
      //     title: '商业服务能力',
      //     icon: 'icon-fuwunengli'
      //   }
      // },
      {
        path: '/economy/project',
        component: () => import('@/views/economy/Project.vue'),
        name: 'economyProject',
        meta: {
          title: '商业项目',
          icon: 'icon-shangye'
        }
      },
      {
        path: '/economy/flow',
        component: () => import('@/views/economy/Flow.vue'),
        name: 'economyFlow',
        meta: {
          title: '商圈客流',
          icon: 'icon-keliu'
        }
      }
      // {
      //   path: '/economy/comparison',
      //   component: () => import('@/views/economy/comparison/Comparison.vue'),
      //   name: 'economyComparison',
      //   meta: {
      //     title: '功能区发展对比',
      //     icon: 'icon-duibi',
      //     mapHidden: true
      //   }
      // }
    ]
  },
  {
    path: '/serve',
    component: Layout,
    redirect: '/serve/land',
    meta: {
      title: '服务能力'
    },
    children: [
      {
        path: '/serve/land',
        component: () => import('@/views/serve/Land.vue'),
        name: 'serveLand',
        meta: {
          title: '土地资源',
          icon: 'icon-tudi',
          // mapHidden: true
        }
      },
      {
        path: '/serve/public',
        component: () => import('@/views/serve/Public.vue'),
        name: 'servePublic',
        meta: {
          title: '公共配套',
          icon: 'icon-sheshi'
        }
      },
      {
        path: '/serve/Popu',
        component: () => import('@/views/serve/Popu.vue'),
        name: 'servePopu',
        meta: {
          title: '人口职住',
          icon: 'icon-shangban'
        }
      },
      {
        path: '/economy/serve',
        component: () => import('@/views/economy/Serve.vue'),
        name: 'economyServe',
        meta: {
          title: '商业服务能力',
          icon: 'icon-fuwunengli'
        }
      },
      {
        path: '/economy/comparison',
        component: () => import('@/views/economy/comparison/Comparison.vue'),
        name: 'economyComparison',
        meta: {
          title: '功能区发展对比',
          icon: 'icon-duibi',
          mapHidden: true
        }
      }
    ]
  },
  {
    path: '/enterprise',
    component: Layout,
    redirect: '/enterprise/home',
    meta: {
      title: '市场洞察'
    },
    children: [
      {
        path: '/enterprise/home',
        component: () => import('@/views/enterprise/Home.vue'),
        name: 'enterpriseHome',
        meta: {
          title: '首页',
          icon: 'icon-shouye',
          // mapHidden: true
        }
      },
      {
        path: '/enterprise/enterprise',
        component: () => import('@/views/enterprise/Enterprise.vue'),
        name: 'enterpriseEnterprise',
        meta: {
          title: '高企发展态势',
          icon: 'icon-qiye'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
