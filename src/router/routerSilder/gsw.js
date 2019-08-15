import Main from '@/view/main'

export const gswRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/gsw_channel',
        name: 'gsw_channel',
        meta: [
          {name: '数据统计'},
          {name: '渠道管理'}
        ],
        component: () => import('@/view/gsw/channelManagement/channeFirst')
      },
      {
        path: '/gsw_retainData',
        name: 'gsw_retainData',
        meta: [
          {name: '数据统计'},
          {name: '留存数据'}
        ],
        component: () => import('@/view/gsw/retainData/retainData')
      },
      {
        path: '/gsw_userData',
        name: 'gsw_userData',
        meta: [
          {name: '数据统计'},
          {name: '交易数据'}
        ],
        component: () => import('@/view/gsw/userData/userData')
      },
      {
        path: '/gsw_punchData',
        name: 'gsw_punchData',
        meta: [
          {name: '数据统计'},
          {name: '打卡数据'}
        ],
        component: () => import('@/view/gsw/punchData/punchData')
      },
      {
        path: '/gsw_productData',
        name: 'gsw_productData',
        meta: [
          {name: '数据统计'},
          {name: '产品数据'}
        ],
        component: () => import('@/view/gsw/productData/productData')
      },
      {
        path: '/gsw_landingPage',
        name: 'gsw_landingPage',
        meta: [
          {name: '数据统计'},
          {name: '落地页数据'}
        ],
        component: () => import('@/view/gsw/landingPage/landingPage')
      }
    ]
  },
  {
    path: '/operate',
    name: 'operate',
    title: '运营管理',
    component: Main,
    children: [
      {
        path: '/gsw_wheelMessage',
        name: 'gsw_wheelMessage',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '轮播消息'
          }
        ],
        component: () => import('@/view/gsw/wheelMessage/wheelMessageList')
      },
      {
        path: '/gsw_patchRecord',
        name: 'gsw_patchRecord',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '补卡记录'
          }
        ],
        component: () => import('@/view/gsw/patchRecord/patchRecord')
      },
      {
        path: '/gsw_qrcode',
        name: 'gsw_qrcode',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '群二维码'
          }
        ],
        component: () => import('@/view/gsw/qrcode/qrcodeList')
      },
      {
        path: '/gsw_openCourse',
        name: 'gsw_openCourse',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '开营管理'
          }
        ],
        component: () => import('@/view/gsw/openCourseList/openCourseList')
      },
      {
        path: '/gsw_flashScreen',
        name: 'gsw_flashScreen',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '闪屏管理'
          }
        ],
        component: () => import('@/view/gsw/flashScreen/flashScreen')
      },
      {
        path: '/gsw_marketingWindow',
        name: 'gsw_marketingWindow',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '营销弹窗'
          }
        ],
        component: () => import('@/view/gsw/marketingWindow/marketingWindow')
      },
      {
        path: '/gsw_banner',
        name: 'gsw_banner',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/gsw/banner/banner')
      },
      {
        path: '/gsw_banner',
        name: 'gsw_banner',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/gsw/marketingWindow/marketingWindow')
      },
      {
        path: '/gsw_customer',
        name: 'gsw_customer',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '客服管理'
          }
        ],
        component: () => import('@/view/gsw/customer/customer')
      }
    ]
  },
  {
    path: 'task',
    name: 'task',
    title: '作业管理',
    component: Main,
    children: [
      {
        path: '/gsw_job',
        name: 'gsw_job',
        meta: [
          {name: '作业管理'},
          {name: '作业列表'}
        ],
        component: () => import('@/view/gsw/jobManagement/jobList')
      }
    ]
  },
  {
    path: 'booking',
    name: 'booking',
    title: '预约管理',
    component: Main,
    children: [
      {
        path: '/gsw_bookingList',
        name: 'gsw_bookingList',
        meta: [
          {name: '预约管理'},
          {name: '预约列表'}
        ],
        component: () => import('@/view/gsw/bookingManagement/bookingList')
      }
    ]
  },
  {
    path: '/orderManager',
    name: 'orderManager',
    title: '订单管理',
    component: Main,
    children: [
      {
        path: '/gsw_orderList',
        name: 'gsw_orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/gsw/orderManagement/orderList')
      },
      {
        path: '/gsw_deliverGoods',
        name: 'gsw_deliverGoods',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '发货管理'
          }
        ],
        component: () => import('@/view/gsw/deliverGoods/deliverGoods')
      }
    ]
  },
  {
    path: '/course',
    name: 'course',
    title: '课程管理',
    component: Main,
    children: [
      {
        path: '/gsw_courseInfo',
        name: 'gsw_courseInfo',
        meta: [
          {name: '课程管理'},
          {name: '课程信息'}
        ],
        component: () => import('@/view/gsw/courseManagement/courseInfo')
      },
      {
        path: '/gsw_courseContent',
        name: 'gsw_courseContent',
        meta: [
          {name: '课程管理'},
          {name: '课程内容'}
        ],
        component: () => import('@/view/gsw/courseManagement/courseContent')
      },
      {
        path: '/gsw_new_courseContent',
        name: 'gsw_new_courseContent',
        meta: [
          {name: '课程管理'},
          {name: '新课程内容'}
        ],
        component: () => import('@/view/gsw/courseManagement/new_courseContent')
      },
      {
        path: '/gsw_new_courseInfo',
        name: 'gsw_new_courseInfo',
        meta: [
          {name: '课程管理'},
          {name: '新课程信息'}
        ],
        component: () => import('@/view/gsw/courseManagement/new_courseInfo')
      },
      {
        path: '/gsw_experienceClass',
        name: 'gsw_experienceClass',
        meta: [
          {name: '课程管理'},
          {name: '新课程体验课'}
        ],
        component: () => import('@/view/gsw/courseManagement/experienceClass')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    title: '用户管理',
    component: Main,
    children: [
      {
        path: '/gswUserList',
        name: 'gswUserList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/gsw/user/userList')
      }
    ]
  },
  {
    path: '/product',
    name: 'product',
    title: '产品管理',
    component: Main,
    children: [
      {
        path: '/gsw_InstallationPackage',
        name: 'gsw_InstallationPackage',
        meta: [
          {name: '产品管理'},
          {name: '安装包管理'}
        ],
        component: () => import('@/view/gsw/installationPackage/installationPackage')
      },
      {
        path: '/gsw_upgrade',
        name: 'gsw_upgrade',
        meta: [
          {name: '产品管理'},
          {name: '升级管理'}
        ],
        component: () => import('@/view/gsw/upgrade/upgrade')
      }
    ]
  },
  {
    path: '/creditMall',
    name: 'creditMall',
    title: '学分商城',
    component: Main,
    children: [
      {
        path: '/gsw_prizeManager',
        name: 'gsw_prizeManager',
        meta: [
          {name: '学分商城'},
          {name: '奖品管理'}
        ],
        component: () => import('@/view/gsw/przie/prizeList')
      },
      {
        path: '/gsw_mall_deliverGoods',
        name: 'gsw_mall_deliverGoods',
        meta: [
          {name: '学分商城'},
          {name: '发货管理'}
        ],
        component: () => import('@/view/gsw/przie/deliverGoods')
      }
    ]
  },
  {
    path: '/content',
    name: 'content',
    title: '内容管理',
    component: Main,
    children: [
      {
        path: '/gsw_contentList',
        name: 'gsw_contentList',
        meta: [
          {name: '内容管理'},
          {name: '内容列表'}
        ],
        component: () => import('@/view/gsw/contentManagement/contentList')
      }
    ]
  }
]
