import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

/*
* id:路由插件参数
* fn:接收路径，名称，页面根组件三个参数组成的json，来挂载各个页面的路由
*/
const routes = [
    // index页面
    {
        path: '/',
        name: 'Index',
        component: () => import('../pages/index.vue')
    },
    // home页面
    {
        path: '/home',
        name: 'Home',
        component: () => import('../pages/Home.vue')
    },
    // 关于页面
    {
        path: '/about',
        name: 'About',
        component: () => import('../pages/About.vue')
    },
    // 归档页面
    {
        path: '/archives',
        name: 'Archives',
        component: () => import('../pages/Archives.vue')
    },
    // 友链页面
    {
        path: '/links',
        name: 'Links',
        component: () => import('../pages/Links.vue')
    },
    // 项目页面
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('../pages/Projects.vue')
    },
    // 文章详情页面
    {
        path: '/post/:id',
        name: 'Post',
        component: () => import('../pages/Post.vue')
    },
    // 项目详情页面
    {
        path: '/project/:id',
        name: 'Project',
        component: () => import('../pages/ProjectDetail.vue')
    },
    // 标签页面
    {
        path: '/tag',
        name: 'Tag',
        component: () => import('../pages/Tag.vue')
    },
    // 友链申请页面
    {
        path: '/links/apply',
        name: 'LinkApply',
        component: () => import('../pages/LinkApply.vue')
    },
    // 设置页面
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../pages/Settings.vue')
    },
    // 404页面
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFound.vue')
    }
]

// 根据环境选择要返回的历史记录
const createAppHistory = () => {
    if (import.meta.env.SSR) {
        return createMemoryHistory()
    } 
    else {
        return createWebHistory()
    }
}

// 返回顶部，控制中心内容卡片返回顶部
const scrollToTop = () => {
    if (typeof document !== 'undefined') {
        const el = document.querySelector('.center-card-content')
        if (el) {
            el.scrollTo({top: 0,behavior: 'smooth'})
        }
    }
}

/*
* id:路由插件
* fn:导出路由创建函数给main.js使用
*/
export function createAppRouter() {
    const router = createRouter({
        history: createAppHistory(),
        routes,
        scrollBehavior() { scrollToTop() }
    })
    return router
}

export default createAppRouter