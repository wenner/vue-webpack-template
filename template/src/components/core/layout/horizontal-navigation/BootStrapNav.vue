<template>
  <nav class="page-header navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a data-tooltips="首页" data-tooltips-pos="down" class="navbar-brand tooltips-warning"  href="#">{{appName}} <span style='font-size:12px'>v{{appVersion}}</span></a>
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <template v-for="menu in menus" v-if="menu">

            <li v-if="menu.children"
                v-show="allowShow(menu)"
                :class="{'dropdown':true , 'router-link-active':$route.path.indexOf(menu.rootPath)==0}">
              <a class="dropdown-toggle" data-toggle="dropdown">
                <div class="link-inner">
                  <div>
                    <i :class="'icon '+menu.icon"></i>
                    <span class="caret"></span>
                    <div>{{menu.text}}</div>
                  </div>
                </div>
              </a>
              <ul class="dropdown-menu">
                <template v-for="child in menu.children">
                  <li v-if="child.isDivider" class="divider"></li>
                  <template v-else>
                    <li v-if="child.children" class="dropdown-submenu" :class="{'router-link-active':$route.path.indexOf(child.rootPath)==0}">
                      <a class="dropdown-toggle" data-toggle="dropdown">
                        <i :class="child.icon" v-if="child.icon"></i>
                        {{child.text}}
                      </a>
                      <ul class="dropdown-menu">
                        <template v-for="subChild in child.children">
                          <li v-if="subChild.isDivider" class="divider"></li>
                          <router-link v-else tag="li" :to="subChild">
                            <a><i :class="subChild.icon" v-if="subChild.icon"></i>{{subChild.text}}</a>
                          </router-link>
                        </template>
                      </ul>
                    </li>
                    <router-link v-else :to="child" tag="li">
                      <a><i :class="child.icon" v-if="child.icon"></i>{{child.text}}</a>
                    </router-link>
                  </template>
                </template>
              </ul>
            </li>

            <!--没有下拉菜单-->
            <router-link v-else :to="menu" tag="li" v-show="allowShow(menu)">
              <a>
                <div class="link-inner">
                  <div>
                    <i :class="'icon '+menu.icon"></i>
                    <span>{{menu.text}}</span>
                  </div>
                </div>
              </a>
            </router-link>

          </template>
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <li v-if="allowShow()" :class="{'dropdown':true , 'router-link-active':$route.path.indexOf('/person')==0}">
            <a data-toggle="dropdown">
              <div class="link-inner">
                <div>
                  <i class="icon fa fa-user-circle"></i>
                  <span class="caret"></span>
                  <span>{{$auth.user().truename}}</span>
                </div>
              </div>
            </a>
            <ul class="dropdown-menu">
              <router-link :to="'/person/info'" tag="li"><a>查看个人信息</a></router-link>
              <router-link :to="'/person/password'" tag="li"><a>修改密码</a></router-link>
              <router-link :to="'/person/message'" tag="li"><a>查看我的消息</a></router-link>
              <li role="separator" class="divider"></li>
              <li @click="logout()"><a>退出</a></li>
            </ul>
          </li>
          <li :class="{'dropdown':true}">
            <a data-toggle="dropdown">
              <div class="link-inner">
                <div>
                  <i class="icon glyphicon glyphicon-cog"></i>
                </div>
              </div>
            </a>
            <ul class="dropdown-menu">
              <li @click="setFullscreen()"><a>全屏</a></li>
              <li role="separator" class="divider"></li>
              <li @click="setLayout()"><a>布局</a></li>
              <li @click="setTheme()"><a>主题</a></li>
              <li role="separator" class="divider"></li>
              <li><a>帮助</a></li>
              <li><a>关于本系统</a></li>
            </ul>
          </li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
  </nav>

</template>


