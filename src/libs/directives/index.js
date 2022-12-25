import bg from "./bgStyle";
import lock from "./scrollLock";

export default (Vue) => {
  Vue.directive("bg", bg);
  Vue.directive("lock", lock);
};
