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

        <Menu-item v-if="item.checked" :name="item.path" v-for="(item,index1 ) of list.child" :key="index1">
          {{item.name}}
        </Menu-item>
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
        dataList: [],
        systemName: ''
      }
    },
    computed: {},
    watch: {
      '$store.state.nowAdminType'(_n, _d) {
        this.systemName = this.systemList[_n]
        this.getList()
        this.$router.push('/')
        this.$forceUpdate()
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
      initAdmin() {
        switch (+this.$store.state.nowAdminType) {
          case 1:
            // this.dataList = this.dataList
            break
          case 2:
            this.dataList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                checked: true,
                child: [
                  {
                    path: 'userData2',
                    name: '用户数据',
                    checked: true
                  },
                  {
                    path: 'productData',
                    name: '产品数据',
                    checked: true
                  }
                ]
              },
              {
                path: 'study',
                name: '同步学习',
                ico: 'ios-school',
                checked: true,
                child: [
                  {
                    path: 'subject',
                    name: '学科管理',
                    checked: true
                  },
                  {
                    path: 'teachingList',
                    name: '教材管理',
                    checked: true
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
                    name: '订单列表',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'userList2',
                    name: '用户列表',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'feedback',
                name: '留言管理',
                ico: 'ios-help-circle',
                child: [
                  {
                    path: 'userFeedback2',
                    name: '用户反馈',
                    checked: true
                  }
                ],
                checked: true
              }
            ]
            break
          case 4:
            this.dataList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    path: 'columnData',
                    name: '栏目数据',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'content',
                name: '内容管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'column',
                    name: '栏目管理',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'zlkBannerList',
                    name: 'banner管理',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'zlkUserList',
                    name: '用户列表',
                    checked: true
                  }
                ],
                checked: true
              }
            ]
            break
          case 5:
            this.dataList = [
              {
                path: 'content',
                name: '内容管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'teaching',
                    name: '教材列表',
                    checked: true
                  },
                  {
                    path: 'teacher',
                    name: '教师列表',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'ldBannerList',
                    name: 'banner管理',
                    checked: true
                  },
                  {
                    path: 'contentOperation',
                    name: '内容运营',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'ldUserList',
                    name: '用户列表',
                    checked: true
                  }
                ],
                checked: true
              }
            ]
            break
          case 7:
            this.dataList = [
              {
                path: 'dataStatistics',
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    path: 'gsw_userData',
                    name: '交易数据',
                    checked: true
                  },
                  {
                    path: 'gsw_retainData',
                    name: '留存数据',
                    checked: true
                  },
                  {
                    path: 'gsw_channel',
                    name: '渠道管理',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'course',
                name: '课程管理',
                ico: 'ios-school',
                child: [
                  {
                    path: 'gsw_courseInfo',
                    name: '课程信息',
                    checked: true
                  },
                  {
                    path: 'courseContent',
                    name: '课程内容',
                    checked: true
                  },
                  {
                    path: 'gsw_new_courseInfo',
                    name: '新课程信息',
                    checked: true
                  },
                  {
                    path: 'new_courseContent',
                    name: '新课程内容',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'booking',
                name: '预约管理',
                ico: 'md-cafe',
                child: [
                  {
                    path: 'gsw_bookingList',
                    name: '预约列表',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'task',
                name: '作业管理',
                ico: 'md-bookmarks',
                child: [
                  {
                    path: 'gsw_job',
                    name: '作业列表',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'orderManager',
                name: '订单管理',
                ico: 'ios-document',
                child: [
                  {
                    path: 'gsw_orderList',
                    name: '订单列表',
                    checked: true
                  },
                  {
                    path: 'gsw_deliverGoods',
                    name: '发货管理',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                child: [
                  {
                    path: 'gsw_wheelMessage',
                    name: '消息列表',
                    checked: true
                  },
                  {
                    path: 'gsw_patchRecord',
                    name: '补卡记录',
                    checked: true
                  },
                  {
                    path: 'gsw_qrcode',
                    name: '群二维码',
                    checked: true
                  }
                ],
                checked: true
              },
              {
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    path: 'gswUserList',
                    name: '用户列表',
                    checked: true
                  }
                ],
                checked: true
              }
            ]
            break
          case 8:
            this.dataList = [
              {
                path: 'dataStatistics',
                checked: true,
                name: '数据统计',
                ico: 'ios-stats',
                child: [
                  {
                    checked: true,
                    path: 'tbzw_userData',
                    name: '交易数据'
                  },
                  {
                    checked: true,
                    path: 'tbzw_retainData',
                    name: '留存数据'
                  },
                  {
                    checked: true,
                    path: 'tbzw_channel',
                    name: '渠道管理'
                  }
                ]
              },
              {
                path: 'course',
                name: '课程管理',
                ico: 'ios-school',
                checked: true,
                child: [
                  {
                    checked: true,
                    path: 'tbzw_courseInfo',
                    name: '课程信息'
                  },
                  {
                    checked: true,
                    path: 'tbzw_courseContent',
                    name: '课程内容'
                  },
                  {
                    checked: true,
                    path: 'tbzw_teacher',
                    name: '教师信息'
                  }
                ]
              },
              {
                path: 'booking',
                name: '预约管理',
                ico: 'md-cafe',
                checked: true,
                child: [
                  {
                    checked: true,
                    path: 'tbzw_bookingList',
                    name: '预约列表'
                  }
                ]
              },
              {
                path: 'task',
                name: '作业管理',
                ico: 'md-bookmarks',
                checked: true,
                child: [
                  {
                    checked: true,
                    path: 'tbzw_job',
                    name: '作业列表'
                  }
                ]
              },
              {
                path: 'orderManager',
                name: '订单管理',
                ico: 'ios-document',
                checked: true,
                child: [
                  {
                    checked: true,
                    path: 'tbzw_orderList',
                    name: '订单列表'
                  },
                  {
                    checked: true,
                    path: 'tbzw_deliverGoods',
                    name: '发货管理'
                  }
                ]
              },
              {
                path: 'operate',
                name: '运营管理',
                ico: 'md-trophy',
                checked: true,
                child: [
                  {
                    checked: true,
                    path: 'tbzw_wheelMessage',
                    name: '轮播消息'
                  },
                  {
                    checked: true,
                    path: 'tbzw_qrcode',
                    name: '群二维码'
                  }
                ]
              },
              {
                checked: true,
                path: 'user',
                name: '用户管理',
                ico: 'ios-contacts',
                child: [
                  {
                    checked: true,
                    path: 'tbzw_userList',
                    name: '用户列表'
                  }
                ]
              }
            ]
            break
        }
        console.log(this.dataList, '007')
      },
      getAdminList() {
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
              if (!this.dataList.length) {
                this.initAdmin()
              }

              this.sideMenuList = this.dataList
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
