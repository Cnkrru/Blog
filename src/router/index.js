import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../pages/Index.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About/About.vue')
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('../pages/Archives.vue')
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('../pages/Links.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../pages/Projects.vue')
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: () => import('../pages/post/Posts.vue')
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: () => import('../pages/project/Projects.vue')
  },
  {
    path: '/changelog',
    name: 'Changelog',
    component: () => import('../pages/log/Changelog.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
]

// 为 Vite SSG 环境选择合适的 history 模式
const createAppHistory = () => {
  if (import.meta.env.SSR) {
    // 在服务器端使用内存历史
    return createMemoryHistory()
  } else {
    // 在客户端使用浏览器历史
    return createWebHistory()
  }
}

// 导出工厂函数而不是单例
export function createAppRouter() {
  const router = createRouter({
    history: createAppHistory(),
    routes,
    scrollBehavior() {
      // 路由切换时滚动内容区域到顶部（内容在 .center-card-content 内滚动）
      if (typeof document !== 'undefined') {
        const el = document.querySelector('.center-card-content')
        if (el) el.scrollTop = 0
      }
      return false
    }
  })
  return router
}

// export default createAppRouter