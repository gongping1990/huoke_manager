<template>
  <div class="side-menu-wrapper">{{$route.name}}
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
      <Submenu :name="list.path" class="-left-li" v-for="(list,index) of sideMenuList" :key="index">
        <template slot="title">
          <Icon :type="list.icon" class="hk-menu-icon"/>
          <span>{{list.title}}</span>
        </template>

        <Menu-item :name="item.route" v-for="(item,index1 ) of list.child" :key="index1">{{item.title}}</Menu-item>
      </Submenu>
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
        systemList: {
          '1': '获课学堂',
          '2': '获课语文',
          '4': '资料库',
          '5': '获课朗读',
          '7': '古诗文',
          '8': '同步作文',
        },
        systemIdList: {
          '1': '1',
          '2': '2',
          '4': '4',
          '5': '5',
          '7': '7',
          '8': '8',
        },
        sideMenuList: [],
        systemName: ''
      }
    },
    computed: {
    },
    watch: {
      '$store.state.nowAdminType' (_n,_d) {
        this.systemName = this.systemList[_n]
        this.initAdmin()
        this.$router.push('/')
      }
    },
    mounted() {
      this.getAdminList()
      this.initAdmin()
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
          this.$refs.sideMenu.updateActiveName()
        }
      });
    },
    methods: {
      initAdmin () {
        switch (+this.$store.state.nowAdminType) {
          case 1:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                title: '数据统计',
                icon: 'ios-stats',
                child: [
                  {
                    route: 'userData',
                    title: '用户数据'
                  },
                  {
                    route: 'transactionData',
                    title: '交易数据'
                  },
                  {
                    route: 'commodityData',
                    title: '商品数据'
                  }
                ]
              },
              {
                path: 'market',
                title: '营销管理',
                icon: 'logo-usd',
                child: [
                  {
                    route: 'aloneBuy',
                    title: '单独购'
                  },
                  {
                    route: 'groupLesson',
                    title: '拼课'
                  },
                  {
                    route: 'friendHelp',
                    title: '好友助力'
                  },
                  {
                    route: 'limitedTimeSpikeList',
                    title: '限时秒杀'
                  },
                  {
                    route: 'active',
                    title: '新人礼包'
                  },
                  {
                    route: 'coupon',
                    title: '优惠券'
                  },
                  {
                    route: 'coursePackages',
                    title: '课程套餐'
                  }
                ]
              },
              {
                path: 'orderManager',
                title: '订单管理',
                icon: 'ios-document',
                child: [
                  {
                    route: 'orderList',
                    title: '订单列表'
                  }
                ]
              },
              {
                path: 'course',
                title: '课程管理',
                icon: 'ios-book',
                child: [
                  {
                    route: 'courseType',
                    title: '课程分类'
                  },
                  {
                    route: 'courseList',
                    title: '课程列表'
                  }
                ]
              },
              {
                path: 'operate',
                title: '运营管理',
                icon: 'md-trophy',
                child: [
                  {
                    route: 'topBar',
                    title: 'topBar管理'
                  },
                  {
                    route: 'bannerList',
                    title: 'banner管理'
                  },
                  {
                    route: 'trusteeship',
                    title: '托管管理'
                  },
                  {
                    route: 'channelManagement',
                    title: '渠道管理'
                  },
                  {
                    route: 'operationalLocation',
                    title: '运营位管理'
                  },
                  {
                    route: 'capsule',
                    title: '胶囊位管理'
                  },
                  {
                    route: 'pushWindow',
                    title: '活动推送'
                  },
                  {
                    route: 'homeRecommend',
                    title: '首页推荐'
                  },
                  {
                    route: 'setMeal',
                    title: '套餐管理'
                  }
                ]
              },
              {
                path: 'message',
                title: '消息管理',
                icon: 'ios-chatbubbles',
                child: [
                  {
                    route: 'wechat_news',
                    title: '微信推送消息'
                  },
                  {
                    route: 'custom_wechat_news',
                    title: '自定义微信消息'
                  },
                  {
                    route: 'custom_wechat_news_other',
                    title: '自定义微信消息(第三方)'
                  },
                  {
                    route: 'sms_news',
                    title: '短信推送消息'
                  },
                  {
                    route: 'custom_sms_news',
                    title: '自定义短信消息'
                  }
                ]
              },
              {
                path: 'user',
                title: '用户管理',
                icon: 'ios-contacts',
                child: [
                  {
                    route: 'userList',
                    title: '用户列表'
                  },
                  {
                    route: 'virtualUser',
                    title: '虚拟用户'
                  },
                  {
                    route: 'virtualUser',
                    title: '虚拟用户'
                  }
                ]
              },
              {
                path: 'feedback',
                title: '用户反馈',
                icon: 'ios-help-circle',
                child: [
                  {
                    route: 'userFeedback',
                    title: '用户反馈'
                  },
                  {
                    route: 'messageManagement',
                    title: '评价管理'
                  },
                  {
                    route: 'customerService',
                    title: '客服管理'
                  }
                ]
              },
              {
                path: 'setting',
                title: '设置',
                icon: 'md-settings',
                child: [
                  {
                    route: 'user-setting',
                    title: '用户管理'
                  },
                  {
                    route: 'user-role',
                    title: '角色管理'
                  },
                  {
                    route: 'user-info',
                    title: '个人资料'
                  },
                  {
                    route: 'user-permission',
                    title: '权限列表'
                  }
                ]
              }
            ]
            break
          case 2:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                title: '数据统计',
                icon: 'ios-stats',
                child: [
                  {
                    route: 'userData2',
                    title: '用户数据'
                  },
                  {
                    route: 'productData',
                    title: '产品数据'
                  }
                ]
              },
              {
                path: 'study',
                title: '同步学习',
                icon: 'ios-school',
                child: [
                  {
                    route: 'subject',
                    title: '学科管理'
                  },
                  {
                    route: 'teachingList',
                    title: '教材管理'
                  }
                ]
              },
              {
                path: 'orderManager',
                title: '订单管理',
                icon: 'ios-document',
                child: [
                  {
                    route: 'hkyw_orderList',
                    title: '订单列表'
                  }
                ]
              },
              {
                path: 'user',
                title: '用户管理',
                icon: 'ios-contacts',
                child: [
                  {
                    route: 'userList2',
                    title: '用户列表'
                  }
                ]
              },
              {
                path: 'feedback',
                title: '留言管理',
                icon: 'ios-help-circle',
                child: [
                  {
                    route: 'userFeedback2',
                    title: '用户反馈'
                  }
                ]
              }
            ]
            break
          case 4:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                title: '数据统计',
                icon: 'ios-stats',
                child: [
                  {
                    route: 'columnData',
                    title: '栏目数据'
                  }
                ]
              },
              {
                path: 'content',
                title: '内容管理',
                icon: 'ios-school',
                child: [
                  {
                    route: 'column',
                    title: '栏目管理'
                  }
                ]
              },
              {
                path: 'operate',
                title: '运营管理',
                icon: 'md-trophy',
                child: [
                  {
                    route: 'zlkBannerList',
                    title: 'banner管理'
                  }
                ]
              },
              {
                path: 'user',
                title: '用户管理',
                icon: 'ios-contacts',
                child: [
                  {
                    route: 'zlkUserList',
                    title: '用户列表'
                  }
                ]
              }
            ]
            break
          case 5:
            this.sideMenuList = [
              {
                path: 'content',
                title: '内容管理',
                icon: 'ios-school',
                child: [
                  {
                    route: 'teaching',
                    title: '教材列表'
                  },
                  {
                    route: 'teacher',
                    title: '教师列表'
                  }
                ]
              },
              {
                path: 'operate',
                title: '运营管理',
                icon: 'md-trophy',
                child: [
                  {
                    route: 'ldBannerList',
                    title: 'banner管理'
                  },
                  {
                    route: 'contentOperation',
                    title: '内容运营'
                  }
                ]
              },
              {
                path: 'user',
                title: '用户管理',
                icon: 'ios-contacts',
                child: [
                  {
                    route: 'ldUserList',
                    title: '用户列表'
                  }
                ]
              }
            ]
            break
          case 7:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                title: '数据统计',
                icon: 'ios-stats',
                child: [
                  {
                    route: 'gsw_userData',
                    title: '交易数据'
                  },
                  {
                    route: 'gsw_retainData',
                    title: '留存数据'
                  },
                  {
                    route: 'gsw_channel',
                    title: '渠道管理'
                  }
                ]
              },
              {
                path: 'course',
                title: '课程管理',
                icon: 'ios-school',
                child: [
                  {
                    route: 'gsw_courseInfo',
                    title: '课程信息'
                  },
                  {
                    route: 'courseContent',
                    title: '课程内容'
                  },
                  {
                    route: 'gsw_new_courseInfo',
                    title: '新课程信息'
                  },
                  {
                    route: 'new_courseContent',
                    title: '新课程内容'
                  }
                ]
              },
              {
                path: 'booking',
                title: '预约管理',
                icon: 'md-cafe',
                child: [
                  {
                    route: 'gsw_bookingList',
                    title: '预约列表'
                  }
                ]
              },
              {
                path: 'task',
                title: '作业管理',
                icon: 'md-bookmarks',
                child: [
                  {
                    route: 'gsw_job',
                    title: '作业列表'
                  }
                ]
              },
              {
                path: 'orderManager',
                title: '订单管理',
                icon: 'ios-document',
                child: [
                  {
                    route: 'gsw_orderList',
                    title: '订单列表'
                  },
                  {
                    route: 'gsw_deliverGoods',
                    title: '发货管理'
                  }
                ]
              },
              {
                path: 'operate',
                title: '运营管理',
                icon: 'md-trophy',
                child: [
                  {
                    route: 'gsw_wheelMessage',
                    title: '消息列表'
                  },
                  {
                    route: 'gsw_patchRecord',
                    title: '补卡记录'
                  },
                  {
                    route: 'gsw_qrcode',
                    title: '群二维码'
                  }
                ]
              },
              {
                path: 'user',
                title: '用户管理',
                icon: 'ios-contacts',
                child: [
                  {
                    route: 'gswUserList',
                    title: '用户列表'
                  }
                ]
              }
            ]
            break
          case 8:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                title: '数据统计',
                icon: 'ios-stats',
                child: [
                  {
                    route: 'tbzw_userData',
                    title: '交易数据'
                  },
                  {
                    route: 'tbzw_retainData',
                    title: '留存数据'
                  },
                  {
                    route: 'tbzw_channel',
                    title: '渠道管理'
                  }
                ]
              },
              {
                path: 'course',
                title: '课程管理',
                icon: 'ios-school',
                child: [
                  {
                    route: 'tbzw_courseInfo',
                    title: '课程信息'
                  },
                  {
                    route: 'tbzw_courseContent',
                    title: '课程内容'
                  },
                  {
                    route: 'tbzw_teacher',
                    title: '教师信息'
                  }
                ]
              },
              {
                path: 'booking',
                title: '预约管理',
                icon: 'md-cafe',
                child: [
                  {
                    route: 'tbzw_bookingList',
                    title: '预约列表'
                  }
                ]
              },
              {
                path: 'task',
                title: '作业管理',
                icon: 'md-bookmarks',
                child: [
                  {
                    route: 'tbzw_job',
                    title: '作业列表'
                  }
                ]
              },
              {
                path: 'orderManager',
                title: '订单管理',
                icon: 'ios-document',
                child: [
                  {
                    route: 'tbzw_orderList',
                    title: '订单列表'
                  },
                  {
                    route: 'tbzw_deliverGoods',
                    title: '发货管理'
                  }
                ]
              },
              {
                path: 'operate',
                title: '运营管理',
                icon: 'md-trophy',
                child: [
                  {
                    route: 'tbzw_wheelMessage',
                    title: '轮播消息'
                  },
                  {
                    route: 'tbzw_qrcode',
                    title: '群二维码'
                  }
                ]
              },
              {
                path: 'user',
                title: '用户管理',
                icon: 'ios-contacts',
                child: [
                  {
                    route: 'tbzw_userList',
                    title: '用户列表'
                  }
                ]
              }
            ]
            break
        }
      },
      getAdminList () {
        let nowId = this.$store.state.nowAdminType
        this.systemName = this.systemList[nowId]
      },
      getList() {
        this.isFetching = true
        this.$api.admin.permissionsList({
          roleId: this.roleId,
          system: this.systemIdList[this.$store.state.nowAdminType]
        })
          .then(
            response => {
              this.dataList = response.data.resultData

              for (let item of this.dataList[0].permissions) {
                if(item.checked) {
                  this.checkCourseIds.push(item.code)
                }
              }

              console.log( this.checkCourseIds,11)
            })
          .finally(() => {
            this.isFetching = false
          })
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
