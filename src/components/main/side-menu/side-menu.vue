<template>
  <div class="side-menu-wrapper">
    <Menu :active-name="$route.name" theme="light" width="auto" :open-names="['market']" @on-select='selectMenu'>
      <div class="layout-logo-left">
        <img src="../../../assets/images/share-logo.png"/>
        <div class="-version">1.0</div>
      </div>
      <Submenu name="user" class="-left-li">
        <template slot="title">
          <Icon type="ios-navigate" class="hk-menu-icon"></Icon>
          <span>用户管理</span>
        </template>
        <Menu-item name="userList">用户列表</Menu-item>
      </Submenu>
      <Submenu name="study" class="-left-li">
        <template slot="title">
          <Icon type="ios-navigate" class="hk-menu-icon"></Icon>
          <span>同步学习</span>
        </template>
        <Menu-item name="subject">学科管理</Menu-item>
        <Menu-item name="teachingList">教材管理</Menu-item>
      </Submenu>
      <Submenu name="market" class="-left-li">
        <template slot="title">
          <Icon type="ios-navigate" class="hk-menu-icon"></Icon>
          <span>营销管理</span>
        </template>
        <Menu-item name="coupon">优惠券</Menu-item>
      </Submenu>
      <Submenu name="setting" class="-left-li">
        <template slot="title">
          <Icon type="ios-navigate" class="hk-menu-icon"></Icon>
          <span>设置</span>
        </template>
        <Menu-item name="user-setting">用户管理</Menu-item>
        <Menu-item name="user-role">角色管理</Menu-item>
        <Menu-item name="user-info">个人资料</Menu-item>
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
        width: 40%;
      }

      .-version{
        margin: 0 auto;
        width: 50px;
        background: rgba(235,235,235,1);
        border-radius: 10px;
        color: #b3b5b8;
      }
    }

    .-left-li{
      text-align: left;
    }
    .hk-menu-icon {
      vertical-align: initial;
    }
  }
  .menu-title{
    padding-left: 6px;
  }

</style>
