<template>
  <div class="side-menu-wrapper">
    <Menu ref="sideMenu" :active-name="$route.name" theme="light" width="auto" :open-names="openNowName"
          @on-select='selectMenu'>
      <div class="layout-logo-left">
        <img src="../../../assets/images/share-logo.png"/>
        <div class="-version">1.0</div>
      </div>
      <!--<Submenu name="user" class="-left-li">-->
        <!--<template slot="title">-->
          <!--<Icon type="ios-contacts" class="hk-menu-icon" />-->
          <!--<span>用户管理</span>-->
        <!--</template>-->
        <!--<Menu-item name="userList">用户列表</Menu-item>-->
      <!--</Submenu>-->
      <!--<Submenu name="study" class="-left-li">-->
        <!--<template slot="title">-->
          <!--<Icon type="ios-school" class="hk-menu-icon"></Icon>-->
          <!--<span>同步学习</span>-->
        <!--</template>-->
        <!--<Menu-item name="subject">学科管理</Menu-item>-->
        <!--<Menu-item name="teachingList">教材管理</Menu-item>-->
      <!--</Submenu>-->
      <Submenu name="market" class="-left-li">
        <template slot="title">
          <Icon type="logo-usd" class="hk-menu-icon"></Icon>
          <span>营销管理</span>
        </template>
        <Menu-item name="coupon">优惠券</Menu-item>
        <Menu-item name="aloneBuy">单独购</Menu-item>
      </Submenu>
      <Submenu name="operate" class="-left-li">
        <template slot="title">
          <Icon type="ios-text-outline" class="hk-menu-icon"></Icon>
          <span>运营管理</span>
        </template>
        <Menu-item name="topBar">topBar管理</Menu-item>
      </Submenu>
      <!--<Submenu name="setting" class="-left-li">-->
        <!--<template slot="title">-->
          <!--<Icon type="md-settings" class="hk-menu-icon"></Icon>-->
          <!--<span>设置</span>-->
        <!--</template>-->
        <!--<Menu-item name="user-setting">用户管理</Menu-item>-->
        <!--<Menu-item name="user-role">角色管理</Menu-item>-->
        <!--<Menu-item name="user-info">个人资料</Menu-item>-->
      <!--</Submenu>-->
    </Menu>
  </div>
</template>
<script>

  export default {
    name: 'SideMenu',
    props: ['openName'],
    data() {
      return {
        openNowName: this.openName
      }
    },
    methods: {
      selectMenu(name) {
        this.$router.push({
          name: name
        })
        console.log(name,2)
      }
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace("/", "");
      }
    },
    watch: {},
    mounted() {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
        }
      });
    }
  }
</script>
<style lang="less">
  .side-menu-wrapper {
    .layout-logo-left {
      padding: 30px 10px;
      img {
        width: 40%;
      }

      .-version {
        margin: 0 auto;
        width: 50px;
        background: rgba(235, 235, 235, 1);
        border-radius: 10px;
        color: #b3b5b8;
      }
    }

    .-left-li {
      text-align: left;
    }
    .hk-menu-icon {
      vertical-align: initial;
    }
  }

  .menu-title {
    padding-left: 6px;
  }

</style>
