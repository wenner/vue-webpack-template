import Vue from 'vue'
import VueRouter from 'vue-router'

import * as CONSTANT from 'service/constant'
import {APP_NAME} from 'service/config.js'
import moduleManager from 'service/module/manager'

Vue.use(VueRouter);
var routes = moduleManager.routes;
var otherRoutes = moduleManager.generateRoutes([
  {
    name: "404", path: '/404', component: "404.vue",
    meta: {
      layout: {type: 'content-only'}
    }
  },
  {path: '*', redirect: '/404'}
]);
routes = routes.concat(otherRoutes);
const router = Vue.router = new VueRouter({
	routes: routes
});

router.beforeEach((to, from, next) => {
  router.app.$store.commit('updateLayout', to.meta.layout);
  if (CONSTANT.RESOLVED) {
    next();
  } else {

  }
  //为每一个路径添加title标题 在定义router时,应添加test名称即为title标题
  let titleStr = [APP_NAME];
  if (to.name !== "home") { //主页显示默认title
    //遍历数组获取匹配到的路由节点,拼接各部分title
    for (let i = 0, l = to.matched.length; i < l; ++i) {
      let subTitle = to.matched[i].meta && to.matched[i].meta.text || "";
      if (subTitle) titleStr.unshift(subTitle);
    }
  }
  document.title = titleStr.join(" - ");
  next();
});

router.afterEach(route=> {
});
export default router
