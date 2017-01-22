<template>
  <div class="side-panel right width-40">
    <div class="side-panel-inner" layout="column">
      <div self="size-x1" layout="column">
        <div class="header" layout="row center-center">
          <span class="title">设置用户角色</span>
          <div self="size-x1" class="text-right">
            <button class="btn btn-default" @click="closeSidePanel()">
              <span class="fa fa-close"></span>
            </button>
          </div>
        </div>
        <div class="body" self="size-x1">
          <div class="body-inner padding">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'BaseInfoUserRole',
    data(){
      return {}
    } ,
    methods:{
      closeSidePanel(){
        this.$emit("close");
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
