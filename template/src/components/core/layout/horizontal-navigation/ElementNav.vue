<template>
  <nav class="header">
    <el-row>
      <el-col :span="6" class="logo">交委平台</el-col>
      <el-col :span="12" class="menu-wrapper">
        <el-menu mode="horizontal" router :default-active="$route.path">
          <el-menu-item index="/map">地图</el-menu-item>
          <el-menu-item index="/assets">资产管理</el-menu-item>
          <el-menu-item index="/check">检测数据</el-menu-item>
          <el-submenu index="4">
            <template slot="title">日常养管</template>
            <el-menu-item index="/track">巡查轨迹</el-menu-item>
            <el-menu-item index="/maintain">病害养护记录</el-menu-item>
            <el-menu-item index="/stat">病害统计分析</el-menu-item>
          </el-submenu>
          <el-menu-item index="/ddd">因工占路</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="6" class="menu-wrapper" style="text-align:right;line-height:60px;padding-right:10px">
        <el-dropdown  class="menu-wrapper">
          <el-button type="info">
            让你笑了<i class="el-icon-caret-bottom el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><i class="el-icon-share"></i> 个人信息</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-share"></i> 我的消息</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-share"></i> 修改密码</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-share"></i> 退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </nav>
</template>

<script>
    export default {
        name: 'element-menu',
        data(){
            return {}
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .menu-wrapper {
    font-size: 0; //解决display:inline-block 4px空白
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #0273d4;
    border: 0;
  //box-shadow: 1px 2px 3px rgba(0, 0, 0, .3);
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .4);
    margin-bottom: 0px;

  .logo {
    font-size: 24px;
    color: #fff;
    line-height: 60px;
    padding-left: 20px
  }



  .el-menu--horizontal {
    display: inline-block;
    border-radius: 0;
    background-color: transparent;
  .el-menu-item, .el-submenu .el-submenu__title {
    font-size: 16px;
    color: #fff;
    border-bottom-width: 3px;
  }
  .el-submenu .el-menu-item {
    color:#0273d4;
    border-bottom:0
  }
  .el-menu-item:hover, .el-submenu__title:hover {
    background-color: #0262b4;
    border-color: #fff;
    color:#fff
  }
  > .el-menu-item.is-active, .el-submenu.is-active .el-submenu__title {
      border-color: #ffcc00;
    //color:#20a0ff;
      background-color: rgba(255, 255, 255, .2)
    }
  .el-submenu__icon-arrow {color:#fff;font-weight:normal;font-size:6px}
  }
  }
</style>
