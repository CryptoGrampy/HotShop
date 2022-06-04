import { createRouter, createWebHashHistory, RouteRecordRaw, START_LOCATION } from "vue-router";
import PosView from '../views/PosView.vue'
import SettingsView from '../views/SettingsView.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "pos",
    component: PosView
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView
  },
  // {
  //   path: "/history",
  //   name: "history",
  //   component: () =>
  //     import(/* webpackChunkName: "history" */ "../views/HistoryView.vue"),
  // },
  // {
  //   path: "/receive/:requestAmount",
  //   name: "receive",
  //   component: () =>
  //     import(/* webpackChunkName: "quickpay" */ "../views/QuickPayView.vue"),
  //   props: true,
  // },
  {
    path: "/node-checker",
    name: "node-checker",
    component: () =>
      import(
        /* webpackChunkName: "nodechecker" */ "../views/NodeCheckerView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (from === START_LOCATION) {
    // initial navigation
    console.log('start location!', to)
    if (!to.name) {
      router.push({name: 'pos'})
    }
  } else {
    console.log('location change location!', to)
    if (!to.name) {
      router.push({name: 'pos'})
    }
  }
})

export default router;
