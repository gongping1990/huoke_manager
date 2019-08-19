import Main from '@/view/main'

export const tbzwRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/tbzw_channel',
        name: 'tbzw_channel',
        meta: [
          {name: '数据统计'},
          {name: '渠道管理'}
        ],
        component: () => import('@/view/tbzw/channelManagement/channelManagementList')
      },
      {
        path: '/tbzw_retainData',
        name: 'tbzw_retainData',
        meta: [
          {name: '数据统计'},
          {name: '留存数据'}
        ],
        component: () => import('@/view/tbzw/retainData/retainData')
      },
      {
        path: '/tbzw_userData',
        name: 'tbzw_userData',
        meta: [
          {name: '数据统计'},
          {name: '交易数据'}
        ],
        component: () => import('@/view/tbzw/userData/userData')
      },
      {
        path: '/tbzw_landingPage',
        name: 'tbzw_landingPage',
        meta: [
          {name: '数据统计'},
          {name: '落地页数据'}
        ],
        component: () => import('@/view/tbzw/landingPage/landingPage')
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
        path: '/tbzw_wheelMessage',
        name: 'tbzw_wheelMessage',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '轮播消息'
          }
        ],
        component: () => import('@/view/tbzw/wheelMessage/wheelMessageList')
      },
      {
        path: '/tbzw_qrcode',
        name: 'tbzw_qrcode',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '群二维码'
          }
        ],
        component: () => import('@/view/tbzw/qrcode/qrcodeList')
      },
      {
        path: '/tbzw_patchRecord',
        name: 'tbzw_patchRecord',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '补卡记录'
          }
        ],
        component: () => import('@/view/tbzw/patchRecord/patchRecord')
      },
      {
        path: '/tbzw_classProgress',
        name: 'tbzw_classProgress',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '上课进度'
          }
        ],
        component: () => import('@/view/tbzw/classProgress/classProgress')
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
        path: '/tbzw_orderList',
        name: 'tbzw_orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/tbzw/orderManagement/orderList')
      },
      {
        path: '/tbzw_deliverGoods',
        name: 'tbzw_deliverGoods',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '发货管理'
          }
        ],
        component: () => import('@/view/tbzw/deliverGoods/deliverGoods')
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
        path: '/tbzw_job',
        name: 'tbzw_job',
        meta: [
          {name: '作业管理'},
          {name: '作业列表'}
        ],
        component: () => import('@/view/tbzw/jobManagement/jobList')
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
        path: '/tbzw_bookingList',
        name: 'tbzw_bookingList',
        meta: [
          {name: '作业管理'},
          {name: '作业列表'}
        ],
        component: () => import('@/view/tbzw/bookingManagement/bookingList')
      }
    ]
  },
  {
    path: 'market',
    name: 'market',
    title: '营销管理',
    component: Main,
    children: [
      {
        path: '/tbzw_couponList',
        name: 'tbzw_couponList',
        meta: [
          {name: '营销管理'},
          {name: '优惠券列表'}
        ],
        component: () => import('@/view/tbzw/couponManagement/couponList')
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
        path: '/tbzw_courseInfo',
        name: 'tbzw_courseInfo',
        meta: [
          {name: '课程管理'},
          {name: '课程信息'}
        ],
        component: () => import('@/view/tbzw/courseManagement/courseInfo')
      },
      {
        path: '/tbzw_courseContent',
        name: 'tbzw_courseContent',
        meta: [
          {name: '课程管理'},
          {name: '课程内容'}
        ],
        component: () => import('@/view/tbzw/courseManagement/courseContent')
      },
      {
        path: '/tbzw_teacher',
        name: 'tbzw_teacher',
        meta: [
          {name: '课程管理'},
          {name: '教师信息'}
        ],
        component: () => import('@/view/tbzw/teacher/teacherList')
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
        path: '/tbzw_userList',
        name: 'tbzw_userList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/tbzw/user/userList')
      }
    ]
  }
]