<script>
  import moduleManager from 'service/module/manager.js'
  import {APP_NAME , APP_VERSION} from 'service/config.js'

  export default {
    name: 'bootstrap-menu',
    data(){
      return {
        appName: APP_NAME ,
        appVersion: APP_VERSION ,
        menus: moduleManager.menus
      }
    },
    methods: {
      allowShow(menu){
        return true;
        return this.$auth.check();
      } ,
      logout() {
        this.$auth.logout({
          makeRequest: false,
          redirect: {name: 'login'},
          success() {
            console.log('success ' + this.context);
          },
          error() {
            console.log('error ' + this.context);
          }
        });
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  $nav-height: 68px;
  .page-header {
    top:0;
    background-color: #0273d4; //o:0273d4 , hover:0262b4 , active:rgba(255, 255, 255, .2)
    border: 0;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, .3);
    margin-bottom: 0px;
    margin-top:0;
    padding:0;

    .navbar-brand {
      line-height: $nav-height;
      height:$nav-height;
      padding-top:0;
      padding-bottom:0;
      font-size: 32px;
      color: #fff;
      margin-right: 80px;
      text-shadow: 1px 1px 0px #333;
    }
    .navbar-brand:hover {
      color:#ffcc00
    }

    .navbar-nav > li > a {
      padding:0;
      height:$nav-height;
      text-align:center;
      cursor:pointer;
      color: #fff;
      border-bottom: 0 solid #0273d4;//transparent solid 3px;
      transition: border-width .15s ease , border-color .3s, background-color .3s, color .3s;
    }
    .navbar-nav > li > a .link-inner {
      padding:10px;
      min-width:60px;
      height:$nav-height;
      //height:100%;
      //width:100%;
      display:flex;
      flex-direction: row;
      align-items:center;
      justify-content: center;
      font-size:14px;

      .icon {font-size:28px;display:block;margin-bottom:4px}
      .caret {position:absolute;bottom:22px;bottom:1px;left:50%;transform:translateX(-50%);margin-left:0}
    }


    .navbar-nav > li > a .caret {visibility: hidden}
    .navbar-nav > li > a:focus, .navbar-nav > li > a:hover {
      //background-color:#0262b4;
      //text-shadow: 1px 1px 0 #333;
      color: #ffcc00;
      border-bottom: #fff solid 3px
    }
    .navbar-nav > li > a:hover .caret {visibility: visible}
    .navbar-nav > .router-link-active > a, .navbar-nav > .router-link-active > a:focus, .navbar-nav > .router-link-active > a:hover {
      border-bottom: #ffcc00 solid 3px;
      background-color: rgba(255, 255, 255, .2);
      color: #fff
    }
    .navbar-nav > .open > a {
      transition: border-color 0s, background-color 0s, color 0s;
    }
    .navbar-nav > .open > a, .navbar-nav > .open > a:hover {
      color: #ff9900;
      font-weight: bold
    }
    .navbar-nav > .open > a, .navbar-nav > .open > a:focus, .navbar-nav > .open > a:hover {
      background-color: #fff;
      border-bottom: #fff solid 3px
    }
    .navbar-nav > li {
      font-size: 16px;
      border-right1: rgba(255, 255, 255, .2) solid 1px
    }
    .navbar-nav > li:last-child {
      border: 0
    }

    .dropdown-menu {
      border-color: #fff;
      min-width: 180px;
      transition: display 3s;
      //padding:0;border:0
    }
    .dropdown-menu > li > a {
      padding:8px 15px;
      //padding-top: 8px;
      //padding-bottom: 8px

      i.fa , i.icon {
        margin-right:10px;
        width:16px;
        height:16px;
      }
    }
    .dropdown-menu > li.router-link-active, .dropdown-menu > li.router-link-active > a:hover {
      background-color: #ffcc00
    }

    .dropdown-submenu {
      position: relative;
    }
    .dropdown-submenu > .dropdown-menu {
      top: 0;
      left: 100%;
      margin-top: -6px;
      margin-left: -1px;
      -webkit-border-radius: 0 6px 6px 6px;
      -moz-border-radius: 0 6px 6px;
      border-radius: 0 6px 6px 6px;
    }
    .dropdown-submenu:hover > .dropdown-menu {
      display: block;
    }
    .dropdown-submenu > a:after {
      display: block;
      content: " ";
      float: right;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 5px 0 5px 5px;
      border-left-color: #ccc;
      margin-top: 5px;
      margin-right: -10px;
    }
    .dropdown-submenu.router-link-active > a:after {
      border-left-color:#333
    }

    .dropdown-submenu.pull-left {
      float: none;
    }
    .dropdown-submenu.pull-left > .dropdown-menu {
      left: -100%;
      margin-left: 10px;
      -webkit-border-radius: 6px 0 6px 6px;
      -moz-border-radius: 6px 0 6px 6px;
      border-radius: 6px 0 6px 6px;
    }

  }

</style>
