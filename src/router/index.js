import { createRouter, createWebHashHistory } from "vue-router";
import WhackAMole from "@/views/WhackAMole/index.vue";
import Puzzle from "@/views/Puzzle/index.vue";

const routes = [
  {
    path: "/whack-a-mole",
    name: "WhackAMole",
    component: WhackAMole,
  },
  {
    path: "/puzzle",
    name: "Puzzle",
    component: Puzzle,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/whack-a-mole",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
