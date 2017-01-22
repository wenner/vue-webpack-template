<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <br><br>
        <el-card class="box-card" v-loading="loading">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">请登录</span>
          </div>
          <el-form label-position="top" ref="loginForm" :rules="rules" :model="loginModel" @submit.present="login()">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="loginModel.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginModel.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.native="login()">登录</el-button>
            </el-form-item>
            {{error}}
          </el-form>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return {
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
