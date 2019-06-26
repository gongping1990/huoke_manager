import Main from '@/view/main'
import {hkxtRouter} from './routerSilder/hkxt'
import {hkywRouter} from './routerSilder/hkyw'
import {tbzwRouter} from './routerSilder/tbzw'
import {gswRouter} from './routerSilder/gsw'
import {zlkRouter} from './routerSilder/zlk'
import {ldRouter} from './routerSilder/ld'
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
      meta: [{
        name: '首页'
      }],
      component: () => import('@/view/home/home')
    },
    {
      path: 'couponEdit',
      name: 'couponEdit',
      meta: [
        {name: '营销管理'},
        {name: '优惠券', url: 'coupon'},
        {name: '编辑优惠券'}
      ],
      component: () => import("@/view/marketingMangement/coupon/couponEdit")
    },
    {
      path: 'userInfo',
      name: 'userInfo',
      meta: [
        {name: '用户管理'},
        {name: '用户列表', url: 'userList'},
        {name: '用户详情'}
      ],
      component: () => import("@/view/user/userInfo")
    },
    {
      path: '/teachMain',
      name: 'teachMain',
      meta: [
        {name: '同步学习'},
        {name: '教材管理', url: 'teachingList'},
        {name: '章节管理'}
      ],
      component: () => import('@/view/study/teachingManage/teachMain')
    },
    {
      path: '/courseInfo',
      name: 'courseInfo',
      meta: [
        {name: '同步学习'},
        {name: '教材管理', url: 'teachingList'},
        {name: '章节管理', url: 'teachMain'},
        {name: '课程内容管理'},
      ],
      component: () => import('@/view/study/teachingManage/courseInfo')
    },
    {
      path: '/channelDetail',
      name: 'channelDetail',
      meta: [
        {name: '运营管理'},
        {name: '渠道管理', url: 'channelManagement'},
        {name: '渠道详情'}
      ],
      component: () => import('@/view/operate/channelManagement/channelManagementDetail')
    },
    {
      path: '/editCourse',
      name: 'editCourse',
      meta: [
        {name: '课程管理'},
        {name: '课程列表', url: 'courseList'},
        {name: '编辑课程'}
      ],
      component: () => import('@/view/courseManagement/course/courseEdit')
    },
    {
      path: '/classList',
      name: 'classList',
      meta: [
        {name: '课程管理'},
        {name: '课程列表', url: 'courseList'},
        {name: '课时列表'}
      ],
      component: () => import('@/view/courseManagement/course/classList')
    },
    {
      path: '/dataManagerList',
      name: 'dataManagerList',
      meta: [
        {name: '内容管理'},
        {name: '栏目管理', url: 'column'},
        {name: '资料管理'}
      ],
      component: () => import('@/view/zlk/content/dataManagerList')
    }
  ]
};


// 所有上面定义的路由都要写在下面的routers里
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const routers = [
  // page404,
  loginRouter,
  otherRouter,
  ...hkxtRouter,
  ...tbzwRouter,
  ...gswRouter,
  ...zlkRouter,
  ...ldRouter,
  ...hkywRouter
]
