<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">{{isEditing ? "编辑 "+record.code_name+" 信息" : "添加 "+catalog.name+" 代码值"}}</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <div class="body" self="size-x1">
          <div class="body-inner padding">
            <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
              <el-form-item label="名称" prop="code_name" required>
                <el-input v-model="formModel.code_name"></el-input>
              </el-form-item>
              <el-form-item label="值" prop="code_value" required>
                <el-input v-model="formModel.code_value"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="code_description">
                <el-input v-model="formModel.code_description"></el-input>
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
  import {codeResource} from '../module/resource'

  export default {
    name: 'BaseInfoCodeForm',
    props: ['record' , 'catalog'] ,
    computed:{
      isEditing(){
        return !!(this.record && !!this.record.code_id);
      }
    } ,
    data(){
      return {
        orgComboData: null,
        saveProcessing: false ,
        formModel: {
          code_id:"0" ,
          catalog_id: "0" ,
          code_name:"" ,
          code_value: "" ,
          code_description: ""
        } ,
        rules: {
          code_name: {required:true , message:"请填写名称"} ,
          code_value: {required:true , message:"请填写代码值"}
        }
      }
    } ,
    mounted(){
      var model = this.record ? _.clone(this.record) : {catalog_id:this.catalog.id};
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
        codeResource.save(this.formModel)
          .then(res => {
            this.$message({
              title: "保存成功",
              message: "保存信息成功!",
              type: 'success'
            });
            this.saveProcessing = false;
            var record = res.data;
            this.$emit("aftersave" , record , this.isEditing);
          } , err => {
            this.$message({
              title: "错误",
              message: "保存信息错误!\n" + (err.body.Message || err.body),
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
