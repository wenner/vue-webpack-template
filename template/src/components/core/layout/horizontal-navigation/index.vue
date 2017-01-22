<template>
  <div class="horizontal-navigation">
    <BootstrapNav></BootstrapNav>
    <!--<element-menu></element-menu>-->
    <transition
      name="mv"
      mode="out-in"
      enter-active-class="animated fadeIn main-router-enter"
      leave-active-class="animated fadeOut main-router-leave"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  //import ElementNav from './ElementNav.vue'
  import BootstrapNav from './BootStrapNav.vue'

  export default {
    name: 'HorizontalNavigation',
    components: {
      //ElementNav,
      BootstrapNav
    },
    data(){
      return {}
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  $nav-height: 68px;
  .horizontal-navigation {
    height: 100%;
    padding-top: $nav-height;
    overflow: hidden;

    .main-router-leave {
      animation-duration: .4s;
    }
    .main-router-enter {
      animation-duration: .5s;
    }

    .view-content {
        min-height:100%;
        position:relative;
    }

    .fullheight-wrapper {
      height:100%
    }

    .side-fixed {
      height:100%;
      position:fixed;
      top:0;
      bottom:0;
      padding-top:$nav-height;
      //margin-bottom:53px;
      background:#fff;
      border-right:#e6e6e6 solid 1px;
      z-index:10;
    }

    .side-inner {
      height:100%;overflow:auto
    }

    .page-aside {
      border-right:#e3e3e3 solid 1px;
      box-shadow1: 0px 1px 3px #999;
      display:flex;
      flex-direction: column;


      .aside-header {
        padding:15px;
        .title {font-size:28px;font-weight:300;display:block}
        .desc {color:#999;margin:0}
      }
      .aside-content {
        text-align: center;
        padding: 15px;
      }
      .aside-nav {
        flex:1;
        overflow:auto;

        .nav li.divider {
          height: 1px;
          margin: 0px 0;
          overflow: hidden;
          background-color: #e5e5e5;
        }
        .nav li a {
          color:#333;
          padding:15px;
        }
        li.router-link-active a {
          color: #4285f4;
          .fa {color:#4285f4;}
        }
        .nav li .label {
          float: right;
          font-size: 12px;
          font-weight: 300;
          padding: 4px 7px;
        }
        .nav li .fa , .nav li .glyphicon  {
          font-size: 19px;
          vertical-align: middle;
          text-align: center;
          min-width: 19px;
          margin-right: 3px;
          color: #616161;
        }
        .title {
          display: block;
          color: #999;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          margin: 15px 0 0;
          padding: 8px 15px 4px;
        }

      }

    }

    .main-wrapper {
      position:relative;

      .m-header {
        padding:15px;
        min-height:48px;
        border-bottom:#e3e3e3 solid 1px;
        background-color:#fff;


        .title , .title-wrapper .fa {color:#ff9900;font-weight:400;font-size:20px;margin-right:10px;line-height:32px}
        .fa-spin {color:#ccc;}
      }
      .m-content {
        flex: 1 0 0% !important;
        overflow:hidden;
        .m-content-inner {
          height:100%;
          overflow:auto;
          table.table {
            margin-bottom:0
          }
        }
      }
      .m-footer {
        font-size:0; //inline-block 尺寸
        border-top:#e3e3e3 solid 1px;
        padding:10px;

        * {font-size:14px}
        .pagination {
          margin:0
        }
      }
      .el-pager {margin-bottom:0}
    }
  }

</style>
