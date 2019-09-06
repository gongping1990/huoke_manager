import Main from '@/view/main'

export const fxglRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/fxgl_PlatformData',
        name: 'fxgl_PlatformData',
        meta: [
          {name: '数据统计'},
          {name: '平台数据'}
        ],
        component: () => import('@/view/fxgl/platformData/platformData')
      },
      {
        path: '/fxgl_SalesData',
        name: 'fxgl_SalesData',
        meta: [
          {name: '数据统计'},
          {name: '销售数据'}
        ],
        component: () => import('@/view/fxgl/salesData/salesData')
      },
      {
        path: '/fxgl_ExtensionData',
        name: 'fxgl_ExtensionData',
        meta: [
          {name: '数据统计'},
          {name: '推广数据'}
        ],
        component: () => import('@/view/fxgl/extensionData/extensionData')
      },
      {
        path: '/fxgl_FranchiseeData',
        name: 'fxgl_FranchiseeData',
        meta: [
          {name: '数据统计'},
          {name: '加盟商数据'}
        ],
        component: () => import('@/view/fxgl/franchiseeData/franchiseeData')
      },
      {
        path: '/fxgl_DataFunneling',
        name: 'fxgl_DataFunneling',
        meta: [
          {name: '数据统计'},
          {name: '数据漏斗'}
        ],
        component: () => import('@/view/tbzw/landingPage/landingPage')
      }
    ]
  },
  {
    path: '/distribution ',
    name: 'distribution ',
    title: '分销管理',
    component: Main,
    children: [
      {
        path: '/fxgl_distributionMessage',
        name: 'fxgl_distributionMessage',
        meta: [
          {
            name: '分销管理'
          },
          {
            name: '分销信息'
          }
        ],
        component: () => import('@/view/fxgl/distributionMessage/distribution')
      },
      {
        path: '/fxgl_franchisorAudit',
        name: 'fxgl_franchisorAudit',
        meta: [
          {
            name: '分销管理'
          },
          {
            name: '加盟商审核'
          }
        ],
        component: () => import('@/view/fxgl/franchisorAudit/franchisorAudit')
      },
      {
        path: '/fxgl_promoter',
        name: 'fxgl_promoter',
        meta: [
          {
            name: '分销管理'
          },
          {
            name: '推广人列表'
          }
        ],
        component: () => import('@/view/fxgl/promoter/promoterList')
      },
      {
        path: '/fxgl_order',
        name: 'fxgl_order',
        meta: [
          {
            name: '分销管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/fxgl/orderList/orderList')
      },
      {
        path: '/fxgl_CashWithdrawal',
        name: 'fxgl_CashWithdrawal',
        meta: [
          {
            name: '分销管理'
          },
          {
            name: '提现列表'
          }
        ],
        component: () => import('@/view/fxgl/cashWithdrawal/cashWithdrawal')
      }
    ]
  }
]
