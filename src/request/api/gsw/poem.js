import axios from '../../http'
import qs from 'qs'

const poem = {
  // 课程信息
  getCourseByDefult(params) {
    return axios.get('/poem/course/getCourseByDefult', {params: params})
  },

  // 新增课程信息
  poemCourseAdd(params) {
    return axios.post('/poem/course/save', qs.stringify(params))
  },

  // 修改课程信息
  poemCourseUpdate(params) {
    return axios.post('/poem/course/update', qs.stringify(params))
  },

  // 课节列表
  getPoemLessonList(params) {
    return axios.get('/poem/lesson/queryLessonPage', {params: params})
  },

  // 课时列表
  getPoemLessonPeriodList(params) {
    return axios.get('/poem/lesson/queryLessonPeriodPage', {params: params})
  },

  // 删除课节
  delPoemLesson(params) {
    return axios.get('/poem/lesson/removeLessonById', {params: params})
  },

  // 删除课时
  delPoemLessonPeriod(params) {
    return axios.get('/poem/lesson/removeLessonPeriodById', {params: params})
  },

  // 新增课节
  addPoemLesson(params) {
    return axios.post('/poem/lesson/saveLesson', qs.stringify(params))
  },

  // 修改课节
  updatePoemLesson(params) {
    return axios.post('/poem/lesson/updateLesson', qs.stringify(params))
  },

  // 新增课时
  addPoemLessonPeriod(params) {
    return axios.post('/poem/lesson/saveLessonPeriod', qs.stringify(params))
  },

  // 修改课时
  updatePoemLessonPeriod(params) {
    return axios.post('/poem/lesson/updateLessonPeriod', qs.stringify(params))
  },

  // 试听
  changeLessonStatus(params) {
    return axios.get('/poem/lesson/updateListeningById', {params: params})
  },

  // 播放列表
  getBroadcastList(params) {
    return axios.get('/poem/course/getBroadcastList', {params: params})
  },

  // 新增
  saveBroadcast(params) {
    return axios.post('/poem/course/saveBroadcast', qs.stringify(params))
  },

  // 修改
  updateBroadcast(params) {
    return axios.post('/poem/course/updateBroadcast', qs.stringify(params))
  },

  // 删除
  removeBroadcast(params) {
    return axios.post('/poem/course/removeBroadcast', qs.stringify(params))
  },

  // 查询手机补卡记录
  listRepairCard(params) {
    return axios.post('/poem/operate/listRepairCard', qs.stringify(params))
  },

  // 查询手机补卡记录
  getUserByPhone(params) {
    return axios.get('/poem/user/getUserByPhone', {params: params})
  },

  // 查询手机补卡记录
  repairCard(params) {
    return axios.post('/poem/operate/repairCard', qs.stringify(params))
  },

  // 渠道列表
  listByChannel(params) {
    return axios.get('/poem/channel/listByChannel', {params: params})
  },

  // 新增渠道
  addChannel(params) {
    return axios.post('/poem/channel/addChannel', qs.stringify(params))
  },

  // 修改渠道
  updateChannel(params) {
    return axios.post('/poem/channel/updateChannel', qs.stringify(params))
  },

  // 渠道详情
  listByChannelDetails(params) {
    return axios.get('/poem/channel/listByChannelDetails', {params: params})
  },

  // 留存数据
  listRetentionRate(params) {
    return axios.get('/poem/statistics/listRetentionRate', {params: params})
  },

  // 日交易数据
  userStatisticsToday(params) {
    return axios.get('/poem/statistics/today', {params: params})
  },

  // 总计
  userStatisticsTotal(params) {
    return axios.get('/poem/statistics/total', {params: params})
  },

  // 图表
  userStatisticsLineChart(params) {
    return axios.get('/poem/statistics/lineChart', {params: params})
  }
}

export default poem
