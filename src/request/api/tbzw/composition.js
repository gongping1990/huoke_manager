import axios from '../../http'
import qs from 'qs'

const composition = {
  // 课程信息
  getDefultCourse(params) {
    return axios.get('/compositionv2/course/getDefultCourse', {params: params})
  },

  // 新增课程信息
  tbzwCourseAdd(params) {
    return axios.post('/compositionv2/course/save', qs.stringify(params))
  },

  // 修改课程信息
  tbzwCourseUpdate(params) {
    return axios.post('/compositionv2/course/update', qs.stringify(params))
  },

  // 课时列表
  getQueryLessonPage(params) {
    return axios.get('/compositionv2/lesson/queryLessonPage', {params: params})
  },

  // 删除课节
  removeLessonById(params) {
    return axios.get('/compositionv2/lesson/removeLessonById', {params: params})
  },

  // 删除课时
  delPoemLessonPeriod(params) {
    return axios.get('/compositionv2/lesson/removeLessonPeriodById', {params: params})
  },

  // 新增课节
  saveLesson(params) {
    return axios.post('/compositionv2/lesson/saveLesson', qs.stringify(params))
  },

  // 修改课节
  updateLesson(params) {
    return axios.post('/compositionv2/lesson/updateLesson', qs.stringify(params))
  },

  // 新增教师
  updateLessonTeacher(params) {
    return axios.post('/compositionv2/lesson/updateLessonTeacher', qs.stringify(params))
  },

  // 新增课时引导
  uploadGuideAudio(params) {
    return axios.post('/compositionv2/lesson/uploadGuideAudio', qs.stringify(params))
  },

  // 新增作业
  saveHomeWork(params) {
    return axios.post('/compositionv2/lesson/saveHomeWork', qs.stringify(params))
  },

  // 素材评分
  listByLessonScore(params) {
    return axios.post('/compositionv2/mark/listByLessonScore', qs.stringify(params))
  },

  // 获取课程答案
  listByLessonQuestion(params) {
    return axios.post('/compositionv2/lesson/listByLessonQuestion', qs.stringify(params))
  },

  // 新增课程答案
  saveLessonQuestion(params) {
    return axios.post('/compositionv2/lesson/saveLessonQuestion', params)
  },

  // 删除课程答案
  removeLessonQuestion(params) {
    return axios.get('/compositionv2/lesson/removeLessonQuestion', {params: params})
  },

  // 删除-教师
  removeTeacherById(params) {
    return axios.post('/compositionv2/teacher/removeTeacherById', qs.stringify(params))
  },

  // 新增-教师
  saveTeacher(params) {
    return axios.post('/compositionv2/teacher/saveTeacher', qs.stringify(params))
  },

  // 查询-教师
  getTeacherList(params) {
    return axios.get('/compositionv2/teacher/queryPage', {params: params})
  },

  // 修改-教师
  updateTeacher(params) {
    return axios.post('/compositionv2/teacher/updateTeacher', qs.stringify(params))
  },

  // 渠道列表
  listByChannel(params) {
    return axios.get('/compositionv2/channel/listByChannel', {params: params})
  },

  // 新增渠道
  addChannel(params) {
    return axios.post('/compositionv2/channel/addChannel', qs.stringify(params))
  },

  // 修改渠道
  updateChannel(params) {
    return axios.post('/compositionv2/channel/updateChannel', qs.stringify(params))
  },

  // 渠道详情
  listByChannelDetails(params) {
    return axios.get('/compositionv2/channel/listByChannelDetails', {params: params})
  },

  // 留存数据
  listRetentionRate(params) {
    return axios.get('/compositionv2/statistics/listRetentionRate', {params: params})
  },

  // 日交易数据
  userStatisticsToday(params) {
    return axios.get('/compositionv2/statistics/today', {params: params})
  },

  // 总计
  userStatisticsTotal(params) {
    return axios.get('/compositionv2/statistics/total', {params: params})
  },

  // 图表
  userStatisticsLineChart(params) {
    return axios.get('/compositionv2/statistics/lineChart', {params: params})
  },

  // 轮播
  getBroadcastList(params) {
    return axios.get('/compositionv2/broadcast/getBroadcastList', {params: params})
  },

  // 新增轮播
  saveBroadcast(params) {
    return axios.post('/compositionv2/broadcast/saveBroadcast',  qs.stringify(params))
  },

  // 修改轮播
  updateBroadcast(params) {
    return axios.post('/compositionv2/broadcast/updateBroadcast',  qs.stringify(params))
  },

  // 删除轮播
  removeBroadcast(params) {
    return axios.post('/compositionv2/broadcast/removeBroadcast',  qs.stringify(params))
  },

  // 二维码
  qrcodeList(params) {
    return axios.get('/compositionv2/reservat/qrcodeList', {params: params})
  },

  // 新增/修改
  saveQrcode(params) {
    return axios.post('/compositionv2/reservat/saveQrcode',  qs.stringify(params))
  },

  // 删除二维码
  deleteQrcode(params) {
    return axios.post('/compositionv2/reservat/deleteQrcode',  qs.stringify(params))
  },

  // 预约列表
  reservatRecordPage(params) {
    return axios.get('/compositionv2/reservat/reservatRecordPage', {params: params})
  },

  // 审核
  recordAudit(params) {
    return axios.post('/compositionv2/reservat/audit',  qs.stringify(params))
  },

 // 审核
  visitReservRecord(params) {
    return axios.post('/compositionv2/reservat/visitReservRecord',  qs.stringify(params))
  },

  // 订单
  tbzwOrderList(params) {
    return axios.get('/compositionv2/order/orderList', {params: params})
  },

  // 发货列表
  tbzwGoodsList(params) {
    return axios.get('/compositionv2/order/goodsList', {params: params})
  },

  // 发货
  sendOutGoods(params) {
    return axios.post('/compositionv2/order/sendOutGoods', qs.stringify(params))
  },

  // 作业
  listHomeworkByPage(params) {
    return axios.get('/compositionv2/study/listHomeworkByPage', {params: params})
  },

  // 批改
  replyHomework(params) {
    return axios.post('/compositionv2/study/replyHomework', qs.stringify(params))
  },
  // 删除
  removeHomework(params) {
    return axios.post('/compositionv2/study/removeHomework', qs.stringify(params))
  },

  // 表扬
  praiseHomework(params) {
    return axios.post('/compositionv2/study/praise', qs.stringify(params))
  },

  // 表扬
  updateListeningById(params) {
    return axios.get('/compositionv2/lesson/updateListeningById', {params: params})
  }
}

export default composition
