import Main from '@/view/main'

export const ylxcxRouter =[
  {
    path: '/operate',
    name: 'operate',
    title: '运营管理',
    component: Main,
    children: [
      {
        path: '/ylxcx_banner',
        name: 'ylxcx_banner',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/ylxcx/banner/bannerList')
      },
      {
        path: '/goToSchool',
        name: 'goToSchool',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '升学'
          }
        ],
        component: () => import('@/view/ylxcx/goToSchool/index')
      },
      {
        path: '/juniorHighSchool',
        name: 'juniorHighSchool',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '小升初'
          }
        ],
        component: () => import('@/view/ylxcx/juniorHighSchool/index')
      }
    ]
  }
]
