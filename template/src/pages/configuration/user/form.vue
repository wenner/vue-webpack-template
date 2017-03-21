<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">{{isEditing ? "编辑用户:"+record.truename+"信息" : "添加用户"}}</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <div class="body" self="size-x1">
          <div class="body-inner padding">
            <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
              <el-form-item label="登录账号" prop="name" required>
                <el-input v-model="formModel.name" placeholder="请填写用户登录账号"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="truename" required>
                <el-input v-model="formModel.truename" placeholder="请填写用户姓名"></el-input>
              </el-form-item>
              <el-form-item label="所属机构" prop="loc_id">
                <!--<el-input v-model="formModel.loc_id"></el-input>-->
                <el-select v-model="formModel.loc_id" placeholder="请选择所属机构">
                  <el-option v-for="item in orgComboData" :label="item.pathText.toString()" :value="item.loc_id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="footer buttons text-center">
          <el-button type="primary" @click="preformSave()" :loading="saveProcessing">
            <i class="fa fa-floppy-o"></i> 保存信息
          </el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import * as _ from 'lodash'
  import {orgResource , treeLoader , userResource} from '../_module/resource'

  export default {
    name: 'BaseInfoUserForm',
    props: ['record'] ,
    computed:{
      isEditing(){
        return !!(this.record && !!this.record.loc_id);
      }
    } ,
    data(){
      return {
        orgComboData: null,
        saveProcessing: false ,
        formModel: {
          user_id:"0" ,
          loc_id: "" ,
          name:"" ,
          true_name: ""
        } ,
        rules: {
          name: {required:true , message:"请填写登录账户"} ,
          truename: {required:true , message:"请填写用户姓名"} ,
          loc_id: {required:true , message:"请填写用户所属机构"}
        }
      }
    } ,
    mounted(){
      if (!this.orgComboData){
        this.loadOrgComboData();
      }else{
        //this.orgComboData = this.orgComboData;
      }
      var model = this.record ? _.clone(this.record) : {};
      this.formModel = _.extend(this.formModel , model);
    },
    methods:{
      loadOrgComboData(){
        treeLoader.org()
          .then(res=>{
            this.orgComboData = res.data.comboData;
          });
      },
      closeSidePanel(){
        this.$emit("close");
      } ,
      preformSave(){
        this.$refs.form.validate((valid) => {
          if (!valid) {
            this.$notify({title: '信息错误', message: '信息填写错误,请检查', type: 'warning'});
            return false;
          }
          this.save();
        });
      } ,
      save(){
        this.saveProcessing = true;
        userResource.save(this.formModel)
          .then(res => {
            this.$message({
              title: "保存成功",
              message: "保存用户信息成功!",
              type: 'success'
            });
            this.saveProcessing = false;
            var record = res.data;
            this.$emit("aftersave" , record , this.isEditing);
          } , err => {
            this.$message({
              title: "错误",
              message: "保存信息错误!\n" + err.body,
              type: 'error'
            });
            this.saveProcessing = false;
          });
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
