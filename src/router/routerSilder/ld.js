import Main from '@/view/main'

export const ldRouter =[
  {
    path: '/operate',
    name: 'operate',
    title: '运营管理',
    component: Main,
    children: [
      {
        path: '/ldBannerList',
        name: 'ldBannerList',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'banner管理'
          }
        ],
        component: () => import('@/view/ld/banner/bannerList')
      },
      {
        path: '/contentOperation',
        name: 'contentOperation',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: '内容运营'
          }
        ],
        component: () => import('@/view/ld/contentOperation/contentOperation')
      }
    ]
  },
  {
    path: 'content',
    name: 'content',
    title: '内容管理',
    component: Main,
    children: [
      {
        path: '/teaching',
        name: 'teaching',
        meta: [
          {name: '内容管理'},
          {name: '教材列表'}
        ],
        component: () => import('@/view/ld/content/teachingList')
      },
      {
        path: '/teacher',
        name: 'teacher',
        meta: [
          {name: '内容管理'},
          {name: '教师列表'}
        ],
        component: () => import('@/view/ld/content/teacherList')
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
        path: '/ldUserList',
        name: 'ldUserList',
        meta: [
          {name: '用户管理'},
          {name: '用户列表'}
        ],
        component: () => import('@/view/ld/user/userList')
      }
    ]
  }
]
