import type { RouteRecordRaw, Router } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/Index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
    },
    {
      path: '/postlist',
      name: 'postlist',
      component: () => import('../views/PostList.vue'),
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('../views/Post.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/Category.vue'),
    },
    {
      path: '/tag',
      name: 'tag',
      component: () => import('../views/Tag.vue'),
    },
    {
      path: '/link',
      name: 'link',
      component: () => import('../views/Link.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../views/Setting.vue'),
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('../views/NotFound.vue'),
    },
  ]

// router 实例由 ViteSSG 内部创建，这里持有其引用，供模块级 ts（如 pheader 的搜索跳转）复用
let router: Router | null = null
export const setRouter = (r: Router) => {
  router = r
}
export const getRouter = () => router
