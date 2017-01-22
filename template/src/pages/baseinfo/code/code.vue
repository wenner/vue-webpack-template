<template>
  <div class="view-wrapper header-sidenav" layout="column">
    <div class="view-header has-shadow1">
      <div class="view-header-content" layout="row">
        <div>
          <span class="title">
            <i class="fa fa-codepen"></i> 数据代码管理 <span style="font-size:16px;font-weight:normal">{{currentCatalog ? currentCatalog.name : ""}}</span>
          </span>
        </div>
        <div class="text-right" self="size-x1">
          <div class="tool">
            <el-button type="info" class="inline-tool-item" :disabled="!currentCatalog" @click="addItem">
              <i class="fa fa-plus"></i> 添加{{currentCatalog ? currentCatalog.name : ""}}代码值
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="view-body" layout="row" v-loading="isCatalogLoading" element-loading-text="代码类别加载中">
      <div class="view-side-nav has-border left">
        <div class="nav-header has-border">
          <div class="title">代码类别</div>
        </div>
        <div class="nav-body">
          <div v-for="catalog , ix in catalogs" class="catalog-item" :class="{'active': currentCatalog == catalog}"
               @click="onCatalogClick(catalog)">
            {{ix+1}}. {{catalog.name}}
          </div>
        </div>
      </div>
      <div class="view-body-inner">
        <div class="view-content" layout="column">
          <el-table
            v-loading="isLoading"
            element-loading-text="代码值加载中"
            :data="records"
            row-key="code_id"
            highlight-current-row
            :current-row-key="currentRowKey"
            @row-click="onRowClick"
            class="flex extjs"
            border stripe>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="code_name" label="名称" width="150" style="font-weight:bold"></el-table-column>
            <el-table-column prop="code_value" label="值" width="150"></el-table-column>
            <el-table-column prop="code_description" label="说明"></el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template scope="scope">
                <el-button type="text" size="mini" :loading="true" v-if="scope.row.loading">{{scope.row.loading}}
                </el-button>
                <div class="buttons" v-else>
                  <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="confirmDelete(scope.row)">删除</el-button>
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
        :catalog="currentCatalog"
        @aftersave="afterSave"
        @close="closeSidePanel"
      ></component>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import * as _ from 'lodash'
  import {codeCatalogResource, codeResource} from '../service/resource.js'
  import Form from './form.vue'

  export default {
    name: 'BaseInfoCode',
    computed: {
      currentRowKey(){
        return this.currentRecord ? this.currentRecord.code_id : "";
      }
    },
    data(){
      return {
        //树加载
        isCatalogLoading: false,
        //列表加载
        isLoading: false,
        //记录列表
        records: [],
        //当前选择用户
        currentRecord: null,
        //代码类别
        catalogs: [],
        //当前选中的代码类别
        currentCatalog: "",
        //是否显示右边Panel
        isShowSide: false,
        currentSideComponent: null,
        //要在表单中处理的记录
        formRecord: null
      }
    },
    mounted(){
      this.loadCatalog();
    },
    methods: {
      loadCatalog(){
        this.isCatalogLoading = true;
        codeCatalogResource.query()
          .then(res=> {
            this.isCatalogLoading = false;
            this.catalogs = res.data;
            if (this.catalogs.length == 0) return;
            this.currentCatalog = this.catalogs[0];
            this.loadData(this.currentCatalog);
          })
          .catch(err => {
            this.isCatalogLoading = false;

          });
      },
      onCatalogClick(data){
        this.currentCatalog = data;
        this.loadData(data);
      },
      loadData(parent){
        var id = parent.id;
        this.currentRecord = null;
        this.isLoading = true;
        codeResource.query({catalog_id: id})
          .then(res => {
            this.isLoading = false;
            this.records = res.data;
          })
          .catch(err => {
            this.isLoading = false;
          });
      },
      onRowClick(record){
        this.currentRecord = record;
      },
      closeSidePanel(){
        this.isShowSide = false;
      },
      showForm(record){
        if (!this.currentCatalog) return;
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
        if (!isEditing) {
          this.records.push(record);
          setTimeout(()=> {
            this.currentRecord = record;
          }, 0)
        } else {
          var oldRecord = _.find(this.records, {"code_id": record.code_id});
          if (oldRecord) {
            _.extend(oldRecord, record);
          }
        }
      },
      confirmDelete(record){
        this.$confirm("要删除记录 " + record.code_name + " 么?", "删除确认", {
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
        codeResource.delete({id: record.code_id})
          .then(res=> {
            _.remove(this.records, record);
            this.currentRecord = null;
            Vue.set(record, "loading", null);
          })
          .catch(err=> {
            Vue.set(record, "loading", null);
          });
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .catalog-item {
    padding: 15px;
    border-bottom: #eee solid 1px;
    cursor: pointer;
  }

  .catalog-item:hover {
    background-color: #eee;
  }

  .catalog-item.active {
    background-color: #e8f4ff;
    font-weight: bold
  }
</style>
