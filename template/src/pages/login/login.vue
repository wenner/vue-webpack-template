<template>
  <div layout="column center-center" style="height:100%;background-color:#fafafa">
    <el-card class="box-card" v-loading="loading" style="width:30%;border-radius: 2px">
          <div slot="header" class="text-center">
            <h3>{{appName}}用户登录</h3>
          </div>
          <el-form label-position="left" ref="loginForm" :rules="rules" :model="loginModel" @submit.present="login()">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="loginModel.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginModel.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login()" style="display:block">登录</el-button>
            </el-form-item>
            <span v-if="error">{{error.message || error}}</span>
          </el-form>
        </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {APP_NAME} from 'service/config.js'

  export default {
    data(){
      return {
       appName: APP_NAME , 
        loginModel: {
          name: "",
          password: ""
        },
        error: "",
        rules: {
          name: {required: true, message: '请输入用户名', trigger: 'blur'},
          password: {required: true, message: '请输入密码'}
        },
        loading: false
      }
    },
    mounted(){
      window.addEventListener('keyup', this.keyboardEventListener, false);
    },
    methods: {
      keyboardEventListener(e){
        if (e.keyCode === 13) {
          this.login();
        }
      },
      login(){
        this.$refs.loginForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          this.error = "";
          this.$auth.login({
            body: this.loginModel,
            rememberMe: 1, //this.data.rememberMe,
            //TODO: 应该接受到登录前的地址,然后转到哪里
            redirect: {name: 'home'},
            success() {
              console.log('success ' + this.context);
              this.loading = false;
            },
            error(res) {
              this.loading = false;
              this.error = res.data;
            }
          });
        });
      }
    },
    beforeDestroy(){
      //移除window键盘事件
      window.removeEventListener('keyup', this.keyboardEventListener, false);
    }
  }
</script>

<style></style>
