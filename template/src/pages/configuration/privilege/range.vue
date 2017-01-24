<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">设置权限 {{record.name}} 的操作范围</span>
          <div self="size-x1" class="tool text-right">
            <el-button type="info" size='small' @click="addItem()">
              <i class="fa fa-plus"></i> 添加记录
            </el-button>
            <el-button size='small' @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </el-button>
          </div>
        </div>
        <div class="body" self="size-x1" v-loading="isLoading" element-loading-text="读取操作范围列表">
          <div class="body-inner padding">
          </div>
        </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {privilegeResource} from '../module/resource'

  export default {
    name: 'BaseInfoPrivilegeRange',
    props: ['record'] ,
    data(){
      return {
        isLoading: false
      }
    } ,
    mounted(){
      this.loadRange();
    } ,
    methods:{
      loadRange(){
        privilegeResource.range()
          .then(res => {

          })
          .catch(err => {

          });
      } ,
      closeSidePanel(){
        this.$emit("close" , true);
      } ,
      addItem(){

      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
