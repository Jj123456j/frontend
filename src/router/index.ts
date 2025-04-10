import { RouteRecordRaw, createMemoryHistory, createRouter } from "vue-router";

// 定义路由数组
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index2.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/chat/index4.vue"),
  },
];


// 创建路由实例
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});






export default router;
