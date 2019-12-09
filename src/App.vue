<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  html, body {
    overflow: hidden;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }

  .ivu-form .ivu-form-item-label {
    color: #B3B5B8;
  }

  .ivu-input-number {
    width: 100%;
  }

  input::-webkit-input-placeholder {
    color: #c5c8ce;
  }

  :root {
    --main-bg-color: red;
    --mian-padding: 150px;
    --main-font-size: 20px;
  }
</style>
