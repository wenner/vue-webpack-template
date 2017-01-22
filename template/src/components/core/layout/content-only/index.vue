<template>
  <div class="content-only">
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
      name: 'ContentOnly',
      data(){
            return {}
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content-only {
    min-height:100%;
    height:100%;
  }
  //body {padding-top:0 !important}

</style>
