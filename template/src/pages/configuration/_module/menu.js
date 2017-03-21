import {menus} from './constant'
import moduleManage from 'service/module/manager.js'

let moduleMenus = moduleManage.generateMenus(menus);
moduleManage.addMenu(moduleMenus , 70);
//export default checkMenus
