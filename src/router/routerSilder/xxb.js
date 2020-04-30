import Main from '@/view/main'

export const xxbRouter =[
  {
    path: '/xxb_h5',
    name: 'xxb_h5',
    title: '小学学习宝',
    component: Main,
    children: [
      {
        path: '/xxb_userData',
        name: 'xxb_userData',
        meta: [
          {name: '小学学习宝'},
          {name: '用户数据'}
        ],
        component: () => import('@/view/xxb/userData/userData')
      },
      {
        path: '/xxb_userList',
        name: 'xxb_userList',
        meta: [
          {name: '小学学习宝'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/xxb/user/userList')
      },
      {
        path: '/xxb_userInfo',
        name: 'xxb_userInfo',
        meta: [
          {name: '小学学习宝'},
          {name: '用户信息'}
        ],
        component: () => import('@/view/xxb/user/userInfo')
      },
      {
        path: '/xxb_weike',
        name: 'xxb_weike',
        meta: [
          {name: '小学学习宝'},
          {name: '微课'}
        ],
        component: () => import('@/view/xxb/weike/weike')
      }
    ]
  },
  {
    path: '/sx_h5',
    name: 'sx_h5',
    title: '升学H5',
    component: Main,
    children: [
      {
        path: '/xxb_cityData',
        name: 'xxb_cityData',
        meta: [
          {name: '升学H5'},
          {name: '城市数据'}
        ],
        component: () => import('@/view/xxb/cityData/cityData')
      },
      {
        path: '/xxb_columnData',
        name: 'xxb_columnData',
        meta: [
          {name: '升学H5'},
          {name: '栏目数据'}
        ],
        component: () => import('@/view/xxb/columnData/columnData')
      },
      {
        path: '/xxb_sxBanner',
        name: 'xxb_sxBanner',
        meta: [
          {name: '升学H5'},
          {name: 'banner管理'}
        ],
        component: () => import('@/view/xxb/sx_banner/banner')
      },
      {
        path: '/xxb_operationalManager',
        name: 'xxb_operationalManager',
        meta: [
          {name: '升学H5'},
          {name: '运营位管理'}
        ],
        component: () => import('@/view/xxb/operationalManager/operationManager')
      },
      {
        path: '/xxb_cityList',
        name: 'xxb_cityList',
        meta: [
          {name: '升学H5'},
          {name: '城市管理'}
        ],
        component: () => import('@/view/xxb/cityManager/cityList')
      },
      {
        path: '/xxb_contentManager',
        name: 'xxb_contentManager',
        meta: [
          {name: '升学H5'},
          {name: '内容管理'}
        ],
        component: () => import('@/view/xxb/contentManager/learnList')
      },
      {
        path: '/xxb_subcolumn',
        name: 'xxb_subcolumn',
        meta: [
          {name: '升学H5'},
          {name: '内容管理', url: 'xxb_contentManager'},
          {name: '子栏目管理'}
        ],
        component: () => import('@/view/xxb/contentManager/subcolumn')
      },
      {
        path: '/xxb_articleManager',
        name: 'xxb_articleManager',
        meta: [
          {name: '升学H5'},
          {name: '内容管理', url: 'xxb_contentManager'},
          {name: '文章管理'}
        ],
        component: () => import('@/view/xxb/contentManager/articleManager')
      }
    ]
  },
  {
    path: '/gsw_h5',
    name: 'gsw_h5',
    title: '古诗词H5',
    component: Main,
    children: [
      {
        path: '/xxb_h5_gsw',
        name: 'xxb_h5_gsw',
        meta: [
          {name: '古诗词H5'},
          {name: '古诗词'}
        ],
        component: () => import('@/view/xxb/gswH5/gswList')
      },
      {
        path: '/xxb_h5_gsw_content',
        name: 'xxb_h5_gsw_content',
        meta: [
          {name: '古诗词H5'},
          {name: '古诗词', url: 'xxb_h5_gsw'},
          {name: '内容管理'}
        ],
        component: () => import('@/view/xxb/gswH5/contentManager')
      }
    ]
  },
  {
    path: '/xz_h5',
    name: 'xz_h5',
    title: '写字H5',
    component: Main,
    children: [
      {
        path: '/xxb_h5_xz',
        name: 'xxb_h5_xz',
        meta: [
          {name: '写字H5'},
          {name: '写字列表'}
        ],
        component: () => import('@/view/xxb/xzH5/contentManager')
      }
    ]
  },
]
