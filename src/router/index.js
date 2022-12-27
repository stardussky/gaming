import { createRouter, createWebHistory } from "vue-router";
import WhackAMole from "@/views/WhackAMole/index.vue";
import Puzzle from "@/views/Puzzle/index.vue";

const routes = [
  {
    path: "/puzzle",
    name: "Puzzle",
    component: Puzzle,
  },
  {
    path: "/whack-a-mole",
    name: "WhackAMole",
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

export default router;
