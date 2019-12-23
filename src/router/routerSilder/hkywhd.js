import Main from '@/view/main'

export const hkywhdRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/hkywhd_userData',
        name: 'hkywhd_userData',
        meta: [
          {name: '数据统计'},
          {name: '用户数据'}
        ],
        component: () => import('@/view/hkywhd/userData/userData')
      },
      {
        path: '/hkywhd_activeData',
        name: 'hkywhd_activeData',
        meta: [
          {name: '数据统计'},
          {name: '活动数据'}
        ],
        component: () => import('@/view/hkywhd/activeData/activeData')
      },
      {
        path: '/hkywhd_courseData',
        name: 'hkywhd_courseData',
        meta: [
          {name: '数据统计'},
          {name: '课程数据'}
        ],
        component: () => import('@/view/hkywhd/courseData/courseData')
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
        path: '/hkywhd_orderList',
        name: 'hkywhd_orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/hkywhd/orderManagement/orderList')
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
        path: '/hkywhd_teachingList',
        name: 'hkywhd_teachingList',
        meta: [
          {name: '获课语文'},
          {name: '教材管理'}
        ],
        component: () => import('@/view/hkywhd/teaching/teachingList')
      },
      {
        path: '/hkywhd_teachMain',
        name: 'hkywhd_teachMain',
        meta: [
          {name: '获课语文'},
          {name: '教材管理', url: 'hkywhd_teachingList'},
          {name: '章节管理'}
        ],
        component: () => import('@/view/hkywhd/teaching/teachMain')
      },
      {
        path: '/hkywhd_courseInfo',
        name: 'hkywhd_courseInfo',
        meta: [
          {name: '获课语文'},
          {name: '教材管理', url: 'hkywhd_teachingList'},
          {name: '章节管理', url: 'hkywhd_teachMain'},
          {name: '课程内容管理'}
        ],
        component: () => import('@/view/hkywhd/teaching/courseInfo')
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
        path: '/hkywhd_userList',
        name: 'hkywhd_userList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/hkywhd/user/userList')
      },
      {
        path: '/hkywhd_userInfo',
        name: 'hkywhd_userInfo',
        meta: [
          {name: '用户管理'},
          {name: '用户信息'}
        ],
        component: () => import('@/view/hkywhd/user/userInfo')
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
        path: '/hkywhd_banner',
        name: 'hkywhd_banner',
        meta: [
          {name: '运营管理'},
          {name: 'banner管理'}
        ],
        component: () => import('@/view/hkywhd/banner/banner')
      },
      {
        path: '/hkywhd_putIn',
        name: 'hkywhd_putIn',
        meta: [
          {name: '运营管理'},
          {name: '投放管理'}
        ],
        component: () => import('@/view/hkywhd/putIn/putIn')
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
        path: '/hkywhd_courseType',
        name: 'hkywhd_courseType',
        meta: [
          {name: '课程管理'},
          {name: '课程分类'}
        ],
        component: () => import('@/view/hkywhd/courseType/courseType')
      },
      {
        path: '/hkywhd_courseList',
        name: 'hkywhd_courseList',
        meta: [
          {name: '课程管理'},
          {name: '课程列表'}
        ],
        component: () => import('@/view/hkywhd/course/courseList')
      },
      {
        path: '/hkywhd_lessonList',
        name: 'hkywhd_lessonList',
        meta: [
          {name: '课程管理'},
          {name: '课程列表', url: 'hkywhd_courseList'},
          {name: '小课管理'}
        ],
        component: () => import('@/view/hkywhd/course/lessonList')
      },
      {
        path: '/hkywhd_classHourList',
        name: 'hkywhd_classHourList',
        meta: [
          {name: '课程管理'},
          {name: '课程列表', url: 'hkywhd_courseList'},
          {name: '小课管理', url: 'hkywhd_lessonList'},
          {name: '课时管理'}
        ],
        component: () => import('@/view/hkywhd/course/classHourList')
      },
      {
        path: '/hkywhd_classHourList_direct',
        name: 'hkywhd_classHourList_direct',
        meta: [
          {name: '课程管理'},
          {name: '课程列表', url: 'hkywhd_courseList'},
          {name: '课时管理'}
        ],
        component: () => import('@/view/hkywhd/course/classHourList')
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
        path: '/hkywhd_column',
        name: 'hkywhd_column',
        meta: [
          {name: '内容管理'},
          {name: '栏目列表'}
        ],
        component: () => import('@/view/hkywhd/columnList/columnList')
      },
      {
        path: '/hkywhd_column_act',
        name: 'hkywhd_column_act',
        meta: [
          {name: '内容管理'},
          {name: '栏目列表', url: 'hkywhd_column'},
          {name: '文章管理'}
        ],
        component: () => import('@/view/hkywhd/columnList/articleManager')
      },
      {
        path: '/hkywhd_synLearn',
        name: 'hkywhd_synLearn',
        meta: [
          {name: '内容管理'},
          {name: '同步学习'}
        ],
        component: () => import('@/view/hkywhd/syncLearn/syncLearnList')
      },
    ]
  }
]
