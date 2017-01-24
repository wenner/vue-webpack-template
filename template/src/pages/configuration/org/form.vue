<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">{{isEditing ? "编辑机构:"+record.name+"信息" : "添加机构"}}</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <div class="body" self="size-x1">
          <div class="body-inner padding">
            <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
              <el-form-item label="上级机构" v-if="record.parentNode">
                <el-input v-model="record.parentNode.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="机构名称" prop="name" required>
                <el-input v-model="formModel.name" placeholder="请填写机构名称"></el-input>
              </el-form-item>
              <el-form-item label="类别" prop="type" required>
                <el-select v-model="formModel.type" placeholder="请选择类别">
                  <el-option v-for="d in locTypes" :label="d" :value="d"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="ix" required>
                <el-select v-model="formModel.ix" placeholder="请选择排序">
                  <el-option v-for="d in 50" :label="d" :value="d"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机构代码" prop="loc_code">
                <el-input v-model="formModel.loc_code"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="footer buttons text-center">
          <el-button type="primary" @click="preformSave()" :loading="saveProcessing">
            <i class="fa fa-floppy-o"></i> 保存机构信息
          </el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import * as _ from 'lodash'
  import {orgResource} from '../module/resource'


  export default {
    name: 'BaseInfoOrganizationForm',
    props: ['record'] ,
    computed:{
      isEditing(){
        return !!this.record.loc_id;
      }
    } ,
    data(){
      return {
        locTypes: ["养管单位" , "权属单位" , "管理单位" , "其他单位"] ,
        saveProcessing: false ,
        parentNode: {} ,
        formModel: {
          loc_id: "0" ,
          name:"" ,
          loc_code: "" ,
          type:"" ,
          ix:"1"
        } ,
        rules: {
          name: {required:true , message:"请填写机构名称"} ,
          type: {required:true , message:"请选择机构类别"} ,
          ix: {required:true}
        }
      }
    } ,
    mounted(){
      var model = _.clone(this.record);
      if (!this.isEditing){
        model.parentid = model.parentNode.loc_id;
        delete model.parentNode;
      }
      this.formModel = _.extend(this.formModel , model);
    },
    methods:{
      closeSidePanel(){
        this.$emit("close" , this.formModel.parentid != "0");
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
        orgResource.save(this.formModel)
          .then(res => {
            this.$notify({
              title: "保存成功",
              message: "保存机构信息成功!",
              type: 'success'
            });
            this.saveProcessing = false;
            var record = res.data;
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
