import Main from '@/view/main'

export const jsdRouter =[
  {
    path: '/teacherCorrection',
    name: 'teacherCorrection',
    title: '教师批改',
    component: Main,
    children: [
      {
        path: '/jsd_todayWork',
        name: 'jsd_todayWork',
        meta: [
          {name: '教师批改'},
          {name: '今日工作'}
        ],
        component: () => import('@/view/jsd/todayWork/todayWork')
      },
      {
        path: '/jsd_historicalRecords',
        name: 'jsd_historicalRecords',
        meta: [
          {name: '教师批改'},
          {name: '历史记录'}
        ],
        component: () => import('@/view/jsd/historicalRecords/historicalRecords')
      },
      {
        path: '/jsd_historicalData',
        name: 'jsd_historicalData',
        meta: [
          {name: '教师批改'},
          {name: '历史数据'}
        ],
        component: () => import('@/view/jsd/historicalData/historicalData')
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
  }
]
