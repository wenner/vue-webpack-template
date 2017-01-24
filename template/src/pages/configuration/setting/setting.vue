<template>
  <div class="view-wrapper header-sidenav" layout="column">
    <div class="view-header has-shadow1">
      <div class="view-header-content" layout="row">
        <div>
          <span class="title">
            <i class="fa fa-gears"></i> 系统相关设置 <span style="font-size:16px;font-weight:normal">{{currentCatalog ? currentCatalog.name : ""}}</span>
          </span>
        </div>
        <div class="text-right" self="size-x1">
          <div class="tool">

          </div>
        </div>
      </div>
    </div>
    <div class="view-body" layout="row" v-loading="isCatalogLoading" element-loading-text="代码类别加载中">
      <div class="view-side-nav has-shadow left">
        <div class="nav-body">
          <div v-for="catalog , ix in catalogs" class="catalog-item" :class="{'active': currentCatalog == catalog}"
               @click="onCatalogClick(catalog)">
            {{ix+1}}. {{catalog.name}}
          </div>
        </div>
      </div>
      <div class="view-body-inner">
        <div class="view-content" layout="column">
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
  import {codeCatalogResource, codeResource} from '../module/resource.js'

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
        catalogs: [
          {name:"系统状态"} ,
          {name:"邮箱设置"} ,
          {name:"短信相关设置"}
        ],
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
        //this.currentSideComponent = Form;
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
