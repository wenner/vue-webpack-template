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
          <el-tab-pane label="机构信息">
            <div class="padding-15">
              <table class="table table-striped">
              <tbody>
              <tr>
                <td style="width:15%">ID</td>
                <td style="width:35%">{{record.loc_id}}</td>
                <td style="width:15%">名称</td>
                <td style="width:35%">{{record.name}}</td>
              </tr>
              <tr>
                <td>类型</td><td>{{record.type}}</td>
                <td>代码</td><td>{{record.loc_code}}</td>
              </tr>
              </tbody>
            </table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="机构用户列表">
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
          <p class="text-danger">将同时删除该机构的所有下级机构!</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="isShowDeleteConfirm=false">取消</el-button>
            <el-button type="danger" size="mini" @click="deleteItem">确定</el-button>
          </div>
        </el-popover>
        <div class="footer buttons text-center">
          <el-button type="primary" @click="addChild">
            <i class="fa fa-plus"></i> 添加下级机构
          </el-button>
          <el-button type="primary" @click="editItem">
            <i class="fa fa-edit"></i> 修改
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
  import {orgResource} from '../service/resource'

  export default {
    name: 'BaseInfoOrganizationDetail',
    props:['record'] ,
    data(){
      return {
        isShowDeleteConfirm: false ,
        deleteProcessing: false
      }
    },
    methods: {
      closeSidePanel(){
        this.$emit("close");
      } ,
      addChild(){
        this.$emit("addchild" , this.record);
      },
      editItem(){
        this.$emit("edititem" , this.record);
      } ,
      deleteItem(){
        this.deleteProcessing = true;
        orgResource.delete({id:this.record.loc_id})
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
