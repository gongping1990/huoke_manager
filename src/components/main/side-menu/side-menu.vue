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
      <Submenu :name="list.path" class="-left-li" v-for="(list,index) of sideMenuList" :key="index" v-if="list.checked">
        <template slot="title">
          <Icon :type="list.ico" class="hk-menu-icon"/>
          <span>{{list.name}}</span>
        </template>

        <Menu-item v-if="item.checked" :name="item.path" v-for="(item,index1 ) of list.child" :key="index1">{{item.name}}</Menu-item>
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
      this.getList()
      this.getAdminList()
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
            this.sideMenuList = this.dataList
            console.log()
            break
          case 2:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    path: 'userData2',
                    name: '用户数据'
                  },
                  {
                    path: 'productData',
                    name: '产品数据'
                  }
                ]
              },
              {
                path: 'study',
                name: '同步学习',
                ico: 'ios-school',
                child: [
                  {
                    path: 'subject',
                    name: '学科管理'
                  },
                  {
                    path: 'teachingList',
                    name: '教材管理'
                  }
                ]
              },
              {
                path: 'orderManager',
                name: '订单管理',
                ico: 'ios-document',
                child: [
                  {
                    path: 'hkyw_orderList',
                    name: '订单列表'
                  }
                ]
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'userList2',
                    name: '用户列表'
                  }
                ]
              },
              {
                path: 'feedback',
                name: '留言管理',
                ico: 'ios-help-circle',
                child: [
                  {
                    path: 'userFeedback2',
                    name: '用户反馈'
                  }
                ]
              }
            ]
            break
          case 4:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    path: 'columnData',
                    name: '栏目数据'
                  }
                ]
              },
              {
                path: 'content',
                name: '内容管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'column',
                    name: '栏目管理'
                  }
                ]
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'zlkBannerList',
                    name: 'banner管理'
                  }
                ]
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'zlkUserList',
                    name: '用户列表'
                  }
                ]
              }
            ]
            break
          case 5:
            this.sideMenuList = [
              {
                path: 'content',
                name: '内容管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'teaching',
                    name: '教材列表'
                  },
                  {
                    path: 'teacher',
                    name: '教师列表'
                  }
                ]
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'ldBannerList',
                    name: 'banner管理'
                  },
                  {
                    path: 'contentOperation',
                    name: '内容运营'
                  }
                ]
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'ldUserList',
                    name: '用户列表'
                  }
                ]
              }
            ]
            break
          case 7:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    path: 'gsw_userData',
                    name: '交易数据'
                  },
                  {
                    path: 'gsw_retainData',
                    name: '留存数据'
                  },
                  {
                    path: 'gsw_channel',
                    name: '渠道管理'
                  }
                ]
              },
              {
                path: 'course',
                name: '课程管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'gsw_courseInfo',
                    name: '课程信息'
                  },
                  {
                    path: 'courseContent',
                    name: '课程内容'
                  },
                  {
                    path: 'gsw_new_courseInfo',
                    name: '新课程信息'
                  },
                  {
                    path: 'new_courseContent',
                    name: '新课程内容'
                  }
                ]
              },
              {
                path: 'booking',
                name: '预约管理',
                ico: 'md-cafe',
                child: [
                  {
                    path: 'gsw_bookingList',
                    name: '预约列表'
                  }
                ]
              },
              {
                path: 'task',
                name: '作业管理',
                ico: 'md-bookmarks',
                child: [
                  {
                    path: 'gsw_job',
                    name: '作业列表'
                  }
                ]
              },
              {
                path: 'orderManager',
                name: '订单管理',
                ico: 'ios-document',
                child: [
                  {
                    path: 'gsw_orderList',
                    name: '订单列表'
                  },
                  {
                    path: 'gsw_deliverGoods',
                    name: '发货管理'
                  }
                ]
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'gsw_wheelMessage',
                    name: '消息列表'
                  },
                  {
                    path: 'gsw_patchRecord',
                    name: '补卡记录'
                  },
                  {
                    path: 'gsw_qrcode',
                    name: '群二维码'
                  }
                ]
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'gswUserList',
                    name: '用户列表'
                  }
                ]
              }
            ]
            break
          case 8:
            this.sideMenuList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    path: 'tbzw_userData',
                    name: '交易数据'
                  },
                  {
                    path: 'tbzw_retainData',
                    name: '留存数据'
                  },
                  {
                    path: 'tbzw_channel',
                    name: '渠道管理'
                  }
                ]
              },
              {
                path: 'course',
                name: '课程管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'tbzw_courseInfo',
                    name: '课程信息'
                  },
                  {
                    path: 'tbzw_courseContent',
                    name: '课程内容'
                  },
                  {
                    path: 'tbzw_teacher',
                    name: '教师信息'
                  }
                ]
              },
              {
                path: 'booking',
                name: '预约管理',
                ico: 'md-cafe',
                child: [
                  {
                    path: 'tbzw_bookingList',
                    name: '预约列表'
                  }
                ]
              },
              {
                path: 'task',
                name: '作业管理',
                ico: 'md-bookmarks',
                child: [
                  {
                    path: 'tbzw_job',
                    name: '作业列表'
                  }
                ]
              },
              {
                path: 'orderManager',
                name: '订单管理',
                ico: 'ios-document',
                child: [
                  {
                    path: 'tbzw_orderList',
                    name: '订单列表'
                  },
                  {
                    path: 'tbzw_deliverGoods',
                    name: '发货管理'
                  }
                ]
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'tbzw_wheelMessage',
                    name: '轮播消息'
                  },
                  {
                    path: 'tbzw_qrcode',
                    name: '群二维码'
                  }
                ]
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'tbzw_userList',
                    name: '用户列表'
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
        this.$api.admin.listByUserPerm({
          system: this.systemIdList[this.$store.state.nowAdminType]
        })
          .then(
            response => {
              this.dataList = response.data.resultData
              this.initAdmin()
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
