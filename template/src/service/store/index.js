import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import moduleManager from 'service/module/manager.js'

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  actions: moduleManager.actions ,
  getters: moduleManager.getters ,
  modules: moduleManager.modules,
  strict: !debug ,
  plugins: debug ? [createLogger()] : []
});
// store.registerModule('myModule', {
//    ...
// })
export default store
