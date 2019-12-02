import Main from '@/view/main'

export const jsdRouter = [
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
      },
      {
        path: '/tbzw_studentListOne',
        name: 'tbzw_studentListOne',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '学生列表'
          }
        ],
        component: () => import('@/view/jsd/studentList/studentListOne')
      },
      {
        path: '/jsd_dateData',
        name: 'jsd_dateData',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '数据统计'
          }
        ],
        component: () => import('@/view/jsd/dateData/dateData')
      },
    ]
  },
  {
    path: '/automaticCorrection',
    name: 'automaticCorrection',
    title: '自动批改',
    component: Main,
    children: [
      {
        path: '/jsd_correctionConfig',
        name: 'jsd_correctionConfig',
        meta: [
          {
            name: '自动批改'
          },
          {
            name: '批改配置'
          }
        ],
        component: () => import('@/view/jsd/correctionConfig/correctionConfig')
      },
      {
        path: '/jsd_correctionRecord',
        name: 'jsd_correctionRecord',
        meta: [
          {
            name: '自动批改'
          },
          {
            name: '批改记录'
          }
        ],
        component: () => import('@/view/jsd/correctionRecord/correctionRecord')
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
      {
        path: '/jsd_assignmentJobs',
        name: 'jsd_assignmentJobs',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '分配作业'
          }
        ],
        component: () => import('@/view/jsd/assignmentJobs/assignmentJobs')
      },
      {
        path: '/jsd_jobAdmin',
        name: 'jsd_jobAdmin',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '作业记录'
          }
        ],
        component: () => import('@/view/jsd/jobAdmin/jobAdmin')
      },
      {
        path: '/jsd_dataBoard',
        name: 'jsd_dataBoard',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '数据统计'
          }
        ],
        component: () => import('@/view/jsd/dataBoard/dataBoard')
      },
      {
        path: '/jsd_score',
        name: 'jsd_score',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '评分维度'
          }
        ],
        component: () => import('@/view/jsd/score/scoreList')
      },
      {
        path: '/tbzw_studentListTwo',
        name: 'tbzw_studentListTwo',
        meta: [
          {
            name: '管理人员'
          },
          {
            name: '教师管理', url: 'jsd_adminTeacher'
          },
          {
            name: '学生列表'
          }
        ],
        component: () => import('@/view/jsd/studentList/studentListTwo')
      },

    ]
  }
]
