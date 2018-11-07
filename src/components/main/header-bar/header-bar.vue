<template>
  <div class="header-bar">
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <user class="custom-content-con"></user>
  </div>
</template>
<script>
import customBreadCrumb from './custom-bread-crumb/custom-bread-crumb'
import User from "./user/user";
export default {
  name: 'HeaderBar',
  components: {
    User,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.breadCrumbList
    }
  },
  methods: {

  }
}
</script>
<style lang="less">
  .header-bar{
    width: 100%;
    height: 100%;
    position: relative;
    .custom-content-con{
      float: right;
      height: auto;
      padding-right: 20px;
      line-height: 64px;
      & > *{
        float: right;
      }
    }
  }
</style>
