import moduleManage from 'service/module/manager.js'

let menus = [
  {name:"home" , text:"首页" , path:"/" , icon:"" ,
    component:"home/home.vue",
    auth:true
  }
];
let moduleRoutes = moduleManage.generateRoutes(menus);
moduleManage.addRoute(moduleRoutes);
