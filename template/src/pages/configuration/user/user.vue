<template>
  <div class="view-wrapper header-sidenav" layout="column">
    <div class="view-header has-shadow1">
      <div class="view-header-content" layout="row">
        <div>
          <span class="title">
            <i class="fa fa-sitemap"></i> 用户管理
          </span>
        </div>
        <div class="text-right" self="size-x1">
          <div class="tool">
            <el-button type="info" class="inline-tool-item" @click="addItem">
              <i class="fa fa-plus"></i> 添加用户
            </el-button>
            <el-dropdown trigger="click" @command="handleCommand" class="inline-tool-item">
              <el-button type="info" :disabled="!currentUser">
                操作<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="el-op-menu">
                <el-dropdown-item command="edit"><span class="fa fa-edit"></span>编辑</el-dropdown-item>
                <el-dropdown-item command="delete"><span class="fa fa-remove"></span> 删除</el-dropdown-item>
                <el-dropdown-item :divided="true"></el-dropdown-item>
                <el-dropdown-item command="role"><span class="fa fa-user-secret"></span> 设置用户角色</el-dropdown-item>
                <el-dropdown-item :divided="true"></el-dropdown-item>
                <el-dropdown-item command="reset"><span class="fa fa-key"></span> 重置密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button class="inline-tool-item">
              <i class="fa fa-export"></i> 导出
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="view-body" layout="row" v-loading="isTreeLoading" element-loading-text="机构加载中">
      <div class="view-side-nav has-border left">
        <div class="nav-header has-border">
          <div class="title">机构列表</div>
        </div>
        <div class="nav-body">
          <el-tree v-if="orgTree.length>0" ref="orgTree"
                   class="baseinfo-org-tree"
                   node-key="loc_id"
                   :current-node-key="currentNodeKey"
                   :props="{label:'name' , children:'children'}"
                   :expand-on-click-node="false"
                   :data="orgTree"
                   :highlight-current="true"
                   :default-expand-all="true"
                   @node-click="onOrgNodeClick"></el-tree>
        </div>
      </div>
      <div class="view-body-inner">
        <div class="view-content" layout="column">


          <el-table
            v-loading="isLoading"
            element-loading-text="用户加载中"
            :data="users"
            row-key="user_id"
            highlight-current-row
            :current-row-key="currentRowKey"
            @row-click="onRowClick"
            class="flex extjs"
            border stripe>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="登录账号" width="100" style="font-weight:bold"></el-table-column>
            <el-table-column prop="truename" label="用户名称" width="130"></el-table-column>
            <el-table-column prop="loc_name" label="所属机构"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="status" label="状态" width="60" align="center"></el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template scope="scope">
                <el-button type="text" size="mini" :loading="true" v-if="scope.row.loading">{{scope.row.loading}}
                </el-button>
                <div class="buttons" v-else>
                  <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="confirmDelete(scope.row)">删除</el-button>
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-button type="text" class="highlight-on-row-hover el-op-text-button" size="mini">
                      更多<i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" class="el-op-menu">
                      <el-dropdown-item command="edit"><span class="fa fa-edit"></span>编辑</el-dropdown-item>
                      <el-dropdown-item command="delete"><span class="fa fa-remove"></span> 删除</el-dropdown-item>
                      <el-dropdown-item :divided="true"></el-dropdown-item>
                      <el-dropdown-item command="role"><span class="fa fa-user-secret"></span> 设置用户角色</el-dropdown-item>
                      <el-dropdown-item :divided="true"></el-dropdown-item>
                      <el-dropdown-item command="reset"><span class="fa fa-key"></span> 重置密码</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>


    <transition name="rsp">
      <component
        v-if="isShowSide"
        :is="currentSideComponent"
        :record="formRecord"
        @aftersave="afterSave"
        @close="closeSidePanel"
      ></component>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import * as _ from 'lodash'

  import {treeLoader, userResource} from '../_module/resource.js'

  import Form from './form.vue'
  import Role from './role.vue'

  export default {
    name: 'BaseInfoUser',
    computed:{
      currentRowKey(){
        return this.currentUser ? this.currentUser.user_id : "";
      }
    } ,
    data(){
      return {
        //树加载
        isTreeLoading: false,
        //列表加载
        isLoading: false,
        //用户记录列表
        users: [],
        //当前选择用户
        currentUser: null,
        //机构树
        orgTree: [],
        //默认选中的树
        currentNodeKey: "",
        //是否显示右边Panel
        isShowSide: false,
        currentSideComponent: null ,
        //要在表单中处理的记录
        formRecord: null
      }
    },
    mounted(){
      this.loadOrg();
    },
    methods: {
      loadOrg(){
        this.isTreeLoading = true;
        treeLoader.org().then(res=> {
          this.isTreeLoading = false;
          this.orgTree = res.data.tree;
          //this.orgComboData = res.data.comboData;
          this.currentNodeKey = this.orgTree[0].loc_id;
          this.loadData(this.currentNodeKey);
        });
      },
      onOrgNodeClick(data, node){
        this.loadData(data.loc_id);
      },
      loadData(loc){
        this.currentUser = null;
        this.isLoading = true;
        userResource.query({loc_id: loc})
          .then(res => {
            this.isLoading = false;
            this.users = res.data;
          });
      },
      onRowClick(record){
        this.currentUser = record;
      },
      handleCommand(command){
        if (!command || !this.currentUser) return;
        var r = this.currentUser;
        switch (command) {
          case "edit":
            this.editItem(r);
            break;
          case "delete":
            this.confirmDelete(r);
            break;
          case "reset":
            this.confirmResetPassword(r);
            break;
          case "role":
            this.editRole(r);
            break;
        }
      },
      closeSidePanel(){
        this.isShowSide = false;
      } ,
      showForm(record){
        this.currentSideComponent = Form;
        this.formRecord = record;
        this.isShowSide = true;
      },
      addItem(){
        this.showForm();
      },
      editItem(record){
        this.showForm(record);
      },
      afterSave(record , isEditing){
      this.closeSidePanel();
      //如果是新添加的,则打开用户角色panel
      if (!isEditing){
        this.users.push(record);
        setTimeout(()=>{
          this.currentUser = record;
          this.editRole(record);
        },0)
      }else{
        var user = _.find(this.users , {"user_id":record.user_id});
        if (user){
          _.extend(user , record);
        }
      }
    } ,
      confirmDelete(record){
        this.$confirm("要删除用户 " + record.truename + " 的信息么?", "删除确认", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
          .then(action => {
            this.delete(record);
          });
      },
      delete(record){
        Vue.set(record, "loading", "删除中");
        userResource.delete({id: record.user_id})
          .then(res=> {
            _.remove(this.users , record);
            this.currentUser = null;
            Vue.set(record, "loading", null);
          })
          .catch(err=> {
            Vue.set(record, "loading", null);
          });
      } ,
      confirmResetPassword(record){
        this.$confirm("要重置用户 " + record.truename + " 的密码么?", "重置确认", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(action => {
            this.resetPassword(record);
          });
      } ,
      resetPassword(record){
        Vue.set(record, "loading", "重置中");
        userResource.resetPassword({id: record.user_id} , null)
          .then(res=> {
            Vue.set(record, "loading", null);
          })
          .catch(err=> {
            Vue.set(record, "loading", null);
          });
      } ,
      editRole(record){
        this.isShowSide = true;
        this.currentSideComponent = Role;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .el-tree {
    border: 0;
  }
</style>
