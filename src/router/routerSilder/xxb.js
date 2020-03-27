import Main from '@/view/main'

export const xxbRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/xxb_userData',
        name: 'xxb_userData',
        meta: [
          {name: '数据统计'},
          {name: '用户数据'}
        ],
        component: () => import('@/view/xxb/userData/userData')
      },
      {
        path: '/xxb_activeData',
        name: 'xxb_activeData',
        meta: [
          {name: '数据统计'},
          {name: '活动数据'}
        ],
        component: () => import('@/view/xxb/activeData/activeData')
      },
      {
        path: '/xxb_courseData',
        name: 'xxb_courseData',
        meta: [
          {name: '数据统计'},
          {name: '课程数据'}
        ],
        component: () => import('@/view/xxb/courseData/courseData')
      },
      {
        path: '/xxb_memberData',
        name: 'xxb_memberData',
        meta: [
          {name: '数据统计'},
          {name: '会员数据'}
        ],
        component: () => import('@/view/xxb/memberData/memberData')
      }
    ]
  },
  {
    path: '/sx_dataStatistics',
    name: 'sx_dataStatistics',
    title: '升学数据统计',
    component: Main,
    children: [
      {
        path: '/xxb_cityData',
        name: 'xxb_cityData',
        meta: [
          {name: '升学数据统计'},
          {name: '城市数据'}
        ],
        component: () => import('@/view/xxb/cityData/cityData')
      },
      {
        path: '/xxb_columnData',
        name: 'xxb_columnData',
        meta: [
          {name: '升学数据统计'},
          {name: '栏目数据'}
        ],
        component: () => import('@/view/xxb/columnData/columnData')
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
        path: '/xxb_orderList',
        name: 'xxb_orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/xxb/orderManagement/orderList')
      },

    ]
  },
  {
    path: '/huokeChinese',
    name: 'huokeChinese',
    title: '获课语文',
    component: Main,
    children: [
      {
        path: '/xxb_teachingList',
        name: 'xxb_teachingList',
        meta: [
          {name: '获课语文'},
          {name: '教材管理'}
        ],
        component: () => import('@/view/xxb/teaching/teachingList')
      },
      {
        path: '/xxb_teachMain',
        name: 'xxb_teachMain',
        meta: [
          {name: '获课语文'},
          {name: '教材管理', url: 'xxb_teachingList'},
          {name: '章节管理'}
        ],
        component: () => import('@/view/xxb/teaching/teachMain')
      },
      {
        path: '/xxb_courseInfo',
        name: 'xxb_courseInfo',
        meta: [
          {name: '获课语文'},
          {name: '教材管理', url: 'xxb_teachingList'},
          {name: '章节管理', url: 'xxb_teachMain'},
          {name: '课程内容管理'}
        ],
        component: () => import('@/view/xxb/teaching/courseInfo')
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
        path: '/xxb_userList',
        name: 'xxb_userList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/xxb/user/userList')
      },
      {
        path: '/xxb_userInfo',
        name: 'xxb_userInfo',
        meta: [
          {name: '用户管理'},
          {name: '用户信息'}
        ],
        component: () => import('@/view/xxb/user/userInfo')
      },
      {
        path: '/xxb_memberList',
        name: 'xxb_memberList',
        meta: [
          {name: '用户管理'},
          {name: '会员列表'}
        ],
        component: () => import('@/view/xxb/user/memberList')
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
        path: '/xxb_banner',
        name: 'xxb_banner',
        meta: [
          {name: '运营管理'},
          {name: 'banner管理'}
        ],
        component: () => import('@/view/xxb/banner/banner')
      },
      {
        path: '/xxb_putIn',
        name: 'xxb_putIn',
        meta: [
          {name: '运营管理'},
          {name: '投放管理'}
        ],
        component: () => import('@/view/xxb/putIn/putIn')
      }
    ]
  },
  {
    path: '/sx_operate',
    name: 'sx_operate',
    title: '升学运营管理',
    component: Main,
    children: [
      {
        path: '/xxb_sxBanner',
        name: 'xxb_sxBanner',
        meta: [
          {name: '升学运营管理'},
          {name: 'banner管理'}
        ],
        component: () => import('@/view/xxb/sx_banner/banner')
      },
      {
        path: '/xxb_operationalManager',
        name: 'xxb_operationalManager',
        meta: [
          {name: '升学运营管理'},
          {name: '运营位管理'}
        ],
        component: () => import('@/view/xxb/operationalManager/operationManager')
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
        path: '/xxb_courseType',
        name: 'xxb_courseType',
        meta: [
          {name: '课程管理'},
          {name: '课程分类'}
        ],
        component: () => import('@/view/xxb/courseType/courseType')
      },
      {
        path: '/xxb_courseList',
        name: 'xxb_courseList',
        meta: [
          {name: '课程管理'},
          {name: '课程列表'}
        ],
        component: () => import('@/view/xxb/course/courseList')
      },
      {
        path: '/xxb_lessonList',
        name: 'xxb_lessonList',
        meta: [
          {name: '课程管理'},
          {name: '课程列表', url: 'xxb_courseList'},
          {name: '小课管理'}
        ],
        component: () => import('@/view/xxb/course/lessonList')
      },
      {
        path: '/xxb_classHourList',
        name: 'xxb_classHourList',
        meta: [
          {name: '课程管理'},
          {name: '课程列表', url: 'xxb_courseList'},
          {name: '小课管理', url: 'xxb_lessonList'},
          {name: '课时管理'}
        ],
        component: () => import('@/view/xxb/course/classHourList')
      },
      {
        path: '/xxb_classHourList_direct',
        name: 'xxb_classHourList_direct',
        meta: [
          {name: '课程管理'},
          {name: '课程列表', url: 'xxb_courseList'},
          {name: '课时管理'}
        ],
        component: () => import('@/view/xxb/course/classHourList')
      },
      {
        path: '/xxb_coursePackage',
        name: 'xxb_coursePackage',
        meta: [
          {name: '课程管理'},
          {name: '课程套餐'}
        ],
        component: () => import('@/view/xxb/coursePackage/coursePackage')
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
        path: '/xxb_column',
        name: 'xxb_column',
        meta: [
          {name: '内容管理'},
          {name: '栏目列表'}
        ],
        component: () => import('@/view/xxb/columnList/columnList')
      },
      {
        path: '/xxb_column_act',
        name: 'xxb_column_act',
        meta: [
          {name: '内容管理'},
          {name: '栏目列表', url: 'xxb_column'},
          {name: '文章管理'}
        ],
        component: () => import('@/view/xxb/columnList/articleManager')
      },
      {
        path: '/xxb_synLearn',
        name: 'xxb_synLearn',
        meta: [
          {name: '内容管理'},
          {name: '同步学习'}
        ],
        component: () => import('@/view/xxb/syncLearn/syncLearnList')
      },
      {
        path: '/xxb_weike',
        name: 'xxb_weike',
        meta: [
          {name: '内容管理'},
          {name: '微课'}
        ],
        component: () => import('@/view/xxb/weike/weike')
      },
    ]
  },
  {
    path: '/sx_content',
    name: 'sx_content',
    title: '升学内容管理',
    component: Main,
    children: [
      {
        path: '/xxb_cityList',
        name: 'xxb_cityList',
        meta: [
          {name: '升学内容管理'},
          {name: '城市管理'}
        ],
        component: () => import('@/view/xxb/cityManager/cityList')
      },
      {
        path: '/xxb_contentManager',
        name: 'xxb_contentManager',
        meta: [
          {name: '升学内容管理'},
          {name: '内容管理'}
        ],
        component: () => import('@/view/xxb/contentManager/learnList')
      },
      {
        path: '/xxb_subcolumn',
        name: 'xxb_subcolumn',
        meta: [
          {name: '升学内容管理'},
          {name: '内容管理', url: 'xxb_contentManager'},
          {name: '子栏目管理'}
        ],
        component: () => import('@/view/xxb/contentManager/subcolumn')
      },
      {
        path: '/xxb_articleManager',
        name: 'xxb_articleManager',
        meta: [
          {name: '升学内容管理'},
          {name: '内容管理', url: 'xxb_contentManager'},
          {name: '文章管理'}
        ],
        component: () => import('@/view/xxb/contentManager/articleManager')
      }
    ]
  }
]
