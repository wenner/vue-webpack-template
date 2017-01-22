import * as _ from 'lodash'

export default {
  //menus
  menus:[] ,
  addMenu(menu , index){
    if (!_.isArray(menu)) menu = [menu];
    for(var i = 0 ; i<menu.length ; i++){
      this.menus.splice(index+i , 0 , menu[i]);
    }
    //this.menus.splice(index , 0 , menu);
    //this.menus.push(menu);
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
