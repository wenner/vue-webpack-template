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
    var statusCode = response.status;
    var title = "错误 ["+statusCode+":"+response.statusText+"]";
    var message = response.body ? response.body.Message : (response.data)+"url:"+response.url;
    switch (statusCode) {
      case 401:
        Notification({
          customClass: "http-error-notify" ,
          title: title ,
          message: message ,
          type:"error"
        });
        break;
      case 403:
        Notification({
          title: title ,
          message: message ,
          type:"error"
        });
        break;
    }
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
