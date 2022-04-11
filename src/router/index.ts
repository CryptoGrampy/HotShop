import PosView from '../views/PosView.vue'

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import SettingsView from '../views/SettingsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: PosView
  },
  {
    path: '/settings',
    name: 'settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SettingsView.vue')
  },
  {
    path: '/receive/:requestAmount',
    name: 'receive',
    component: () => import(/* webpackChunkName: "about" */ '../views/QuickPayView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
