import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import WorkspacePage from "../pages/WorkspacePage.vue";
import NodesPage from "../pages/NodesPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/workspace",
    },
    {
      path: "/login",
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      component: RegisterPage,
      meta: { guestOnly: true },
    },
    {
      path: "/workspace",
      component: WorkspacePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/nodes",
      component: NodesPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      component: SettingsPage,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return "/login";
  }

  if (to.meta.guestOnly && token) {
    return "/workspace";
  }
});

export default router;