export const routes = [
    // 首页（components/index/）
    {
        path: '/',
        name: 'Index',
        component: () => import('../components/index/_Index.vue'),
        meta: { title: '首页' }
    },
    // 文章列表（Nav 首页入口）
    {
        path: '/posts',
        name: 'Posts',
        component: () => import('../components/p-main/page/PostList.vue'),
        meta: { title: '文章' }
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
        component: () => import('../components/p-main/page/About.vue'),
        meta: { title: '关于' }
    },
    // 归档
    {
        path: '/archives',
        name: 'Archives',
        component: () => import('../components/p-main/page/Archives.vue'),
        meta: { title: '归档' }
    },
    // 标签
    {
        path: '/tags',
        name: 'Tag',
        component: () => import('../components/p-main/page/Tag.vue'),
        meta: { title: '标签' }
    },
    // 友链
    {
        path: '/links',
        name: 'Link',
        component: () => import('../components/p-main/page/Link.vue'),
        meta: { title: '友链' }
    },
    // 友链申请
    {
        path: '/links/apply',
        name: 'LinkApply',
        component: () => import('../components/p-main/page/LinkApply.vue'),
        meta: { title: '友链申请' }
    },
    // 设置
    {
        path: '/settings',
        name: 'Setting',
        component: () => import('../components/p-main/page/Setting.vue'),
        meta: { title: '设置' }
    },
    // 404 兜底
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../components/p-main/page/404.vue'),
        meta: { title: '404' }
    }
]
