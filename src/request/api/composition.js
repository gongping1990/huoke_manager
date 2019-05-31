import axios from '../http'
import qs from 'qs'

const composition = {
  // 课程信息
  getDefultCourse(params) {
    return axios.get('/composition/course/getDefultCourse', {params: params})
  },

  // 新增课程信息
  tbzwCourseAdd(params) {
    return axios.post('/composition/course/save', qs.stringify(params))
  },

  // 修改课程信息
  tbzwCourseUpdate(params) {
    return axios.post('/composition/course/update', qs.stringify(params))
  },

  // 课时列表
  getQueryLessonPage(params) {
    return axios.get('/composition/lesson/queryLessonPage', {params: params})
  },

  // 删除课节
  removeLessonById(params) {
    return axios.get('/composition/lesson/removeLessonById', {params: params})
  },

  // 删除课时
  delPoemLessonPeriod(params) {
    return axios.get('/composition/lesson/removeLessonPeriodById', {params: params})
  },

  // 新增课节
  saveLesson(params) {
    return axios.post('/composition/lesson/saveLesson', qs.stringify(params))
  },

  // 修改课节
  updateLesson(params) {
    return axios.post('/composition/lesson/updateLesson', qs.stringify(params))
  },

  // 新增教师
  updateLessonTeacher(params) {
    return axios.post('/composition/lesson/updateLessonTeacher', qs.stringify(params))
  },

  // 新增课时引导
  uploadGuideAudio(params) {
    return axios.post('/composition/lesson/uploadGuideAudio', qs.stringify(params))
  },

  // 素材评分
  listByLessonScore(params) {
    return axios.post('/composition/mark/listByLessonScore', qs.stringify(params))
  },

  // 获取课程答案
  listByLessonQuestion(params) {
    return axios.post('/composition/lesson/listByLessonQuestion', qs.stringify(params))
  },

  // 新增课程答案
  saveLessonQuestion(params) {
    return axios.post('/composition/lesson/saveLessonQuestion', qs.stringify(params))
  },

  // 删除-教师
  removeTeacherById(params) {
    return axios.post('/composition/teacher/removeTeacherById', qs.stringify(params))
  },

  // 新增-教师
  saveTeacher(params) {
    return axios.post('/composition/teacher/saveTeacher', qs.stringify(params))
  },

  // 查询-教师
  getTeacherList(params) {
    return axios.get('/composition/teacher/queryPage', {params: params})
  },

  // 修改-教师
  updateTeacher(params) {
    return axios.post('/composition/teacher/updateTeacher', qs.stringify(params))
  },

  // 渠道列表
  listByChannel(params) {
    return axios.get('/composition/channel/listByChannel', {params: params})
  },

  // 新增渠道
  addChannel(params) {
    return axios.post('/composition/channel/addChannel', qs.stringify(params))
  },

  // 修改渠道
  updateChannel(params) {
    return axios.post('/composition/channel/updateChannel', qs.stringify(params))
  },

  // 渠道详情
  listByChannelDetails(params) {
    return axios.get('/composition/channel/listByChannelDetails', {params: params})
  },

  // 留存数据
  listRetentionRate(params) {
    return axios.get('/composition/statistics/listRetentionRate', {params: params})
  },

  // 日交易数据
  userStatisticsToday(params) {
    return axios.get('/composition/statistics/today', {params: params})
  },

  // 总计
  userStatisticsTotal(params) {
    return axios.get('/composition/statistics/total', {params: params})
  },

  // 图表
  userStatisticsLineChart(params) {
    return axios.get('/composition/statistics/lineChart', {params: params})
  }
}

export default composition
