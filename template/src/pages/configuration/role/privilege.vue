<template>
  <div class="side-panel right width-40 ">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">设置角色{{record.name}}权限</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <div class="body" self="size-x1">
          <div class="body-inner">
            <!--这里需要check-strictly,否则,如果再次设置,如果选中父节点,就会直接选中所有节点-->
            <el-tree v-if="dataTree.length>0" ref="privilegeTree"
                     class="baseinfo-org-tree has-line"
                     show-checkbox
                     node-key="pri_id"
                     :check-strictly="true"
                     :expand-on-click-node="false"
                     :data="dataTree"
                     :highlight-current="true"
                     :render-content="renderContent"
                     :default-expand-all="true"
                     :default-checked-keys="selectionIds"
                     @check-change="onCheckChange"></el-tree>
          </div>
        </div>
        <div class="footer buttons text-center">
          <el-button type="primary" @click="save" :disabled="selectionIds.length == 0" :loading="saveProcessing">
            <i class="fa fa-floppy-o" v-if="!saveProcessing"></i> 保存角色的权限列表
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog title="设置权限范围" v-model="isShowScope" custom-class="privilege-range-dialog">
      <p>请选择角色对该权限的操作范围</p>
      <div v-for="s in scopes" style="padding-left:20px;">
        <el-radio class="radio" v-model="currentScope" :label="s.id">{{s.range_desc}}</el-radio>
      </div>
      <div v-if="scopes && scopes.length == 0">没有任务可选操作范围!</div>
      <div slot="footer" class="dialog-footer" v-if="scopes && scopes.length>0">
        <el-button @click="closeRangeDialog">取 消</el-button>
        <el-button type="primary" @click="saveRange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/jsx">
  import {treeLoader, roleResource, privilegeResource} from '../service/resource.js'
  import * as _ from 'lodash'

  export default {
    name: 'BaseInfoRolePrivilege',
    props: ['record'],
    data(){
      return {
        dataList: [],
        dataTree: [],
        /** 角色当前的权限 */
        selectionIds: [],
        /** 是否显示权限范围选择窗口 */
        isShowScope: false,
        /** 权限范围列表*/
        scopes: [],
        /** 当前修改范围权限的权限记录*/
        currentPrivilege: null,
        /** 当前要修改权限范围的所选范围的ID*/
        currentScope: 0 ,

        saveProcessing: false
      }
    },
    mounted(){
      this.loadPrivilege();
    },
    methods: {
      /**
       * 读取1. 权限列表 , 2. 所有权限可选范围 3. 角色对应的权限
       */
      loadPrivilege(){
        var getPrivileges = treeLoader.privilege();
        var getRanges = privilegeResource.allRanges();
        var getRolePrivileges = roleResource.privilege({id:this.record.r_id});
        var getRolePrivileges1 = [
          //{pri_id: 87} ,
          //{pri_id: 179, scope: 2}
        ];
        Promise.all([getPrivileges, getRanges, getRolePrivileges])
          .then(values => {
            var privileges = values[0];
            var ranges = values[1].data;
            var rolePrivileges = values[2].data;
            var dataList = privileges.data;
            _.each(dataList, (n)=> {
              n.scope = 0;
              n.scopeName = "";
              n.scopes = _.filter(ranges, {"pri_id": n.pri_id}) || [];
              var rolePrivilege = _.find(rolePrivileges, {'pri_id': n.pri_id});
              if (rolePrivilege) {
                n.scope = rolePrivilege.scope || 0;
                n.scopeName = (_.find(n.scopes , {id: n.scope}) || {})['range_desc'];
                this.selectionIds.push(n.pri_id);
              }
            });
            this.dataList = dataList;
            this.dataTree = privileges.data.tree;
          })
          .catch(err => {
            console.log(err)
            //console.log(err.body.Message)
          });
      },
      closeSidePanel(){
        this.$emit("close");
      },

      renderContent(h, context){
        let data = context.data;
        let scopeOperator;
        if (data.hasscope == '1' && _.indexOf(this.selectionIds, data.pri_id) > -1) {
          scopeOperator =
            <div>
              <span>{data.scopeName}</span>
              <el-button style='margin-left:10px;margin-right:10px' type="text" size="small" icon="edit"
                         onClick={this.editScope.bind(this,data)}>设置
              </el-button>
            </div>
        } else {
          scopeOperator = ("");
        }
        return (
          <div class="tree-node-content" layout="row">
            <div self="size-x1">{data.pri_id} {data.name}</div>
            <div style="padding:0;border:0">
              {scopeOperator}
            </div>
          </div>
        );
      },
      /**
       * tree checkbox 点击事件
       */
      onCheckChange(record, checked){
        if (checked) {
          var hasScope = record.hasscope == "1";
          if (hasScope) {
            var scopes = record.scopes || [];
            if (scopes.length > 0) {
              var scope = scopes[0];
              record.scope = scope.id;
              record.scopeName = scope.range_desc;
            } else {
              record.scope = 0;
              record.scopeName = "";
            }
          }
        }
        this.selectionIds = this.$refs.privilegeTree.getCheckedKeys();
      },
      /**
       * 设置权限范围
       */
      editScope(record){
        var hasScope = record.hasscope == "1";
        if (hasScope) {
          this.isShowScope = true;
          this.scopes = record.scopes || [];
          this.currentPrivilege = record;
          this.currentScope = record.scope;
        }
      },
      /**
       * 保存所选的权限范围到权限
       */
      saveRange(){
        var scope = _.find(this.scopes, {id: this.currentScope});
        if (scope) {
          this.currentPrivilege.scope = scope.id;
          this.currentPrivilege.scopeName = scope.range_desc;
          this.closeRangeDialog();
        } else {
          this.$notify("选择的权限范围无效!", "错误");
        }
      },
      /**
       * 关闭权限范围设置的窗口
       */
      closeRangeDialog(){
        this.isShowScope = false;
        //this.scopes = null;
        //this.currentPrivileges = null;
      },
      /**
       * 保存所选的角色权限
       * 传递格式
       * [{r_id:1 , pri_id:1 , scope:0 , operate:0}]
       */
      save(){
        this.saveProcessing = true;
        var role_id = this.record.r_id;
        var selectedRecords = this.$refs.privilegeTree.getCheckedNodes();
        var items = [];
        _.each(selectedRecords , (r)=>{
          items.push({pri_id:r.pri_id , scope: r.scope || 0});
          var node = r;
          while (node.parentid != 0 && _.findIndex(items , {pri_id:node.parentid})==-1){
            node = _.find(this.dataList , {pri_id: node.parentid});
            if (node){
              items.push({pri_id:node.pri_id , scope:node.scope || 0});
            }
          }
        });
        items.sort((x , y)=>{return x.pri_id-y.pri_id});
        var ranges = _.map(items , item => {
          return {r_id: role_id , pri_id:item.pri_id , operate:0 , scope:item.scope};
        });

        roleResource.savePrivilege({id:this.record.r_id} , {rolepris:ranges})
          .then(res => {
            this.saveProcessing = false;
            this.$message({
              message: "角色的权限信息设置成功!"
            });
            this.closeSidePanel();
          })
          .catch(err => {
            this.saveProcessing = false;
//            this.$notify({
//              title: "错误" ,
//              message: err.body.Message ,
//              type:"error"
//            });
          });


      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .el-tree {
    border: 0;
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .privilege-range-dialog {
    width: 20%;
    right: 10%;
    left: auto;
    transform: none;

    .el-dialog__body {
      padding: 10px 20px;
    }
  }
</style>
