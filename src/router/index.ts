import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    // 无匹配页面则跳转到404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue')
    }
]

const router = createRouter(
    {
        history: createWebHashHistory(),
        routes: routes,
        // 在导航栏中，为当前活动路由的菜单项添加类名
        linkActiveClass: 'router-active'
    }
)

export default router