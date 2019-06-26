import Main from '@/view/main'

export const hkxtRouter =[
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
      },
      {
        path: '/coursePackages',
        name: 'coursePackages',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '课程套餐'
          }
        ],
        component: () => import('@/view/marketingMangement/coursePackages/coursePackages')
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
        path: '/capsule',
        name: 'capsule',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '胶囊位管理'
          }
        ],
        component: () => import('@/view/operate/capsule/capsule')
      },
      {
        path: '/setMeal',
        name: 'setMeal',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '套餐管理'
          }
        ],
        component: () => import('@/view/operate/setMeal/setMeal')
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
          {name: '消息管理'},
          {name: '微信推送消息'}
        ],
        component: () => import('@/view/messageManagement/wechat_news/wechat_news')
      },
      {
        path: '/custom_wechat_news',
        name: 'custom_wechat_news',
        meta: [
          {name: '消息管理'},
          {name: '自定义微信消息'}
        ],
        component: () => import('@/view/messageManagement/custom_wechat_news/custom_wechat_news')
      },
      {
        path: '/custom_wechat_news_other',
        name: 'custom_wechat_news_other',
        meta: [
          {name: '消息管理'},
          {name: '自定义微信消息(第三方)'}
        ],
        component: () => import('@/view/messageManagement/custom_wechat_news_other/custom_wechat_news_other')
      },
      {
        path: '/sms_news',
        name: 'sms_news',
        meta: [
          {name: '消息管理'},
          {name: '短信推送消息'}
        ],
        component: () => import('@/view/messageManagement/sms_news/sms_news')
      },
      {
        path: '/custom_sms_news',
        name: 'custom_sms_news',
        meta: [
          {name: '消息管理'},
          {name: '自定义短信消息'}
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
        path: '/messageManagement',
        name: 'messageManagement',
        meta: [
          {
            name: '反馈管理'
          },
          {
            name: '评价管理'
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
    path: 'setting',
    name: 'setting',
    title: '用户设置',
    component: Main,
    children: [
      {
        path: '/user-setting',
        name: 'user-setting',
        meta: [
          {name: '设置'},
          {name: '用户设置'}
        ],
        component: () => import('@/view/setting')
      },
      {
        path: '/user-info',
        name: 'user-info',
        meta: [
          {name: '设置'},
          {name: '个人资料'}
        ],
        component: () => import('@/view/setting/info')
      },
      {
        path: '/user-role',
        name: 'user-role',
        meta: [
          {name: '设置'},
          {name: '角色管理'}
        ],
        component: () => import('@/view/setting/role')
      }
    ]
  }
]
