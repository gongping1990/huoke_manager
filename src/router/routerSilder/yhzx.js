import Main from '@/view/main'

export const yhzxRouter =[
  {
    path: 'jurisdictionSet',
    name: 'jurisdictionSet',
    title: '用户设置',
    component: Main,
    children: [
      {
        path: '/user-setting',
        name: 'user-setting',
        meta: [
          {name: '设置'},
          {name: '用户设置'}
        ],
        component: () => import('@/view/setting')
      },
      {
        path: '/user-info',
        name: 'user-info',
        meta: [
          {name: '设置'},
          {name: '个人资料'}
        ],
        component: () => import('@/view/setting/info')
      },
      {
        path: '/user-role',
        name: 'user-role',
        meta: [
          {name: '设置'},
          {name: '角色管理'}
        ],
        component: () => import('@/view/setting/role')
      },
      {
        path: '/user-permission',
        name: 'user-permission',
        meta: [
          {name: '设置'},
          {name: '权限列表'}
        ],
        component: () => import('@/view/setting/permissionsList')
      }
    ]
  }
]
