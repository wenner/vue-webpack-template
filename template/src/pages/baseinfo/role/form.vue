<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">{{isEditing ? "编辑角色:"+record.name+"信息" : "添加角色"}}</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <div class="body" self="size-x1">
          <div class="body-inner padding">
            <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
              <el-form-item label="角色名称" prop="name" required>
                <el-input v-model="formModel.name" placeholder="请填写角色名称"></el-input>
              </el-form-item>
              <el-form-item label="角色代码" prop="code" required>
                <el-input v-model="formModel.code" placeholder="请填写角色代码"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="description">
                <el-input type="textarea" v-model="formModel.description"></el-input>
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
  import {roleResource} from '../service/resource'

  export default {
    name: 'BaseInfoRoleForm',
    props: ['record'] ,
    computed:{
      isEditing(){
        return !!(this.record && !!this.record[this.primaryKey]);
      }
    } ,
    data(){
      return {
        saveProcessing: false ,
        primaryKey: "r_id" ,
        formModel: {
          r_id:"0" ,
          name:"" ,
          code:"" ,
          description: ""
        } ,
        rules: {
          name: {required:true , message:"请填写角色名称"} ,
          code: {required:true , message:"请填写角色代码"}
        }
      }
    } ,
    mounted(){
      var model = this.record ? _.clone(this.record) : {};
      this.formModel = _.extend(this.formModel , model);
    },
    methods:{
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
        roleResource.save(this.formModel)
          .then(res => {
            this.$message({
              title: "保存成功",
              message: "保存角色信息成功!",
              type: 'success'
            });
            this.saveProcessing = false;
            var record = res.data.Role;
            this.$emit("aftersave" , record , this.isEditing);
          } , err => {
            this.$notify({
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
