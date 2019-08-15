import Main from '@/view/main'

export const jsdRouter =[
  {
    path: '/teacherCorrection',
    name: 'teacherCorrection',
    title: '教师批改',
    component: Main,
    children: [
      {
        path: '/jsd_todayWork',
        name: 'jsd_todayWork',
        meta: [
          {name: '教师批改'},
          {name: '今日工作'}
        ],
        component: () => import('@/view/jsd/todayWork/todayWork')
      },
      {
        path: '/jsd_historicalRecords',
        name: 'jsd_historicalRecords',
        meta: [
          {name: '教师批改'},
          {name: '历史记录'}
        ],
        component: () => import('@/view/jsd/historicalRecords/historicalRecords')
      },
      {
        path: '/jsd_historicalData',
        name: 'jsd_historicalData',
        meta: [
          {name: '教师批改'},
          {name: '历史数据'}
        ],
        component: () => import('@/view/jsd/historicalData/historicalData')
      }
    ]
  },
  {
    path: '/adminUser',
    name: 'adminUser',
    title: '管理人员',
    component: Main,
    children: [
      {
        path: '/jsd_adminTeacher',
        name: 'jsd_adminTeacher',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '教师管理'
          }
        ],
        component: () => import('@/view/jsd/teacherAdmin/teacherAdmin')
      },

    ]
  }
]
