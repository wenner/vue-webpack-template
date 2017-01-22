<template>
  <div class="view-wrapper header-sidenav" layout="column">
    <div class="view-header has-shadow1">
      <div class="view-header-content" layout="row">
        <div>
          <span class="title">
            <i class="fa fa-reorder"></i> 角色管理
          </span>
        </div>
        <div class="text-right" self="size-x1">
          <div class="tool">
            <el-button type="primary" class="inline-tool-item" @click="addItem">
              <i class="fa fa-plus"></i> 添加
            </el-button>
            <el-dropdown trigger="click" @command="handleCommand" class="inline-tool-item">
              <el-button type="info" :disabled="!currentRecord">
                操作<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="el-op-menu">
                <el-dropdown-item command="edit"><span class="fa fa-edit"></span>编辑</el-dropdown-item>
                <el-dropdown-item command="delete"><span class="fa fa-remove"></span> 删除</el-dropdown-item>
                <el-dropdown-item :divided="true"></el-dropdown-item>
                <el-dropdown-item command="privilege"><span class="fa fa-user-secret"></span> 设置角色权限</el-dropdown-item>
                <el-dropdown-item :divided="true"></el-dropdown-item>
                <el-dropdown-item command="toggle"><span class="fa fa-key"></span> 停用/启用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button class="inline-tool-item">
              <i class="fa fa-file-excel-o"></i> 导出
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="view-body" layout="row">
      <div class="view-body-inner">
        <div class="view-content" layout="column">
          <el-table
            class="flex extjs"
            v-loading="isLoading"
            element-loading-text="角色加载中"
            highlight-current-row stripe
            :data="records"
            :row-key="primaryKey"
            :current-row-key="currentRowKey"
            @row-click="onRowClick"
          >
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="角色名称" width="150" style="font-weight:bold"></el-table-column>
            <el-table-column prop="code" label="代码" width="100"></el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
            <el-table-column align="center" label="操作" width="170">
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
                      <el-dropdown-item command="privilege"><span class="fa fa-user-secret"></span> 设置角色权限</el-dropdown-item>
                      <el-dropdown-item :divided="true"></el-dropdown-item>
                      <el-dropdown-item command="toggle"><span class="fa fa-key"></span> 停用/启用</el-dropdown-item>
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

  import {roleResource , treeLoader} from '../service/resource.js'

  import Form from './form.vue'
  import Privilege from './privilege.vue'

  export default {
    name: 'BaseInfoRole',
    computed: {
      currentRowKey(){
        return this.currentRecord ? this.currentRecord[this.primaryKey] : "";
      }
    },
    data(){
      return {
        //列表加载
        isLoading: false,
        //记录列表
        records: [],
        //当前选择记录
        currentRecord: null,
        primaryKey: "r_id",

        //是否显示右边Panel
        isShowSide: false,
        currentSideComponent: null,
        //要在表单中处理的记录
        formRecord: null ,

        //权限列表
        privilegeTree:[]

      }
    },
    mounted(){
      this.loadData();
      //this.loadPrivilege();
    },
    methods: {
      loadData(){
        this.currentRecord = null;
        this.isLoading = true;
        roleResource.query()
          .then(res => {
            this.isLoading = false;
            this.records = res.data;
          })
          .catch(err => {
            this.isLoading = false;
          });
      },
      loadPrivilege(){
        treeLoader.privilege()
          .then(res => {
            this.privilegeTree = res.data.tree;
          })
          .catch(err => {

          });
      } ,
      onRowClick(record){
        this.currentRecord = record;
      },
      handleCommand(command){
        if (!command || !this.currentRecord) return;
        var r = this.currentRecord;
        switch (command) {
          case "edit":
            this.editItem(r);
            break;
          case "delete":
            this.confirmDelete(r);
            break;
          case "toggle":
            this.toggleStatus(r);
            break;
          case "privilege":
            this.editPrivilege(r);
            break;
        }
      },
      closeSidePanel(){
        this.isShowSide = false;
      },
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
      afterSave(record, isEditing){
        this.closeSidePanel();
        //如果是新添加的,则打开用户角色panel
        if (!isEditing) {
          this.records.push(record);
          setTimeout(()=> {
            this.currentRecord = record;
            this.editPrivilege(record);
          }, 0)
        } else {
          var oldRecord = _.find(this.records, {"r_id": record.r_id});
          if (oldRecord) {
            _.extend(oldRecord, record);
          }
        }
      },
      confirmDelete(record){
        this.$confirm("要删除记录 " + record.name + " 的信息么?", "删除确认", {
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
        roleResource.delete({id: record.r_id})
          .then(res=> {
            _.remove(this.records, record);
            this.currentRecord = null;
            Vue.set(record, "loading", null);
          })
          .catch(err=> {
            Vue.set(record, "loading", null);
          });
      },

      toggleStatus(record){
        Vue.set(record, "loading", "设置中");
        roleResource.toggleStatus({id: record.r_id}, null)
          .then(res=> {
            Vue.set(record, "loading", null);
          })
          .catch(err=> {
            Vue.set(record, "loading", null);
          });
      },
      editPrivilege(record){
        this.isShowSide = true;
        this.currentSideComponent = Privilege;
        this.formRecord = this.currentRecord;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .el-tree {
    border: 0;
  }
</style>
