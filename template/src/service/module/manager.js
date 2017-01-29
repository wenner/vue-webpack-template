import * as _ from 'lodash'
import menuGroup from 'service/constant/menuGroup'

export default {
  //menus
  menus:[] ,
  addMenu(menuArray , index , menuGroupName){
    if (!_.isArray(menuArray)) menuArray = [menuArray];
    if (menuGroupName){
      //从this.menus中获取是否有该菜单分组
      var currentGroup = _.find(this.menus , {group:menuGroupName});
      //如果没有分组,则创建一个分组插入到menus
      var menus = [];
      if (!currentGroup){
        var mg = menuGroup[menuGroupName.toUpperCase()];
        if (!mg) return;
        currentGroup = {
          group: menuGroupName ,
          index: mg.index ,
          menus:[{
            text: mg.text,
            icon: mg.icon ,
            auth: true,
            children: []
          }]
        };
        this.menus.push(currentGroup);
      }
      var children = currentGroup.menus[0].children;
      //向分组的children中插入当前的内容
      for(var i = 0 ; i<menuArray.length ; i++){
        menus.push(menuArray[i]);
      }
      children.push({
        index: index ,
        menus: menus
      });
    }else{
      var result = {
        index: index ,
        menus:[]
      };
      for(var i = 0 ; i<menuArray.length ; i++){
        result.menus.push(menuArray[i]);
      }
      this.menus.push(result);
    }
    console.log(this.menus)
  } ,
  generateMenus(menus){
    let iteratorPath = function(menus){
      _.each(menus , (item)=>{
        item.path = item.path || (item.name && '/'+item.name.replace(/\./ig , '/'));
        if (item.children) iteratorPath(item.children);
      });
    };
    iteratorPath(menus);
    return menus;
  } ,
  getMenus(){
    var rootMenus = [];
    _.each(_.sortBy(this.menus, ['index']), function (item) {
      if (item.group){
        console.log(item)
        var groupMenus = [];
        _.each(_.sortBy(item.menus[0].children , ['index']) , function(child){
          groupMenus = groupMenus.concat(child.menus);
        });
        item.menus[0].children = groupMenus;
      }
      rootMenus = rootMenus.concat(item.menus)
    });
    return rootMenus;
  } ,
  //routes
  routes:[] ,
  /**
   * 想路由列表中加入一条路由
   * @param route 路由记录
   * */
  addRoute(route){
    this.routes = this.routes.concat(route);
  } ,
  generateRoutes(data){
    data = !_.isArray(data) ? [data] : data;
    let resolveComponent = function(component){
      return component
        ? (_.isFunction(component)
          ? component
          : resolve => require(["pages/"+component], resolve)
      ) : null;
    };

    let generateRouteItem = function(item){
      if (!item.path && !item.name) return false;
      let components = item.components
        ? _.reduce(item.components, function(result, value, key) {
            var component = resolveComponent(value);
            if (component) result[key] = component;
            return result;
          }, {})
        : null;
      var route = _.clone(item);
      delete route.component;
      delete route.components;
      delete route.meta;
      route.component = resolveComponent(item.component);
      route.components = components;
      route.meta = _.assign({} , item , item.meta);
      //route.meta.auth = false;
      return route;
    };

    let itertorRouters = function(data , result){
      data.map((item)=>{
        var r = generateRouteItem(item);
        if (r) {
          result.push(r);
          if (item.children){
            r.children = itertorRouters(item.children , []);
          }
        }
      });
      return result;
    };
    var routes = itertorRouters(data , []);
    return routes;
  },
  //store
  modules: {} ,
  getters: {} ,
  actions: {} ,

  addStore(store , moduleName){
    if (store.module){
      _.extend(this.modules , {
        [store.module.name]: store.module
      })
    }
    if (store.getters){
      _.extend(this.getters , store.getters)
    }
    if (store.actions){
      _.extend(this.actions , store.actions);
    }
  } ,
  registerModule(module){
    if (!module && !module.name) return;
    _.extend(this.modules, {
      [module.name]: module
    });
  }
}
