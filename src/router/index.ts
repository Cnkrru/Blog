import { createRouter, createWebHistory, createMemoryHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Index',
        component: () => import('../pages/index.vue')
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

const createAppHistory = (): ReturnType<typeof createWebHistory> | ReturnType<typeof createMemoryHistory> => {
    if (import.meta.env.SSR) {
        return createMemoryHistory()
    } else {
        return createWebHistory()
    }
}

type ScrollBehaviorReturn = void | boolean | {
    left: number
    top: number
    behavior: ScrollBehavior
}

const scrollToTop = (): void => {
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

export function createAppRouter(): Router {
    const router = createRouter({
        history: createAppHistory(),
        routes,
        scrollBehavior(): void { scrollToTop() }
    })
    return router
}

export default createAppRouter
