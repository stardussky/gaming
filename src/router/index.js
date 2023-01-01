import { createRouter, createWebHistory } from "vue-router";
import WhackAMole from "@/views/WhackAMole/index.vue";
import Puzzle from "@/views/Puzzle/index.vue";

const routes = [
  {
    path: "/puzzle",
    name: "Puzzle",
    meta: {
      title: "SHL MEDICAL 轉轉拼圖",
    },
    component: Puzzle,
  },
  {
    path: "/whack-a-mole",
    name: "WhackAMole",
    meta: {
      title: "SHL MEDICAL 玉兔尋寶",
    },
    component: WhackAMole,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/puzzle",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
