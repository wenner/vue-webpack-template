{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
//vue
import Vue from 'vue'
import VuexRouterSync from 'vuex-router-sync'
//resource base
import 'service/resource'
//import modules
import 'service/modules.js'
//vuex state manager
import store from 'service/store'
//router
import router from 'service/router'
//auth
import 'service/auth'
//import eleme ui
import Element from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
//filter
import 'service/filter'


//jquery , bootstrap
window.$ = window.jQuery = require('jquery')
require('bootstrap-sass')


import App from 'pages/app'


Vue.use(Element);
VuexRouterSync.sync(store, router);

/* eslint-disable no-new */
new Vue({
  el: 'app',
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  template: '<App/>',
  components: { App },
  {{/if_eq}}
  store ,
  router
})
