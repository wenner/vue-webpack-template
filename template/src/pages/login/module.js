import moduleManage from 'service/module/manager.js'

let menus = [
  {name:"login" , text:"登录" , path:"/login" , icon:"" ,
    component:"login/login.vue" ,
    meta: {
      layout: {type:'content-only'}
    }
  }
];
let moduleRoutes = moduleManage.generateRoutes(menus);
moduleManage.addRoute(moduleRoutes);
