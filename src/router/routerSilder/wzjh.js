import Main from '@/view/main'

export const wzjhRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据中心',
    component: Main,
    children: [
      {
        path: '/wzjh_userData',
        name: 'wzjh_userData',
        meta: [
          {name: '数据中心'},
          {name: '访问数据'},
        ],
        component: () => import('@/view/wzjh/userData2/userData2')
      },
      {
        path: '/wzjh_retainData',
        name: 'wzjh_retainData',
        meta: [
          {name: '数据中心'},
          {name: '留存数据'},
        ],
        component: () => import('@/view/wzjh/retainData/retainData')
      },
      {
        path: '/wzjh_columnData',
        name: 'wzjh_columnData',
        title: '栏目数据',
        meta: [
          {name: '数据中心'},
          {name: '栏目数据'},
        ],
        component: () => import('@/view/wzjh/columnData/columnData')
      },
      {
        path: '/wzjh_articleData',
        name: 'wzjh_articleData',
        meta: [
          {name: '数据中心'},
          {name: '文章数据'},
        ],
        component: () => import('@/view/wzjh/articleData/articleData')
      },
      {
        path: '/wzjh_channelManagement',
        name: 'wzjh_channelManagement',
        meta: [
          {name: '数据中心'},
          {name: '渠道管理'},
        ],
        component: () => import('@/view/wzjh/channelManagement/channelManagementList')
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
        path: '/wzjh_subject',
        name: 'wzjh_subject',
        meta: [
          {name: '内容管理'},
          {name: '学科管理'},
        ],
        component: () => import('@/view/wzjh/content/subject/subject')
      },
      {
        path: '/wzjh_synchronousLearning',
        name: 'wzjh_synchronousLearning',
        meta: [
          {name: '内容管理'},
          {name: '同步学习'},
        ],
        component: () => import('@/view/wzjh/content/synchronousLearning/teachingList')
      },
      {
        path: '/wzjh_learningResource',
        name: 'wzjh_learningResource',
        meta: [
          {name: '内容管理'},
          {name: '学习资源'},
        ],
        component: () => import('@/view/wzjh/content/learningResource/learnList')
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
        path: '/wzjh_userList',
        name: 'wzjh_userList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'},
        ],
        component: () => import('@/view/wzjh/user/userList')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    title: '订单管理',
    component: Main,
    children: [
      {
        path: '/wzjh_orderList',
        name: 'wzjh_orderList',
        meta: [
          {name: '订单管理'},
          {name: '订单列表'},
        ],
        component: () => import('@/view/wzjh/orderManagement/orderList')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    title: '设置管理',
    component: Main,
    children: [
      {
        path: '/wzjh_feedback',
        name: 'wzjh_feedback',
        meta: [
          {name: '设置管理'},
          {name: '反馈列表'},
        ],
        component: () => import('@/view/wzjh/userFeedback/userFeedback')
      },
      {
        path: '/wzjh_search',
        name: 'wzjh_search',
        meta: [
          {name: '设置管理'},
          {name: '关键词列表'},
        ],
        component: () => import('@/view/wzjh/hotKeywords/hotKeywords')
      }
    ]
  },
  {
    path: '/welfare',
    name: 'welfare',
    title: '福利中心',
    component: Main,
    children: [
      {
        path: '/wzjh_prizeList',
        name: 'wzjh_prizeList',
        meta: [
          {name: '福利中心'},
          {name: '奖品列表'},
        ],
        component: () => import('@/view/wzjh/prize/prizeList')
      },
      {
        path: '/wzjh_deliverGoods',
        name: 'wzjh_deliverGoods',
        meta: [
          {name: '福利中心'},
          {name: '发货管理'},
        ],
        component: () => import('@/view/wzjh/prize/deliverGoods')
      }
    ]
  }
]
