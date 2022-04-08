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
    component: SettingsView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
