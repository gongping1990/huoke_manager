import axios from '../../http'
import qs from 'qs'

const poem = {
  // 课程信息
  getCourseByDefult(params) {
    return axios.get('/poem-xym/course/getCourseByDefult', {params: params})
  },

  // 新增课程信息
  poemCourseAdd(params) {
    return axios.post('/poem-xym/course/save', qs.stringify(params))
  },

  // 修改课程信息
  poemCourseUpdate(params) {
    return axios.post('/poem-xym/course/update', qs.stringify(params))
  },

  // 课节列表
  getPoemLessonList(params) {
    return axios.get('/poem-xym/lesson/queryLessonPage', {params: params})
  },

  // 课时列表
  getPoemLessonPeriodList(params) {
    return axios.get('/poem-xym/lesson/queryLessonPeriodPage', {params: params})
  },

  // 删除课节
  delPoemLesson(params) {
    return axios.get('/poem-xym/lesson/removeLessonById', {params: params})
  },

  // 删除课时
  delPoemLessonPeriod(params) {
    return axios.get('/poem-xym/lesson/removeLessonPeriodById', {params: params})
  },

  // 新增课节
  addPoemLesson(params) {
    return axios.post('/poem-xym/lesson/saveLesson', qs.stringify(params))
  },

  // 修改课节
  updatePoemLesson(params) {
    return axios.post('/poem-xym/lesson/updateLesson', qs.stringify(params))
  },

  // 新增课时
  addPoemLessonPeriod(params) {
    return axios.post('/poem-xym/lesson/saveLessonPeriod', qs.stringify(params))
  },

  // 修改课时
  updatePoemLessonPeriod(params) {
    return axios.post('/poem-xym/lesson/updateLessonPeriod', qs.stringify(params))
  },

  // 试听
  changeLessonStatus(params) {
    return axios.get('/poem-xym/lesson/updateListeningById', {params: params})
  },

  // 播放列表
  getBroadcastList(params) {
    return axios.get('/poem-xym/course/getBroadcastList', {params: params})
  },

  // 新增
  saveBroadcast(params) {
    return axios.post('/poem-xym/course/saveBroadcast', qs.stringify(params))
  },

  // 修改
  updateBroadcast(params) {
    return axios.post('/poem-xym/course/updateBroadcast', qs.stringify(params))
  },

  // 删除
  removeBroadcast(params) {
    return axios.post('/poem-xym/course/removeBroadcast', qs.stringify(params))
  },

  // 查询手机补卡记录
  listRepairCard(params) {
    return axios.post('/poem-xym/operate/listRepairCard', qs.stringify(params))
  },

  // 查询手机补卡记录
  getUserByPhone(params) {
    return axios.get('/poem-xym/user/getUserByPhone', {params: params})
  },

  // 查询手机补卡记录
  repairCard(params) {
    return axios.post('/poem-xym/operate/repairCard', qs.stringify(params))
  },

  // 渠道列表
  listByChannel(params) {
    return axios.get('/poem-xym/channel/listByChannel', {params: params})
  },

  // 新增渠道
  addChannel(params) {
    return axios.post('/poem-xym/channel/addChannel', qs.stringify(params))
  },

  // 修改渠道
  updateChannel(params) {
    return axios.post('/poem-xym/channel/updateChannel', qs.stringify(params))
  },

  // 渠道详情
  listByChannelDetails(params) {
    return axios.get('/poem-xym/channel/listByChannelDetails', {params: params})
  },

  // 留存数据
  listRetentionRate(params) {
    return axios.get('/poem-xym/statistics/listRetentionRate', {params: params})
  },

  // 日交易数据
  userStatisticsToday(params) {
    return axios.get('/poem-xym/statistics/today', {params: params})
  },

  // 总计
  userStatisticsTotal(params) {
    return axios.get('/poem-xym/statistics/total', {params: params})
  },

  // 图表
  userStatisticsLineChart(params) {
    return axios.get('/poem-xym/statistics/lineChart', {params: params})
  },

  // 图表
  getNewCourseByDefult(params) {
    return axios.get('/poem-xym/course/getNewCourseByDefult', {params: params})
  },

  // 图表
  getLessonContent(params) {
    return axios.get('/poem-xym/lesson/getLessonContent', {params: params})
  },

  // 新课时内容
  editLessonContent(params) {
    return axios.post('/poem-xym/lesson/editLessonContent', qs.stringify(params))
  },

  // 新课时作业
  editLessonContentByHomeWork(params) {
    return axios.post('/poem-xym/lesson/editLessonContentByHomeWork', qs.stringify(params))
  },

  // 二维码
  qrcodeList(params) {
    return axios.get('/poem-xym/reservat/qrcodeList', {params: params})
  },

  // 新增/修改
  saveQrcode(params) {
    return axios.post('/poem-xym/reservat/saveQrcode',  qs.stringify(params))
  },

  // 删除二维码
  deleteQrcode(params) {
    return axios.post('/poem-xym/reservat/deleteQrcode',  qs.stringify(params))
  },

  // 预约列表
  reservatRecordPage(params) {
    return axios.get('/poem-xym/reservat/reservatRecordPage', {params: params})
  },

  // 审核
  recordAudit(params) {
    return axios.post('/poem-xym/reservat/audit',  qs.stringify(params))
  },

  // 发货列表
  gswGoodsList(params) {
    return axios.get('/poem-xym/goods/goodsList', {params: params})
  },

  // 发货
  sendOutGoods(params) {
    return axios.post('/poem-xym/goods/sendOutGoods', qs.stringify(params))
  },

  // 作业
  listHomeworkByPage(params) {
    return axios.get('/poem-xym/study/listHomeworkByPage', {params: params})
  },
  // 作业
  removeHomework(params) {
    return axios.post('/poem-xym/study/removeHomework', qs.stringify(params))
  },
  // 作业
  replyHomework(params) {
    return axios.post('/poem-xym/study/replyHomework', qs.stringify(params))
  },
  // 作业
  getCouponConfig(params) {
    return axios.get('/poem-xym/coupon/getCouponConfig', {params: params})
  },
  // 作业
  setCouponConfig(params) {
    return axios.post('/poem-xym/coupon/setCouponConfig', params)
  },

  listQuestion(params) {
    return axios.get('/poem-xym/lesson/listQuestion', {params: params})
  },

  saveQuestion(params) {
    return axios.post('/poem-xym/lesson/saveQuestion', params)
  },
  // 作业
  fourActiveConfig(params) {
    return axios.get('/poem-xym/active/fourActiveConfig', {params: params})
  },
  deleteQuestion(params) {
    return axios.get('/poem-xym/lesson/deleteQuestion', {params: params})
  },
  getNewCourseLessonList(params) {
    return axios.get('/poem-xym/lesson/getNewCourseLessonList', {params: params})
  }
}

export default poem
