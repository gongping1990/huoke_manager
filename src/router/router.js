import Main from '@/view/main'
// import err404 from '@/pages/404'
//otherRouter
// import home from '@/pages/home'

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    requireAuth: false
  },
  component: () => import("@/view/login/index"),
};

// const page404 = {
//   path: '*',
//   name: 'error-404',
//   meta: {
//     title: '404-页面不存在',
//     requireAuth: false
//   },
//   component: err404
// };

// 作为main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  title: 'other',
  component: Main,
  children: [
    {
      path: '/home',
      name: 'Home',
      meta: [{
        name: '首页'
      }],
      component: () => import('@/view/home/home')
    },
    {
      path: 'couponEdit',
      name: 'couponEdit',
      meta: [
        {name: '营销管理'},
        {name: '优惠券', url: 'coupon'},
        {name: '编辑优惠券'}
      ],
      component: () => import("@/view/marketingMangement/coupon/couponEdit")
    },
    {
      path: 'userInfo',
      name: 'userInfo',
      meta: [
        {name: '用户管理'},
        {name: '用户列表', url: 'userList'},
        {name: '用户详情'}
      ],
      component: () => import("@/view/user/userInfo")
    },
    {
      path: '/teachMain',
      name: 'teachMain',
      meta: [
        {name: '同步学习'},
        {name: '教材管理', url: 'teachingList'},
        {name: '章节管理'}
      ],
      component: () => import('@/view/study/teachingManage/teachMain')
    },
    {
      path: '/courseInfo',
      name: 'courseInfo',
      meta: [
        {name: '同步学习'},
        {name: '教材管理', url: 'teachingList'},
        {name: '章节管理', url: 'teachMain'},
        {name: '课程内容管理'},
      ],
      component: () => import('@/view/study/teachingManage/courseInfo')
    },
    {
      path: '/channelDetail',
      name: 'channelDetail',
      meta: [
        {name: '运营管理'},
        {name: '渠道管理', url: 'channelManagement'},
        {name: '渠道详情'}
      ],
      component: () => import('@/view/operate/channelManagement/channelManagementDetail')
    },
    {
      path: '/editCourse',
      name: 'editCourse',
      meta: [
        {name: '课程管理'},
        {name: '课程列表',url: 'courseList'},
        {name: '编辑课程'}
      ],
      component: () => import('@/view/courseManagement/course/courseEdit')
    },
    {
      path: '/classList',
      name: 'classList',
      meta: [
        {name: '课程管理'},
        {name: '课程列表',url: 'courseList'},
        {name: '课时列表'}
      ],
      component: () => import('@/view/courseManagement/course/classList')
    },
    {
      path: '/dataManagerList',
      name: 'dataManagerList',
      meta: [
        {name: '内容管理'},
        {name: '栏目管理',url: 'column'},
        {name: '资料管理'}
      ],
      component: () => import('@/view/zlk/content/dataManagerList')
    }
  ]
};
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/userData',
        name: 'userData',
        meta: [
          {name:'数据统计'},
          {name:'用户数据'}
        ],
        component: () => import('@/view/dataStatistics/userData/userData')
      },
      {
        path: '/userData2',
        name: 'userData2',
        meta: [
          {name:'数据统计'},
          {name:'用户数据'}
        ],
        component: () => import('@/view/dataStatistics2/userData2/userData2')
      },
      {
        path: '/transactionData',
        name: 'transactionData',
        meta: [
          {name:'数据统计'},
          {name:'交易数据'}
        ],
        component: () => import('@/view/dataStatistics/transactionData/transactionData')
      },
      {
        path: '/commodityData',
        name: 'commodityData',
        meta: [
          {name:'数据统计'},
          {name:'商品数据'}
        ],
        component: () => import('@/view/dataStatistics/commodityData/commodityData')
      },
      {
        path: '/productData',
        name: 'productData',
        meta: [
          {name:'数据统计'},
          {name:'产品数据'}
        ],
        component: () => import('@/view/dataStatistics2/productData/productData')
      },
      {
        path: '/columnData',
        name: 'columnData',
        meta: [
          {name:'数据统计'},
          {name:'栏目数据'}
        ],
        component: () => import('@/view/zlk/dataStatistics/columnData/columnData')
      }
    ]
  },
  {
    path: '/market',
    name: 'market',
    title: '营销管理',
    component: Main,
    children: [
      {
        path: '/coupon',
        name: 'coupon',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '优惠券'
          }
        ],
        component: () => import('@/view/marketingMangement/coupon/couponList')
      },
      {
        path: '/aloneBuy',
        name: 'aloneBuy',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '单独购'
          }
        ],
        component: () => import('@/view/marketingMangement/aloneBuy/aloneBuyList')
      },
      {
        path: '/friendHelp',
        name: 'friendHelp',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '好友助力'
          }
        ],
        component: () => import('@/view/marketingMangement/friendHelp/friendHelpList')
      },
      {
        path: '/limitedTimeSpikeList',
        name: 'limitedTimeSpikeList',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '限时秒杀'
          }
        ],
        component: () => import('@/view/marketingMangement/limitedTimeSpike/limitedTimeSpikeList')
      },
      {
        path: '/groupLesson',
        name: 'groupLesson',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '拼课'
          }
        ],
        component: () => import('@/view/marketingMangement/groupLesson/groupLesson')
      },
      {
        path: '/active',
        name: 'active',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '新人礼包'
          }
        ],
        component: () => import('@/view/marketingMangement/active/active')
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
        path: '/topBar',
        name: 'topBar',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'topBar管理'
          }
        ],
        component: () => import('@/view/operate/topBar/topBar')
      },
      {
        path: '/bannerList',
        name: 'bannerList',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/operate/banner/bannerList')
      },
      {
        path: '/zlkBannerList',
        name: 'zlkBannerList',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/zlk/operate/banner/bannerList')
      },
      {
        path: '/channelManagement',
        name: 'channelManagement',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '渠道管理'
          }
        ],
        component: () => import('@/view/operate/channelManagement/channelManagementList')
      },
      {
        path: '/pushWindow',
        name: 'pushWindow',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '活动推送'
          }
        ],
        component: () => import('@/view/operate/pushWindow/pushWindowList')
      },
      {
        path: '/operationalLocation',
        name: 'operationalLocation',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '运营位管理'
          }
        ],
        component: () => import('@/view/operate/operationalLocation/operationalLocationList')
      },
      {
        path: '/homeRecommend',
        name: 'homeRecommend',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '首页推荐'
          }
        ],
        component: () => import('@/view/operate/homeRecommend/homeRecommendList')
      },
      {
        path: '/trusteeship',
        name: 'trusteeship',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '页面托管'
          }
        ],
        component: () => import('@/view/operate/trusteeship/trusteeshipList')
      },
      {
        path: '/contentOperation',
        name: 'contentOperation',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '内容运营'
          }
        ],
        component: () => import('@/view/ld/contentOperation/contentOperation')
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
        path: '/orderList',
        name: 'orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/orderManagement/orderList')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    title: '消息管理',
    component: Main,
    children: [
      {
        path: '/wechat_news',
        name: 'wechat_news',
        meta: [
          {name:'消息管理'},
          {name:'微信推送消息'}
        ],
        component: () => import('@/view/messageManagement/wechat_news/wechat_news')
      },
      {
        path: '/custom_wechat_news',
        name: 'custom_wechat_news',
        meta: [
          {name:'消息管理'},
          {name:'自定义微信消息'}
        ],
        component: () => import('@/view/messageManagement/custom_wechat_news/custom_wechat_news')
      },
      {
        path: '/custom_wechat_news_other',
        name: 'custom_wechat_news_other',
        meta: [
          {name:'消息管理'},
          {name:'自定义微信消息(第三方)'}
        ],
        component: () => import('@/view/messageManagement/custom_wechat_news_other/custom_wechat_news_other')
      },
      {
        path: '/sms_news',
        name: 'sms_news',
        meta: [
          {name:'消息管理'},
          {name:'短信推送消息'}
        ],
        component: () => import('@/view/messageManagement/sms_news/sms_news')
      },
      {
        path: '/custom_sms_news',
        name: 'custom_sms_news',
        meta: [
          {name:'消息管理'},
          {name:'自定义短信消息'}
        ],
        component: () => import('@/view/messageManagement/custom_sms_news/custom_sms_news')
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
        path: '/courseType',
        name: 'courseType',
        meta: [
          {
            name: '课程管理'
          },
          {
            name: '课程分类'
          }
        ],
        component: () => import('@/view/courseManagement/courseType/courseType')
      },
      {
        path: '/courseList',
        name: 'courseList',
        meta: [
          {
            name: '课程管理'
          },
          {
            name: '课程列表'
          }
        ],
        component: () => import('@/view/courseManagement/course/courseList')
      }
    ]
  },
  {
    path: '/feedback',
    name: 'feedback',
    title: '反馈管理',
    component: Main,
    children: [
      {
        path: '/userFeedback',
        name: 'userFeedback',
        meta: [
          {
            name: '反馈管理'
          },
          {
            name: '用户反馈'
          }
        ],
        component: () => import('@/view/feedback/userFeedback/userFeedback')
      },
      {
        path: '/userFeedback2',
        name: 'userFeedback2',
        meta: [
          {
            name: '留言管理'
          },
          {
            name: '用户反馈'
          }
        ],
        component: () => import('@/view/feedback/userFeedback/userFeedback')
      },
      {
        path: '/messageManagement',
        name: 'messageManagement',
        meta: [
          {
            name: '反馈管理'
          },
          {
            name: '留言审核'
          }
        ],
        component: () => import('@/view/feedback/messageManagement/messageManagementList')
      },
      {
        path: '/customerService',
        name: 'customerService',
        meta: [
          {
            name: '反馈管理'
          },
          {
            name: '客服管理'
          }
        ],
        component: () => import('@/view/feedback/customerService/customerService')
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
        path: '/userList',
        name: 'userList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/user/userList')
      },
      {
        path: '/userList2',
        name: 'userList2',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/user-2/userList')
      },
      {
        path: '/zlkUserList',
        name: 'zlkUserList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/zlk/user/userList')
      },
      {
        path: '/ldUserList',
        name: 'ldUserList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/ld/user/userList')
      },
      {
        path: '/virtualUser',
        name: 'virtualUser',
        meta: [
          {name: '用户管理'},
          {name: '虚拟用户'}
        ],
        component: () => import('@/view/user/virtualUser')
      }
    ]
  },
  {
    path: '/study',
    name: 'study',
    title: '同步学习',
    component: Main,
    children: [
      {
        path: '/subject',
        name: 'subject',
        meta: [
          {name:'同步学习'},
          {name:'学科管理'}
        ],
        component: () => import('@/view/study/subjectManage/subjectList')
      },
      {
        path: '/teachingList',
        name: 'teachingList',
        meta: [
          {name:'同步学习'},
          {name:'教材管理'}
        ],
        component: () => import('@/view/study/teachingManage/tecchingList')
      },
    ]
  },
  {
    path: 'setting',
    name: 'setting',
    title: '用户设置',
    component: Main,
    children: [
      {
        path: '/user-setting',
        name: 'user-setting',
        meta: [
          {name:'设置'},
          {name:'用户设置'}
        ],
        component: () => import('@/view/setting')
      },
      {
        path: '/user-info',
        name: 'user-info',
        meta: [
          {name:'设置'},
          {name:'个人资料'}
        ],
        component: () => import('@/view/setting/info')
      },
      {
        path: '/user-role',
        name: 'user-role',
        meta: [
          {name:'设置'},
          {name:'角色管理'}
        ],
        component: () => import('@/view/setting/role')
      }
    ]
  },
  {
    path: 'content',
    name: 'content',
    title: '内容管理',
    component: Main,
    children: [
      {
        path: '/column',
        name: 'column',
        meta: [
          {name: '内容管理'},
          {name: '栏目管理'}
        ],
        component: () => import('@/view/zlk/content/columnList')
      },
      {
        path: '/teaching',
        name: 'teaching',
        meta: [
          {name: '内容管理'},
          {name: '教材列表'}
        ],
        component: () => import('@/view/ld/content/teachingList')
      }
    ]
  }
]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  // page404,
  loginRouter,
  otherRouter,
  ...appRouter,
]
