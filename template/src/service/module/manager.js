import * as _ from 'lodash'
import menuGroup from 'service/constant/menuGroup'

/***
 * 解析menus数据 , 其中 isNotMenu 表示只是路由不是菜单 , isNotRouter 表示只是菜单不是路由
 */
export default {
  //menus
  menus:[] ,
  //添加菜单
  addMenu(menuArray , index , menuGroupName){
    if (!_.isArray(menuArray)) menuArray = [menuArray];
    if (menuGroupName){
      //从this.menus中获取是否有该菜单分组
      var currentGroup = _.find(this.menus , {group:menuGroupName});
      //如果没有分组,则创建一个分组插入到menus
      var menus = [];
      if (!currentGroup){
        var mg = menuGroup[menuGroupName.toUpperCase()];
        if (!mg) {
          console.log("缺少group:"+menuGroupName);
          return;
        }
        currentGroup = {
          group: menuGroupName ,
          index: mg.index ,
          menus:[{
            text: mg.text,
            icon: mg.icon ,
            //auth: true,
            rootPath: [] ,
            children: []
          }]
        };
        this.menus.push(currentGroup);
      }
      var currentGroupMenu = currentGroup.menus[0];
      var children = currentGroupMenu.children;
      //向分组的children中插入当前的内容
      for(var i = 0 ; i<menuArray.length ; i++){
        var menuItem = menuArray[i];
        if (menuItem.isNotMenu) continue; //如果该记录不是菜单,则忽略
        if (!menuItem) return;
        //TODO: 将auth内容加入到分组的auth中
        //TODO: 当前判断太罗嗦
        var auth = menuItem.auth;
        if (auth){
          if (_.isBoolean(auth)){
            if (_.isArray(currentGroupMenu.auth)){
              currentGroupMenu.auth = auth;
            }else if (_.isString(currentGroupMenu.auth)){
              currentGroupMenu.auth = [auth]
            }else{
              currentGroupMenu.auth = true;
            }
          }else if (_.isArray(auth)){
            if (_.isArray(currentGroupMenu.auth)){
              currentGroupMenu.auth = currentGroupMenu.auth.concat(auth);
            }else if (_.isString(currentGroupMenu.auth)){
              currentGroupMenu.auth.push(auth);
            }
          }else if (_.isString(auth)){
            if (_.isArray(currentGroupMenu.auth)){
              currentGroupMenu.auth = [currentGroupMenu.auth].concat(auth);
            }else if (_.isString(currentGroupMenu.auth)){
              currentGroupMenu.auth = [currentGroupMenu.auth].push(auth);
            }
          }else{
            currentGroupMenu.auth = true;
          }
        }
        //TODO: 将rootPath加进来
        if (menuItem.rootPath){
          currentGroupMenu.rootPath.push(menuItem.rootPath);
        }
        menus.push(menuItem);
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
        var menuItem = menuArray[i];
        if (menuItem.isNotMenu) continue; //如果该记录不是菜单,则忽略
        result.menus.push(menuArray[i]);
      }
      this.menus.push(result);
    }
  } ,
  //根据传入的数据生成菜单格式数据
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
  //获取菜单
  getMenus(){
    var allMenus = _.cloneDeep(this.menus);
    var rootMenus = [];
    _.each(_.sortBy(allMenus , ['index']), function (item) {
      if (item.group){
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
   * 向路由列表中加入一条路由
   * @param route 路由记录
   * */
  addRoute(route){
    this.routes = this.routes.concat(route);
  } ,
  //通过传入数据生成路由记录数据
  generateRoutes(data){
    data = !_.isArray(data) ? [data] : data;

    //获取路由对应的组件
    let resolveComponent = function(component){
      return component
        ? (_.isFunction(component)
          ? component
          : resolve => require(["pages/"+component], resolve)
      ) : resolve => require(['pages/empty.vue'] , resolve);
    };

    //生成一个路由记录
    let generateRouteItem = function(item , parent){
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

      //如果有parent,则重写Path
      if (parent){
        if (route.path.indexOf("/") != 0){
          route.path = [parent.path , route.path].join("/");
        }
      }
      //route.meta.auth = false;
      return route;
    };

    //递归获取路由
    let iteratorRouters = function(data , result , parent){
      data.map((item)=>{
        var r = generateRouteItem(item , parent);
        if (r) {
          if (!item.isNotRouter) result.push(r); //如果不是路由,则不加入到路由中
          if (item.children){
            if (item.isNotRouter){  //如果不是路由,则子节点直接加入到当前的路由中,而不加入到children中
              iteratorRouters(item.children , result , r);
            }else{
              r.children = iteratorRouters(item.children , []);
            }
          }
        }
      });
      return result;
    };

    var routes = iteratorRouters(data , []);
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
