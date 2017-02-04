import Vue from 'vue'
import VueResource from 'vue-resource'
import {Notification} from 'element-ui'

import * as config from '../config.js'

if (process.env.NODE_ENV !== 'production') {
  //require('./mock-data')
}
//const API_ROOT = config.API_ROOT
Vue.use(VueResource);
//Vue.http.options.root = 'http://localhost:813/api';
Vue.http.options.root = config.API_ROOT;


//Vue.http.options.crossOrigin = true;
//Vue.http.options.xhr = {withCredentials: true};
//Vue.http.options.emulateJSON = true;

Vue.http.interceptors.push((request, next) => {
  request.headers = request.headers || {};
  next((response) => {
    if (response.ok) return;
    var statusCode = response.status;
    var title = "错误 ["+statusCode+":"+response.statusText+"]";
    var message = response.body ? response.body.Message : (response.data)+"url:"+response.url;
    var cls = "" , type="error";
    switch (statusCode) {
      case 0:
        title = "错误";
        message = "未找到对应请求的URL("+response.url+"),可能是没有该Action!"
        break;
      case 401:
        cls = "http-error-notify";
        break;
      case 403:
        break;
      default:
        break;
    }
    Notification({
      title: title ,
      message: message ,
      type:"error"
    });
  })
});


// export default {
//   getAccount (params) {
//     return Res.Account.get(params)
//   }
// }

// export const Message = Vue.resource(API_ROOT + '/messages{/id}');
//
// export const Account = Vue.resource(API_ROOT + '/accounts/{id}');
