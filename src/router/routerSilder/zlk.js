import Main from '@/view/main'

export const zlkRouter =[
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    title: '数据统计',
    component: Main,
    children: [
      {
        path: '/columnData',
        name: 'columnData',
        meta: [
          {name: '数据统计'},
          {name: '栏目数据'}
        ],
        component: () => import('@/view/zlk/dataStatistics/columnData/columnData')
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
        path: '/zlkUserList',
        name: 'zlkUserList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/zlk/user/userList')
      },
    ]
  }
]
