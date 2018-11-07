<template>
  <div class="side-menu-wrapper">
    <Menu :active-name="$route.name" theme="dark" width="auto" :open-names="['market']" @on-select='selectMenu'>
      <div class="layout-logo-left">
        <img src="../../../assets/images/share-logo.png"/>
      </div>
      <Submenu name="market" class="-left-li">
        <template slot="title">
          <Icon type="ios-navigate"></Icon>
          <span>营销管理</span>
        </template>
        <Menu-item name="coupon">优惠券</Menu-item>
      </Submenu>
    </Menu>
  </div>
</template>
<script>

export default {
  name: 'SideMenu',
  data () {
    return {
      openedNames: []
    }
  },
  methods: {
    selectMenu (name) {
      console.log(name,'name')
      this.$router.push({
        name: name
      })
    }
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  watch: {

  },
  mounted () {

  }
}
</script>
<style lang="less">
  .side-menu-wrapper{
    .layout-logo-left{
      padding: 30px 10px;
      img{
        width: 60%;
      }
    }

    .-left-li{
      text-align: left;
    }
  }
  .menu-title{
    padding-left: 6px;
  }

</style>
