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
      meta: [{
        name: '首页'
      }],
      component: () => import('@/view/home/home')
    },
    {
      path: 'couponEdit',
      name: 'couponEdit',
      meta: ['营销管理', '优惠券', '编辑优惠券'],
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
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '优惠券'
          }
        ],
        component: () => import('@/view/marketingMangement/coupon/couponList')
      },
      {
        path: '/aloneBuy',
        name: 'aloneBuy',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '单独购'
          }
        ],
        component: () => import('@/view/marketingMangement/aloneBuy/aloneBuyList')
      },
      {
        path: '/friendHelp',
        name: 'friendHelp',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '好友助力'
          }
        ],
        component: () => import('@/view/marketingMangement/friendHelp/friendHelpList')
      },
      {
        path: '/groupLesson',
        name: 'groupLesson',
        meta: [
          {
            name: '营销管理'
          },
          {
            name: '拼课'
          }
        ],
        component: () => import('@/view/marketingMangement/groupLesson/groupLesson')
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
        path: '/topBar',
        name: 'topBar',
        meta: [
          {
            name: '运营管理'
          },
          {
            name: 'topBar管理'
          }
        ],
        component: () => import('@/view/operate/topBar/topBar')
      }
    ]
  },
  {
    path: '/feedback',
    name: 'feedback',
    title: '反馈管理',
    component: Main,
    children: [
      {
        path: '/userFeedback',
        name: 'userFeedback',
        meta: [
          {
            name: '反馈管理'
          },
          {
            name: '用户反馈'
          }
        ],
        component: () => import('@/view/feedback/userFeedback/userFeedback')
      },
      {
        path: '/customerService',
        name: 'customerService',
        meta: [
          {
            name: '反馈管理'
          },
          {
            name: '客服管理'
          }
        ],
        component: () => import('@/view/feedback/customerService/customerService')
      }
    ]
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   title: '用户管理',
  //   component: Main,
  //   children: [
  //     {
  //       path: '/userList',
  //       name: 'userList',
  //       meta: [
  //         {name:'用户管理'},
  //         {name:'用户列表'}
  //       ],
  //       component: () => import('@/view/user/userList')
  //     }
  //   ]
  // },
  // {
  //   path: '/study',
  //   name: 'study',
  //   title: '同步学习',
  //   component: Main,
  //   children: [
  //     {
  //       path: '/subject',
  //       name: 'subject',
  //       meta: [
  //         {name:'同步学习'},
  //         {name:'学科管理'}
  //       ],
  //       component: () => import('@/view/study/subjectManage/subjectList')
  //     },
  //     {
  //       path: '/teachingList',
  //       name: 'teachingList',
  //       meta: [
  //         {name:'同步学习'},
  //         {name:'教材管理'}
  //       ],
  //       component: () => import('@/view/study/teachingManage/tecchingList')
  //     },
  //   ]
  // },
  // {
  //   path: 'setting',
  //   name: 'setting',
  //   title: '用户设置',
  //   component: Main,
  //   children: [
  //     {
  //       path: '/user-setting',
  //       name: 'user-setting',
  //       meta: [
  //         {name:'设置'},
  //         {name:'用户设置'}
  //       ],
  //       component: () => import('@/view/setting')
  //     },
  //     {
  //       path: '/user-info',
  //       name: 'user-info',
  //       meta: [
  //         {name:'设置'},
  //         {name:'个人资料'}
  //       ],
  //       component: () => import('@/view/setting/info')
  //     },
  //     {
  //       path: '/user-role',
  //       name: 'user-role',
  //       meta: [
  //         {name:'设置'},
  //         {name:'角色管理'}
  //       ],
  //       component: () => import('@/view/setting/role')
  //     }
  //   ]
  // }
]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  // page404,
  loginRouter,
  otherRouter,
  ...appRouter,
]
