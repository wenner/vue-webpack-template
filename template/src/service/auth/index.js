import Vue from 'vue'
//noinspection JSDuplicatedDeclaration
import router from 'service/router'
import * as _ from 'lodash'
import VueAuth from '@websanova/vue-auth'

Vue.use(VueAuth, {
  //auth: require('@websanova/vue-auth/drivers/auth/basic.js'),
  auth: {
    request: function (req, token) {
      this.options.http._setHeaders.call(this, req, {
        Authorization: 'Basic '+token
      });
    },
    response: function (res) {
      var data = this.options.http._httpData.call(this , res) ,
          token = data['ValidateCode'];
      return token;
    }
  } ,
  http: require('@websanova/vue-auth/drivers/http/vue-resource.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData:{url: 'Account/authenticate', method: 'POST', redirect: '/'},
  fetchData:{url: 'Account/check', method: 'GET'} ,
  refreshPerform(){} ,
  rolesVar: 'privileges' ,
  parseUserData(data){
    var user = data._currentUser;
    user.privileges = _.map(data.privilege , (p)=>{
      return p.fullcode;
    });
    return user;
  },
  //TODO: 后台将401改为403后去掉
  _invalidToken: function (res) {
    return;
    if (res.status === 401) {
      this.logout();
    }
  }
});
