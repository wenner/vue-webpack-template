export const menus = [
  {name:"baseinfo" , text:"基础信息" , path:"/baseinfo" , icon:"fa fa-info-circle" , auth:true , rootPath:"/baseinfo" ,
    component: "baseinfo/baseinfo.vue" ,
    children:[
      {name:"baseinfo.org" , text:"机构管理" , path:"/baseinfo/org" , icon:"fa fa-sitemap" , auth:true ,
        component:"baseinfo/org/org.vue"} ,
      {name:"baseinfo.user" , text:"用户管理" , path:"user" , icon:"fa fa-users" , auth:true ,
        component:"baseinfo/user/user.vue"} ,
      {name:"baseinfo.role" , text:"角色管理" , path:"role" , icon:"fa fa-reorder" , auth:true ,
        component:"baseinfo/role/role.vue"} ,
      {name:"baseinfo.code" , text:"数据代码管理" , path:"code" , icon:"fa fa-codepen" , auth:true ,
        component:"baseinfo/code/code.vue"} ,
      {isDivider:true} ,
      {name:"baseinfo.setting" , text:"系统设置" , path:"setting" , icon:"fa fa-gears" , auth:true ,
        component:"baseinfo/setting/setting.vue"} ,
      {isDivider:true} ,
      {name:"baseinfo.privilege" , text:"权限列表" , path:"privilege" , icon:"fa fa-lock" , auth:true ,
        component:"baseinfo/privilege/privilege.vue"}
    ]
  }
];
