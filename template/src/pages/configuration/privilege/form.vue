<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div class="header" layout="row center-center">
        <span class="title">{{isEditing ? "编辑 "+record.name+" 的信息" : "添加权限"}}</span>
        <div self="size-x1" class="text-right">
          <button class="btn btn-default" @click="closeSidePanel()">
            <span class="fa fa-close"></span>
          </button>
        </div>
      </div>
      <div class="body" self="size-x1">
        <div class="body-inner padding">
          <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="上级权限" v-if="record.parentNode">
              <el-input v-model="record.parentNode.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="name" required>
              <el-input v-model="formModel.name" placeholder="请填写权限名称"></el-input>
            </el-form-item>
            <el-form-item label="权限代码" prop="fullcode" required>
              <el-input v-model="formModel.fullcode"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="ix">
              <el-select v-model="formModel.ix" placeholder="请选择排序">
                <el-option v-for="d in 50" :label="d" :value="d"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权限范围" prop="hasscope">
              <el-checkbox v-model="formModel.hasscope" true-label="1" false-label="0">该权限需要设置操作范围</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer buttons text-center">
        <el-button type="primary" @click="preformSave()" :loading="saveProcessing">
          <i class="fa fa-floppy-o"></i> 保存权限信息
        </el-button>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import * as _ from 'lodash'
  import {privilegeResource} from '../_module/resource'


  export default {
    name: 'BaseInfoPrivilegeForm',
    props: ['record'],
    computed: {
      isEditing(){
        return !!this.record.pri_id;
      }
    },
    data(){
      return {
        saveProcessing: false,
        parentNode: {},
        formModel: {
          pri_id: "0",
          name: "",
          code: "",
          fullcode: "",
          type: "",
          ix: "1",
          hasscope: "0"
        },
        rules: {
          name: {required: true, message: "请填写权限名称"},
          fullcode: {rquired: true, message: "请填写权限代码"}
        }
      }
    },
    mounted(){
      var model = _.clone(this.record);
      if (!this.isEditing) {
        model.parentid = model.parentNode.pri_id;
        delete model.parentNode;
      }
      this.formModel = _.extend(this.formModel, model);
    },
    methods: {
      closeSidePanel(){
        this.$emit("close", this.formModel.parentid != "0");
      },
      preformSave(){
        this.$refs.form.validate((valid) => {
          if (!valid) {
            this.$notify({title: '信息错误', message: '信息填写错误,请检查', type: 'warning'});
            return false;
          }
          this.save();
        });
      },
      save(){
        this.saveProcessing = true;
        if (!this.isEditing) this.formModel.code = this.formModel.fullcode;
        privilegeResource.save(this.formModel)
          .then(res => {
            this.$notify({
              title: "保存成功",
              message: "保存权限信息成功!",
              type: 'success'
            });
            this.saveProcessing = false;
            var record = res.data;
            this.$emit("aftersave", record, this.isEditing);
          }, err => {
            this.$notify({
              title: "错误",
              message: "保存信息错误!\n" + err.body.Message,
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
