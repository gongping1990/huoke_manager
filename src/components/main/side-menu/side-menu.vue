<template>
  <div class="side-menu-wrapper">
    <Menu ref="sideMenu" :active-name="$route.name" theme="light" width="auto" :open-names="openNowName"
          @on-select='selectMenu'>
      <div class="layout-logo-left">
        <img src="../../../assets/images/share-logo.png"/>
        <div class="-version">1.0</div>
      </div>
      <div class="-left-li -left-title">
        当前系统：
        <span class="-title-name g-cursor" @click="closeModal">
          {{systemName}} <Icon type="md-swap"/>
        </span>
      </div>
      <div v-if="roleType == '1'">
        <Submenu name="dataStatistics" class="-left-li">
          <template slot="title">
            <Icon type="ios-stats" class="hk-menu-icon"/>
            <span>数据统计</span>
          </template>
          <Menu-item name="userData">用户数据</Menu-item>
          <Menu-item name="transactionData">交易数据</Menu-item>
          <Menu-item name="commodityData">商品数据</Menu-item>
        </Submenu>
        <Submenu name="market" class="-left-li">
          <template slot="title">
            <Icon type="logo-usd" class="hk-menu-icon"></Icon>
            <span>营销管理</span>
          </template>
          <Menu-item name="aloneBuy">单独购</Menu-item>
          <Menu-item name="groupLesson">拼课</Menu-item>
          <Menu-item name="friendHelp">好友助力</Menu-item>
          <Menu-item name="limitedTimeSpikeList">限时秒杀</Menu-item>
          <Menu-item name="active">新人礼包</Menu-item>
          <Menu-item name="coupon">优惠券</Menu-item>
        </Submenu>
        <Submenu name="orderManager" class="-left-li">
          <template slot="title">
            <Icon type="ios-document" class="hk-menu-icon"/>
            <span>订单管理</span>
          </template>
          <Menu-item name="orderList">订单列表</Menu-item>
        </Submenu>
        <Submenu name="course" class="-left-li">
          <template slot="title">
            <Icon type="ios-book" class="hk-menu-icon"/>
            <span>课程管理</span>
          </template>
          <Menu-item name="courseType">课程分类</Menu-item>
          <Menu-item name="courseList">课程列表</Menu-item>
        </Submenu>
        <Submenu name="operate" class="-left-li">
          <template slot="title">
            <Icon type="md-trophy" class="hk-menu-icon"></Icon>
            <span>运营管理</span>
          </template>
          <Menu-item name="topBar">topBar管理</Menu-item>
          <Menu-item name="bannerList">banner管理</Menu-item>
          <Menu-item name="trusteeship">托管管理</Menu-item>
          <Menu-item name="channelManagement">渠道管理</Menu-item>
          <Menu-item name="operationalLocation">运营位管理</Menu-item>
          <Menu-item name="pushWindow">活动推送</Menu-item>
          <Menu-item name="homeRecommend">首页推荐</Menu-item>
        </Submenu>
        <Submenu name="message" class="-left-li">
          <template slot="title">
            <Icon type="ios-chatbubbles" class="hk-menu-icon"></Icon>
            <span>消息管理</span>
          </template>
          <Menu-item name="wechat_news">微信推送消息</Menu-item>
          <Menu-item name="custom_wechat_news">自定义微信消息</Menu-item>
          <Menu-item name="custom_wechat_news_other">自定义微信消息(第三方)</Menu-item>
          <Menu-item name="sms_news">短信推送消息</Menu-item>
          <Menu-item name="custom_sms_news">自定义短信消息</Menu-item>
        </Submenu>
        <Submenu name="user" class="-left-li">
          <template slot="title">
            <Icon type="ios-contacts" class="hk-menu-icon"/>
            <span>用户管理</span>
          </template>
          <Menu-item name="userList">用户列表</Menu-item>
          <Menu-item name="virtualUser">虚拟用户</Menu-item>
        </Submenu>
        <Submenu name="feedback" class="-left-li">
          <template slot="title">
            <Icon type="ios-help-circle" class="hk-menu-icon"></Icon>
            <span>用户反馈</span>
          </template>
          <Menu-item name="userFeedback">用户反馈</Menu-item>
          <Menu-item name="messageManagement">留言审核</Menu-item>
          <Menu-item name="customerService">客服管理</Menu-item>
        </Submenu>
        <Submenu name="setting" class="-left-li">
          <template slot="title">
            <Icon type="md-settings" class="hk-menu-icon"></Icon>
            <span>设置</span>
          </template>
          <Menu-item name="user-setting">用户管理</Menu-item>
          <Menu-item name="user-role">角色管理</Menu-item>
          <Menu-item name="user-info">个人资料</Menu-item>
        </Submenu>
      </div>

      <div v-if="roleType == '2'" >
        <Submenu name="dataStatistics" class="-left-li">
          <template slot="title">
            <Icon type="ios-stats" class="hk-menu-icon"/>
            <span>数据统计</span>
          </template>
          <Menu-item name="userData2">用户数据</Menu-item>
          <Menu-item name="productData">产品数据</Menu-item>
        </Submenu>
        <Submenu name="study" class="-left-li">
          <template slot="title">
            <Icon type="ios-school" class="hk-menu-icon"></Icon>
            <span>同步学习</span>
          </template>
          <Menu-item name="subject">学科管理</Menu-item>
          <Menu-item name="teachingList">教材管理</Menu-item>
        </Submenu>
        <Submenu name="user" class="-left-li">
          <template slot="title">
            <Icon type="ios-contacts" class="hk-menu-icon"/>
            <span>用户管理</span>
          </template>
          <Menu-item name="userList2">用户列表</Menu-item>
        </Submenu>
        <Submenu name="feedback" class="-left-li">
          <template slot="title">
            <Icon type="ios-help-circle" class="hk-menu-icon"></Icon>
            <span>留言管理</span>
          </template>
          <Menu-item name="userFeedback2">用户反馈</Menu-item>
        </Submenu>
      </div>
      <div v-if="roleType == '3'" >
        <Submenu name="dataStatistics" class="-left-li">
          <template slot="title">
            <Icon type="ios-stats" class="hk-menu-icon"/>
            <span>数据统计</span>
          </template>
          <Menu-item name="columnData">栏目数据</Menu-item>
        </Submenu>
        <Submenu name="content" class="-left-li">
          <template slot="title">
            <Icon type="ios-school" class="hk-menu-icon"></Icon>
            <span>内容管理</span>
          </template>
          <Menu-item name="column">栏目管理</Menu-item>
        </Submenu>
        <Submenu name="user" class="-left-li">
          <template slot="title">
            <Icon type="ios-contacts" class="hk-menu-icon"/>
            <span>用户管理</span>
          </template>
          <Menu-item name="zlkUserList">用户列表</Menu-item>
        </Submenu>
        <Submenu name="operate" class="-left-li">
          <template slot="title">
            <Icon type="ios-help-circle" class="hk-menu-icon"></Icon>
            <span>运营管理</span>
          </template>
          <Menu-item name="zlkBannerList">banner管理</Menu-item>
        </Submenu>
      </div>
      <div v-if="roleType == '4'" >
        <Submenu name="content" class="-left-li">
          <template slot="title">
            <Icon type="ios-school" class="hk-menu-icon"></Icon>
            <span>内容管理</span>
          </template>
          <Menu-item name="teaching">教材列表</Menu-item>
          <Menu-item name="teacher">教师列表</Menu-item>
        </Submenu>
        <Submenu name="user" class="-left-li">
          <template slot="title">
            <Icon type="ios-contacts" class="hk-menu-icon"/>
            <span>用户管理</span>
          </template>
          <Menu-item name="ldUserList">用户列表</Menu-item>
        </Submenu>
        <Submenu name="operate" class="-left-li">
          <template slot="title">
            <Icon type="ios-help-circle" class="hk-menu-icon"></Icon>
            <span>运营管理</span>
          </template>
          <Menu-item name="ldBannerList">banner管理</Menu-item>
          <Menu-item name="contentOperation">内容运营</Menu-item>
        </Submenu>
      </div>
    </Menu>
    <div v-if="isOpenModal">
      <switching-system @closePwdModal="closeModal"></switching-system>
    </div>
  </div>
</template>
<script>

  import SwitchingSystem from "../switchingSystem/switchingSystem";

  export default {
    name: 'SideMenu',
    components: {SwitchingSystem},
    props: ['openName'],
    data() {
      return {
        openNowName: this.openName,
        isOpenModal: false,
        adminType: [],
        systemName: ''
      }
    },
    computed: {
      defaultActive: function () {
        return this.$route.path.replace("/", "");
      },
      roleType() {
        return this.$store.state.nowAdminType
      },

    },
    watch: {
      '$store.state.nowAdminType' (_n,_d) {
        this.systemName = this.adminType[_n-1].name
        this.$router.push('/')
      }
    },
    mounted() {
      this.getAdminList()
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
        }
      });
    },
    methods: {
      getAdminList () {
        let nowId = this.$store.state.nowAdminType
        this.$axios.get("../static/adminList.json").then(response => {
          this.adminType = response.data.resultData
          this.systemName = this.adminType[nowId-1].name
        });
      },
      closeModal() {
        this.isOpenModal = !this.isOpenModal
      },
      selectMenu(name) {
        this.$router.push({
          name: name
        })
      }
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
    .-left-title {
      padding: 14px 24px;
      .-title-name {
        color: #5444E4;
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
