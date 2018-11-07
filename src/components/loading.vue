<template>
  <div class="p-loading">
    <Spin size="large"></Spin>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .p-loading{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255,255,255,0.3)
  }
</style>
