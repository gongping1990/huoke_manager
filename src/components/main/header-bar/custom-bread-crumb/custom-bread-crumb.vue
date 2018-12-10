<template>
  <div class="custom-bread-crumb">
    <Breadcrumb>
      <Breadcrumb-item :to="'/'" v-if="isHome">首页</Breadcrumb-item>
      <Breadcrumb-item v-for="(item, index) of breadcrumbList" :to="{name:item.url,query:$route.query}" :key="index">{{item.name}}</Breadcrumb-item>
    </Breadcrumb>
  </div>
</template>
<script>
  export default {
    name: 'customBreadCrumb',
    computed: {
      breadcrumbList() {
        return this.$route.meta
      },
      isHome() {
        return this.$route.path != '/home'
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
<style lang="less">
  .custom-bread-crumb {
    display: inline-block;
    vertical-align: top;
    float: left;
  }
</style>
