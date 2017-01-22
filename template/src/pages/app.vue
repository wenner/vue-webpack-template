<template>
  <div id="app">
    <template v-if="$auth.ready() && loaded">
      <content-only v-if="layout.type=='content-only'"></content-only>
      <horizontal-navigation v-if="layout.type=='horizontal-navigation'"></horizontal-navigation>
      <vertical-navigation v-if="layout.type=='vertical-navigation'"></vertical-navigation>
    </template>
    <template v-else>
      <div class="loader-backdrop">
        <!-- Loader -->
        <div class="loader">
          <div class="bounce-1"></div>
          <div class="bounce-2"></div>
        </div>
        <!-- /loader -->
      </div>
    </template>

  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  import ContentOnly from '../components/core/layout/content-only'
  import HorizontalNavigation from '../components/core/layout/horizontal-navigation'
  import VerticalNavigation from '../components/core/layout/vertical-navigation'

  export default {
    name: 'app',
    computed: mapGetters({
      layout: 'layout'
    }),
    data(){
      return {
        loaded: true
      }
    },
    components: {
      ContentOnly,
      HorizontalNavigation,
      VerticalNavigation
    },
    ready() {
      setTimeout(() => {this.loaded = true}, 200);
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" src="assets/css/app.scss"></style>



