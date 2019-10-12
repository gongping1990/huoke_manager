import Main from '@/view/main'

export const hkywRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/hkyw_userData',
        name: 'hkyw_userData',
        meta: [
          {name: '数据统计'},
          {name: '用户数据'}
        ],
        component: () => import('@/view/hkyw/userData/userData')
      },
      {
        path: '/productData',
        name: 'productData',
        meta: [
          {name: '数据统计'},
          {name: '产品数据'}
        ],
        component: () => import('@/view/dataStatistics2/productData/productData')
      },
      {
        path: '/hkyw_activeData',
        name: 'hkyw_activeData',
        meta: [
          {name: '数据统计'},
          {name: '活动数据'}
        ],
        component: () => import('@/view/hkyw/activeData/activeData')
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
        path: '/hkyw_orderList',
        name: 'hkyw_orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/hkyw/orderManagement/orderList')
      },

    ]
  },
  {
    path: '/feedback',
    name: 'feedback',
    title: '反馈管理',
    component: Main,
    children: [
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
          {name: '同步学习'},
          {name: '学科管理'}
        ],
        component: () => import('@/view/study/subjectManage/subjectList')
      },
      {
        path: '/hkyw_teachingList',
        name: 'hkyw_teachingList',
        meta: [
          {name: '同步学习'},
          {name: '教材管理'}
        ],
        component: () => import('@/view/hkyw/teaching/teachingList')
      },
    ]
  },
  {
    path: '/user',
    name: 'user',
    title: '用户管理',
    component: Main,
    children: [
      {
        path: '/hkyw_userList',
        name: 'hkyw_userList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/hkyw/user/userList')
      },
      {
        path: '/hkyw_userInfo',
        name: 'hkyw_userInfo',
        meta: [
          {name: '用户管理'},
          {name: '用户信息'}
        ],
        component: () => import('@/view/hkyw/user/userInfo')
      }
    ]
  }
]
