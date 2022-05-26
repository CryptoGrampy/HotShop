import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "pos" */ '../views/PosView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/SettingsView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import(/* webpackChunkName: "history" */ '../views/HistoryView.vue')
  },
  {
    path: '/receive/:requestAmount',
    name: 'receive',
    component: () => import(/* webpackChunkName: "quickpay" */ '../views/QuickPayView.vue'),
    props: true
  },
  {
    path: '/node-checker',
    name: 'node-checker',
    component: () => import(/* webpackChunkName: "nodechecker" */ '../views/NodeCheckerView.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
