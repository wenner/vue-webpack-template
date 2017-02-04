<template>
  <div class="view-wrapper header-sidenav" layout="column">
    <div class="view-header has-shadow" v-if="$route.name.split('.').length < 3">
      <div class="view-header-content" layout="row">
        <div>
          <span class="title">
            <i :class="icon"></i> {{title}}
          </span>
        </div>
      </div>
    </div>
    <div class="view-body" layout="row">
      <div class="view-body-inner">
        <div class="view-content padding-30 text-center">
          <h1 style="font-size:60px;color:red">Coming Soon...</h1>
          <div style="color:#ccc;margin-top:60px">
            <span style='display:inline-block;'>path: <b>{{$route.path}}</b></span>
            <span style='display:inline-block;margin-left:20px'>title: <b>{{title}}</b></span>
            <span style='display:inline-block;margin-left:20px' v-for="item,key in meta">
              {{key}}: <b>{{item}}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'EmptyPage',
    computed: {
      title(){
        let title = [];
        _.each(this.$route.matched , function(n){
          title.push(n.meta ? n.meta.text : "");
        });
         return title.join(" - ");
      } ,
      icon(){
        return (this.$route.meta || {icon:"fa fa-home"}).icon;
      } ,
      meta(){
        return this.$route.meta || {};
      }
    } ,
    data(){
      return {
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
