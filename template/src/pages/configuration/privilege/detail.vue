<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">查看 {{record.name}} 信息</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <el-tabs self="size-x1" class="justify-tabs">
          <el-tab-pane label="权限信息">
            <div class="padding-15">
              <table class="table table-striped">
                <tbody>
                  <tr>
                    <td style="width:20%" class="text-right">ID</td>
                    <td>{{record.pri_id}}</td>
                  </tr>
                  <tr><td class="text-right">名称</td><td>{{record.name}}</td></tr>
                  <tr><td class="text-right">代码</td><td>{{record.code}}</td></tr>
                  <tr><td class="text-right">权限代码</td><td>{{record.fullcode}}</td></tr>
                  <tr><td class="text-right">排序</td><td>{{record.ix}}</td></tr>
                  <tr><td class="text-right">类型</td><td>{{record.type}}</td></tr>
                  <tr><td class="text-right">path</td><td>{{record.path}}</td></tr>
                  <tr><td class="text-right">pathText</td><td>{{record.pathText}}</td></tr>
                </tbody>
              </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="权限操作范围列表" v-if="hasScope">
            <div class="padding-15">
              <table class="table table-striped">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>名称</td>
                    <td>帐号</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-popover
          ref="popover5"
          placement="top"
          v-loading="deleteProcessing"
          v-model="isShowDeleteConfirm">
          <p>确定要删除当前记录 {{record.name}} 吗?</p>
          <p class="text-danger">将同时删除该权限的所有下级权限!</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="isShowDeleteConfirm=false">取消</el-button>
            <el-button type="danger" size="mini" @click="deleteItem" :loading="deleteProcessing">确定</el-button>
          </div>
        </el-popover>
        <div class="footer buttons text-center" v-if="false">
          <el-button type="primary" @click="addChild">
            <i class="fa fa-plus"></i> 添加下级权限
          </el-button>
          <el-button type="info" @click="editItem">
            <i class="fa fa-edit"></i> 修改
          </el-button>
          <el-button type="info" @click="editRange" v-if="hasScope">
            <i class="fa fa-edit"></i> 设置权限范围
          </el-button>
          <el-button type="danger" v-popover:popover5>
            <i class="fa fa-remove"></i> 删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {privilegeResource} from '../_module/resource'

  export default {
    name: 'BaseInfoPrivilegeDetail',
    props:['record'] ,
    computed:{
      hasScope(){
        return this.record.hasscope == "1";
      }
    } ,
    data(){
      return {
        isShowDeleteConfirm: false ,
        deleteProcessing: false ,

        ranges: []
      }
    },
    mounted(){
      if (this.hasScope) this.loadRange();
    } ,
    methods: {
      closeSidePanel(){
        this.$emit("close");
      } ,
      loadRange(){
        privilegeResource.range({id:this.record.pri_id})
          .then(res => {
            this.ranges = res.data;
          })
          .catch(err => {

          });
      } ,
      addChild(){
        this.$emit("addchild" , this.record);
      },
      editItem(){
        this.$emit("edititem" , this.record);
      } ,
      deleteItem(){
        this.deleteProcessing = true;
        privilegeResource.delete({id:this.record.pri_id})
          .then(res => {
            this.$emit("afterdelete" , this.record);
            this.deleteProcessing = false;
          })
          .catch(err=>{
            this.$notify({
              title: "错误",
              message: "删除错误!\n" + err.body,
              type: 'error'
            });
            this.deleteProcessing = false;
          })
      } ,
      editRange(){
        this.$emit("editrange" , this.record);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
