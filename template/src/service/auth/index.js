import Vue from 'vue'
//noinspection JSDuplicatedDeclaration
import router from 'service/router'
import VueAuth from '@websanova/vue-auth'

// Vue.use(require('@websanova/vue-auth'), {
//   auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
//   http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
//   router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
//   ...
//     rolesVar: 'type'
// ...
// });

// Http
Vue.use(VueAuth , {
  router: router ,
  rolesVar: 'privilege',
  loginData:{url: 'Account/authenticate', method: 'POST', redirect: '/'},
  fetchData:{url: 'Account/check', method: 'GET'} ,
  token: [{
    request: 'Authorization',
    response: 'ValidateCode',
    authType: 'bearer',
    foundIn: 'header'
  }, {
    request: 'token',
    response: 'ValidateCode',
    authType: 'bearer',
    foundIn: 'response'
  }] ,
  bearerAuth: {
    request: function (req, token) {
      var data = {};
      data[this.options.token[0].request] = 'Basic ' + token;
      this.options._setHeaders.call(this, req, data);
    },
    response: function (res, token) {
      token = token.split('Basic ');
      if (token) {
        name = 'default-'+this.options.tokenName
        localStorage.setItem(name, token[token.length > 1 ? 1 : 0]);
      }
      //__token.set.call(this, null, token[token.length > 1 ? 1 : 0]);
    }
  } ,
  parseUserData(data){
    var user = data._currentUser;
    user.privilege = data.privilege;
    return user;
  },
  _bind: function () {
    this.options.http = this.options.http || this.options.Vue.http;
    this.options.router = this.options.router || this.options.Vue.router;
    this.ID = function(){
      return this.user().user_id;
    };
  },
  //TODO: 后台将401改为403后去掉
  _invalidToken: function (res) {
    return;
    if (res.status === 401) {
      this.logout();
    }
  },
  refreshPerform(){}
});
