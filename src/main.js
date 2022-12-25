/* eslint-disable-next-line import/no-unresolved */
import "virtual:svg-icons-register";
import "@/styles/main.scss";
import { createApp } from "vue";
import directives from "@/libs/directives";
import App from "./App.vue";

const app = createApp(App);

app.use(directives);

app.mount("#app");

export default app;
