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
  }
]
