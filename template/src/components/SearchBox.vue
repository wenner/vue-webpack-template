<template>
  <div :class="{'search-box-wrapper':true ,  'input-group':!!addon}">
    <span class="input-group-addon" v-if="addon">{{addon}}</span>
    <input type="text" class="form-control"
           :placeholder="placeholder"
           :value="value"
           @keyup.enter="onEnter"
           @input="onInput">
    <div class="button-wrapper">
      <button class="btn btn-default clear-text-button" v-if="value" @click="onClear">
        <i class="fa fa-close"></i>
      </button><button class="btn btn-default search-button" @click="onSearch" :disabled="!value">
        <i class="fa fa-search"></i>
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'search-box',
    props:['placeholder','value','addon'] ,
    data(){
      return {}
    } ,
    methods:{
      onInput(event) {
        this.updateValue(event.target.value);
      },
      onEnter(event){
        if (!this.value) return;
        this.goSearch(event);
      } ,
      onClear(event){
        this.updateValue("");
        this.goSearch(event);
      } ,
      onSearch(event){
        this.goSearch(event);
      } ,
      updateValue(value){
        this.$emit('input', value);
      },
      goSearch(event){
        this.$emit('search' , event);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search-box-wrapper {
    position: relative;
  }
  .form-control {
  }
  .button-wrapper {
    position:absolute;
    right:1px;
    top:1px;
    bottom:1px;
    border:0;
    //z-index:3;

    .btn {
      height:100%;
    }
    .search-button {
      border-top-left-radius:0;
      border-bottom-left-radius: 0;
      border-width:0 0 0 1px;
    }
    .clear-text-button {
      border-radius: 0;
      border:0;
    }
  }
  .input-group .input-group-addon{
    background-color:#fff
  }
  .input-group .form-control {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    z-index:auto;
  }
</style>
