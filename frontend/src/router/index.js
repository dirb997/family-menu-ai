import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/weekly-menu',
      name: 'weekly-menu',
      component: () => import('../views/WeeklyMenuView.vue')
    },
    {
      path: '/menu-list',
      name: 'menu-list',
      component: () => import('../views/MenuListView.vue')
    },
    {
      path: '/menu/:id',
      name: 'menu-detail',
      component: () => import('../views/MenuDetailView.vue')
    }
  ]
})

export default router