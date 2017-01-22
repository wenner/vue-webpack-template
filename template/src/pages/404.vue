<template>
    <div class="bg">
      <div style="margin:10% 0 0 10%;color:#fff;font-size:32px;font-weight:bold;">
        <div style="font-size:64px;">404</div>
        <div style="font-size:48px">维修中,此路不通!</div>
        <div style="font-size:14px;font-weight:normal;line-height:200%">
          您要打开的地址({{$route.redirectedFrom}})无法访问,请确定是否通过正常方式进入该页面! <br>
          <a style="color:#fff;cursor:pointer" @click="goBack"><i class="fa fa-arrow-circle-left"></i> 返回</a>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    data(){
      return {}
    },
    methods: {
      goBack(){
        console.log(this.$route)
        window.history.go(-1);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bg {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: url(/static/images/404.jpg) right bottom;
    background-size: cover;
  }

  .bg > div > div {
    margin: 6px 0;
  }
</style>
