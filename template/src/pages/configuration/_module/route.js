import {menus} from './constant'
import moduleManage from 'service/module/manager.js'

let moduleRoutes = moduleManage.generateRoutes(menus);
moduleManage.addRoute(moduleRoutes);
