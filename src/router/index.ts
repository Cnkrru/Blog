// 导入路由，服务器记录，客户端记录，路由记录
import { createRouter, createWebHistory, createMemoryHistory, Router, RouteRecordRaw } from 'vue-router'

//定义路由
const routes: RouteRecordRaw[] = [
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


// 前进后退获取历史记录的函数
const createAppHistory = (): ReturnType<typeof createWebHistory> | ReturnType<typeof createMemoryHistory> => {
    if (import.meta.env.SSR)                            //服务器端  
    {
        return createMemoryHistory()
    } 
    else                                                //客户端
    {
        return createWebHistory()
    }
}

// 切换页面返回顶部的结构体
type ScrollBehaviorReturn = void |boolean |{
    left: number
    top: number
    behavior: ScrollBehavior
}

// 切换页面返回的顶部的函数
const scrollToTop = () : void => {
    if (typeof document !== 'undefined') {
        const el = document.querySelector('.center-card-content')
        if (el) {
            el.scrollTo({
                top: 0,
                behavior: 'smooth' 
            })
        }   
    }
} 

// 创建路由的函数
export function createAppRouter(): Router {
    const router = createRouter({
        history: createAppHistory(),
        routes,
        scrollBehavior(): void { scrollToTop() }
    })
    return router
}

export default createAppRouter