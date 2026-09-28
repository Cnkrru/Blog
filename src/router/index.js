export const routes = [
    // 首页（components/index/）
    {
        path: '/',
        name: 'Index',
        component: () => import('../components/index/_Index.vue')
    },
    // 文章列表（Nav 首页入口）
    {
        path: '/posts',
        name: 'Posts',
        component: () => import('../components/p-main/page/PostList.vue')
    },
    // 文章详情
    {
        path: '/post/:id',
        name: 'Post',
        component: () => import('../components/p-main/page/Post.vue')
    },
    // 关于
    {
        path: '/about',
        name: 'About',
        component: () => import('../components/p-main/page/About.vue')
    },
    // 归档
    {
        path: '/archives',
        name: 'Archives',
        component: () => import('../components/p-main/page/Archives.vue')
    },
    // 标签
    {
        path: '/tags',
        name: 'Tag',
        component: () => import('../components/p-main/page/Tag.vue')
    },
    // 友链
    {
        path: '/links',
        name: 'Link',
        component: () => import('../components/p-main/page/Link.vue')
    },
    // 设置
    {
        path: '/settings',
        name: 'Setting',
        component: () => import('../components/p-main/page/Setting.vue')
    },
    // 404 兜底
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../components/p-main/page/404.vue')
    }
]
