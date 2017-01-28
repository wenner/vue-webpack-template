export const menus = [
  {name:"baseinfo" , text:"配置" , path:"/configuration" , icon:"fa fa-info-circle" , auth:true , rootPath:"/configuration" ,
    component: "configuration/configuration.vue" ,
    children:[
      {name:"configuration.org" , text:"机构管理" , path:"org" , icon:"fa fa-sitemap" , auth:true ,
        component:"configuration/org/org.vue"} ,
      {name:"configuration.user" , text:"用户管理" , path:"user" , icon:"fa fa-users" , auth:true ,
        component:"configuration/user/user.vue"} ,
      {name:"configuration.role" , text:"角色管理" , path:"role" , icon:"fa fa-reorder" , auth:true ,
        component:"configuration/role/role.vue"} ,
      {name:"configuration.code" , text:"数据代码管理" , path:"code" , icon:"fa fa-codepen" , auth:true ,
        component:"configuration/code/code.vue"} ,
      {isDivider:true} ,
      {name:"configuration.setting" , text:"系统设置" , path:"setting" , icon:"fa fa-gears" , auth:true ,
        component:"configuration/setting/setting.vue"} ,
      {isDivider:true} ,
      {name:"configuration.privilege" , text:"权限列表" , path:"privilege" , icon:"fa fa-lock" , auth:true ,
        component:"configuration/privilege/privilege.vue"}
    ]
  }
];
