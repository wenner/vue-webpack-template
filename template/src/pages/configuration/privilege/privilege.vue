<template>
  <div class="view-wrapper header-sidenav" layout="column">
    <div class="view-header">
      <div class="view-header-content">
        <div class="row">
          <div class="col-md-8">
          <span class="title">
            <i class="fa fa-lock"></i> 权限管理
          </span>
          </div>
          <div class="col-md-4 tool text-right">
            <button type="button" class="btn btn-default inline-tool-item">导出</button>
          </div>
        </div>
      </div>
    </div>
    <div class="view-body" layout="row">
      <div class="view-content-wrapper">
        <div class="view-content">
          <div class="view-content-inner" v-loading="isLoading" element-loading-text="数据加载中">
            <el-tree v-if="dataTree.length>0" ref="privilegeTree"
                     class="baseinfo-org-tree has-line"
                     :expand-on-click-node="false"
                     :data="dataTree" :highlight-current="true" :render-content="renderContent"
                     :default-expand-all="true"
                     @node-click="onNodeClick"></el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="view-footer"></div>

    <transition enter-active-class="animated slideInRight animate-enter"
                leave-active-class="animated slideOutRight animate-leave">
      <component v-if="isShowSide"
                 :is="currentView"
                 :record="componentRecord"
                 @addchild="addItem"
                 @edititem="editItem"
                 @editrange="editRange"
                 @aftersave="afterSave"
                 @afterdelete="afterDelete"
                 @afterrange="afterRange"
                 @close="closeSidePanel">

      </component>
    </transition>

  </div>
</template>

<script type="text/jsx">
  import {treeLoader , privilegeResource} from '../module/resource.js'
  import * as _ from 'lodash'

  import FormPanel from './form.vue'
  import DetailPanel from './detail.vue'
  import RangePanel from './range.vue'

  export default {
    name: 'BaseInfoPrivilege',
    components: {
      FormPanel,
      DetailPanel,
      RangePanel
    },
    data(){
      return {
        isShowSide: false,
        isLoading: false,
        dataList: [],
        dataTree: [],

        currentView: DetailPanel,
        currentRecord: null,
        componentRecord: null
      }
    },
    mounted(){
      this.loadData();
    },
    methods: {
      /*读取数据*/
      loadData(){
        this.isLoading = true;
        treeLoader.privilege()
          .then(res=> {
            this.dataList = res.data;
            this.dataTree = res.data.tree;
            this.isLoading = false;
          })
          .catch(err => {
            this.isLoading = false;
          });
      },
      /**
       * 渲染树节点行
       * @param h
       * @param context
       * @returns {JSX}
       */
      renderContent(h, context){
        let data = context.data;
        return (
          <div class="tree-node-content" layout="row">
            <div self="size-x1">{data.name} <span style="color:blue;" >{data.hasscope == "1" ? "操作范围" : ""}</span></div>
            <div style="width:300px;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{data.fullcode}</div>
            <div style="width:90px;text-align:center">{data.type}</div>
          </div>
        );
      },
      showSidePanel(callback){
        this.isShowSide = !this.isShowSide;
        if (!this.isShowSide) {
          setTimeout(()=> {
            var cb = callback.call(this);
            if (cb === false) return;
            this.isShowSide = true;
          }, 200);
        } else {
          callback.call(this);
        }
      },
      closeSidePanel(backToDetail){
        this.showSidePanel(function () {
          if (!backToDetail) return false;
          this.currentView = DetailPanel;
        });
      },
      /**
       * 节点点击事件
       */
      onNodeClick(data, node){
        this.showSidePanel(()=> {
          this.componentRecord = data;
          this.currentView = DetailPanel;
          if (this.currentRecord == data) {
            return false;
          }
          this.currentRecord = data;
          this.isShowSide = true;
        });
      },
      /** 打开编辑表单 */
      openForm(){
        this.showSidePanel(()=> {
          this.currentView = FormPanel;
          this.isShowSide = true;
        });
      } ,
      /** 添加机构 */
      addItem(parent){
        let parentNode = parent && parent.pri_id ? parent : {pri_id:0 , name:"所有权限"};
        this.componentRecord = {
          parentNode: parentNode
        };
        this.openForm();
      } ,
      /** 编辑机构 */
      editItem(record){
        this.componentRecord = record;
        this.openForm();
      } ,
      /** 保存成功后事件 */
      afterSave(record , isEditing){
        this.closeSidePanel();
        //this.loadData();
        //TODO: 应该不要重新读取,而是操作树节点
        if (isEditing){
          console.log(this.dataList)
          let oldRecord = _.find(this.dataList , {pri_id: record.pri_id});
          console.log(oldRecord)
          _.extend(oldRecord , record);
        }else{
          var parentNode = _.find(this.dataList , {pri_id: record.parentid});
          if (!parentNode) return;
          if (!parentNode.children) parentNode.children = [];
          parentNode.children.push(record);
        }
      } ,
      /** 设置权限范围**/
      editRange(record){
        this.componentRecord = record;
        this.showSidePanel(()=> {
          this.currentView = RangePanel;
        });
      } ,
      afterRange(){

      },
      /** 删除成功后事件 */
      afterDelete(record){
        if (!record) return;
        this.closeSidePanel();
        this.loadData();
        //TODO: 应该不要重新读取,而是操作树节点
//        return;
//        let index = _.findIndex(this.dataList , {pri_id: record.pri_id});
//        if (index>-1){
//          this.dataList.splice(index , 1);
//        }
//        this.dataTree.splice(0,1)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .el-tree {
    border: 0;
  }

</style>
