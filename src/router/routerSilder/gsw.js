import Main from '@/view/main'

export const gswRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/gsw_channel',
        name: 'gsw_channel',
        meta: [
          {name: '数据统计'},
          {name: '渠道管理'}
        ],
        component: () => import('@/view/gsw/channelManagement/channelManagementList')
      },
      {
        path: '/gsw_retainData',
        name: 'gsw_retainData',
        meta: [
          {name: '数据统计'},
          {name: '留存数据'}
        ],
        component: () => import('@/view/gsw/retainData/retainData')
      },
      {
        path: '/gsw_userData',
        name: 'gsw_userData',
        meta: [
          {name: '数据统计'},
          {name: '交易数据'}
        ],
        component: () => import('@/view/gsw/userData/userData')
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
        path: '/gsw_wheelMessage',
        name: 'gsw_wheelMessage',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '轮播消息'
          }
        ],
        component: () => import('@/view/gsw/wheelMessage/wheelMessageList')
      },
      {
        path: '/gsw_patchRecord',
        name: 'gsw_patchRecord',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '补卡记录'
          }
        ],
        component: () => import('@/view/gsw/patchRecord/patchRecord')
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
        path: '/gsw_orderList',
        name: 'gsw_orderList',
        meta: [
          {
            name: '订单管理'
          },
          {
            name: '订单列表'
          }
        ],
        component: () => import('@/view/gsw/orderManagement/orderList')
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
        path: '/gsw_courseInfo',
        name: 'gsw_courseInfo',
        meta: [
          {name: '课程管理'},
          {name: '课程信息'}
        ],
        component: () => import('@/view/gsw/courseManagement/courseInfo')
      },
      {
        path: '/courseContent',
        name: 'courseContent',
        meta: [
          {name: '课程管理'},
          {name: '课程内容'}
        ],
        component: () => import('@/view/gsw/courseManagement/courseContent')
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
        path: '/gswUserList',
        name: 'gswUserList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/gsw/user/userList')
      }
    ]
  }
]
