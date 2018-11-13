import Main from '@/view/main'
// import err404 from '@/pages/404'
//otherRouter
// import home from '@/pages/home'

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    requireAuth: false
  },
  component: () => import("@/view/login/index"),
};

// const page404 = {
//   path: '*',
//   name: 'error-404',
//   meta: {
//     title: '404-页面不存在',
//     requireAuth: false
//   },
//   component: err404
// };

// 作为main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  title: 'other',
  component: Main,
  children: [
    {
      path: '/home',
      name: 'Home',
      meta: {
        title: '首页'
      },
      component: () => import('@/view/home/home')
    },
    {
      path: 'couponEdit',
      name: 'couponEdit',
      meta: ['营销管理', '优惠券', '编辑优惠券'],
      component: () => import("@/view/marketingMangement/coupon/couponEdit")
    }
  ]
};
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/market',
    name: 'market',
    title: '营销管理',
    component: Main,
    children: [
      {
        path: '/coupon',
        name: 'coupon',
        meta: ['营销管理', '优惠券'],
        component: () => import('@/view/marketingMangement/coupon/couponList')
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
        path: '/userList',
        name: 'userList',
        meta: ['用户管理', '用户列表'],
        component: () => import('@/view/user/userList')
      }
    ]
  },
  {
    path: 'setting',
    name: 'setting',
    title: '用户设置',
    component: Main,
    children: [
      {
        path: '/user-setting',
        name: 'user-setting',
        meta: ['设置', '用户设置'],
        component: () => import('@/view/setting')
      },
      {
        path: '/user-info',
        name: 'user-info',
        meta: ['设置', '用户资料'],
        component: () => import('@/view/setting/info')
      },
      {
        path: '/role-setting',
        name: 'role-setting',
        meta: ['设置', '角色设置'],
        component: () => import('@/view/setting/role')
      }
    ]
  }
]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  // page404,
  loginRouter,
  otherRouter,
  ...appRouter,
]
