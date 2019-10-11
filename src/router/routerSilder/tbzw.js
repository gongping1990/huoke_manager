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
        path: '/tbzw_banner',
        name: 'tbzw_banner',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/tbzw/banner/banner')
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
      },
      {
        path: '/tbzw_homePageSet',
        name: 'tbzw_homePageSet',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '首页信息配置'
          }
        ],
        component: () => import('@/view/tbzw/homePageSet/homePageSet')
      },
      {
        path: '/tbzw_news',
        name: 'tbzw_news',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '新闻管理'
          }
        ],
        component: () => import('@/view/tbzw/news/news')
      }
    ]
  },
  {
    path: 'formalcourse',
    name: 'formalcourse',
    title: '正式课管理',
    component: Main,
    children: [
      {
        path: '/tbzw_forma_courseList',
        name: 'tbzw_forma_courseList',
        meta: [
          {name: '正式课管理'},
          {name: '课程列表'}
        ],
        component: () => import('@/view/tbzw/formalcourse/formalCourseList/courseList')
      },
      {
        path: '/tbzw_forma_courseInfo',
        name: 'tbzw_forma_courseInfo',
        meta: [
          {name: '正式课管理'},
          {name: '课程列表', url: 'tbzw_forma_courseList'},
          {name: '编辑课程'}
        ],
        component: () => import('@/view/tbzw/formalcourse/formalCourseList/courseInfo')
      },
      {
        path: '/tbzw_forma_courseContent',
        name: 'tbzw_forma_courseContent',
        meta: [
          {name: '正式课管理'},
          {name: '课程列表', url: 'tbzw_forma_courseList'},
          {name: '课时内容'}
        ],
        component: () => import('@/view/tbzw/formalcourse/formalCourseList/courseContent')
      },
      {
        path: '/tbzw_formal_order',
        name: 'tbzw_formal_order',
        meta: [
          {name: '正式课管理'},
          {name: '正式课订单'}
        ],
        component: () => import('@/view/tbzw/formalcourse/formalOrder/orderList')
      },
      {
        path: '/tbzw_deliverGoods',
        name: 'tbzw_deliverGoods',
        meta: [
          {name: '正式课管理'},
          {name: '发货管理'}
        ],
        component: () => import('@/view/tbzw/formalcourse/formalDeliverGoods/deliverGoods')
      },

    ]
  },
  {
    path: 'paidExperienceCourse',
    name: 'paidExperienceCourse',
    title: '付费体验课',
    component: Main,
    children: [
      {
        path: '/tbzw_paid_courseList',
        name: 'tbzw_paid_courseList',
        meta: [
          {name: '付费体验课'},
          {name: '课程列表'}
        ],
        component: () => import('@/view/tbzw/paidExperienceCourse/paidCourseList/courseList')
      },
      {
        path: '/tbzw_paid_courseInfo',
        name: 'tbzw_paid_courseInfo',
        meta: [
          {name: '付费体验课'},
          {name: '课程列表', url: 'tbzw_paid_courseList'},
          {name: '编辑课程'}
        ],
        component: () => import('@/view/tbzw/paidExperienceCourse/paidCourseList/courseInfo')
      },
      {
        path: '/tbzw_paid_courseContent',
        name: 'tbzw_paid_courseContent',
        meta: [
          {name: '付费体验课'},
          {name: '课程列表', url: 'tbzw_paid_courseList'},
          {name: '课时内容'}
        ],
        component: () => import('@/view/tbzw/paidExperienceCourse/paidCourseList/courseContent')
      },
      {
        path: '/tbzw_paid_order',
        name: 'tbzw_paid_order',
        meta: [
          {name: '付费体验课'},
          {name: '正式课订单'}
        ],
        component: () => import('@/view/tbzw/paidExperienceCourse/paidOrder/orderList')
      },
      {
        path: '/tbzw_paid_applicationRecord',
        name: 'tbzw_paid_applicationRecord',
        meta: [
          {name: '付费体验课'},
          {name: '申请记录'}
        ],
        component: () => import('@/view/tbzw/paidExperienceCourse/applicationRecord/applicationRecord')
      },
      {
        path: '/tbzw_paid_Data',
        name: 'tbzw_paid_Data',
        meta: [
          {name: '付费体验课'},
          {name: '数据统计'}
        ],
        component: () => import('@/view/tbzw/paidLandingPage/paidLandingPage')
      }
    ]
  },
  {
    path: 'freeExperienceCourse',
    name: 'freeExperienceCourse',
    title: '免费体验课',
    component: Main,
    children: [
      {
        path: '/tbzw_free_courseList',
        name: 'tbzw_free_courseList',
        meta: [
          {name: '免费体验课'},
          {name: '课程列表'}
        ],
        component: () => import('@/view/tbzw/freeExperienceCourse/freeCourseList/courseList')
      },
      {
        path: '/tbzw_free_courseInfo',
        name: 'tbzw_free_courseInfo',
        meta: [
          {name: '免费体验课'},
          {name: '课程列表', url: 'tbzw_free_courseList'},
          {name: '编辑课程'}
        ],
        component: () => import('@/view/tbzw/freeExperienceCourse/freeCourseList/courseInfo')
      },
      {
        path: '/tbzw_free_courseContent',
        name: 'tbzw_free_courseContent',
        meta: [
          {name: '免费体验课'},
          {name: '课程列表', url: 'tbzw_free_courseList'},
          {name: '课时内容'}
        ],
        component: () => import('@/view/tbzw/freeExperienceCourse/freeCourseList/courseContent')
      },
      {
        path: '/tbzw_free_applicationRecord',
        name: 'tbzw_free_applicationRecord',
        meta: [
          {name: '免费体验课'},
          {name: '申请记录'}
        ],
        component: () => import('@/view/tbzw/freeExperienceCourse/applicationRecord/applicationRecord')
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
    path: 'teacher',
    name: 'teacher',
    title: '教师信息',
    component: Main,
    children: [
      {
        path: '/tbzw_teacher',
        name: 'tbzw_teacher',
        meta: [
          {name: '教师信息'},
          {name: '教师列表'}
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
  },
  {
    path: '/channelManagement',
    name: 'channelManagement',
    title: '渠道管理',
    component: Main,
    children: [
      {
        path: '/tbzw_channelType',
        name: 'tbzw_channelType',
        meta: [
          {name: '渠道管理'},
          {name: '渠道分类'}
        ],
        component: () => import('@/view/tbzw/channelManagement/channelType/channelType')
      },
      {
        path: '/tbzw_channelList',
        name: 'tbzw_channelList',
        meta: [
          {name: '渠道管理'},
          {name: '渠道列表'}
        ],
        component: () => import('@/view/tbzw/channelManagement/channelList/channelList')
      }
    ]
  }
]
