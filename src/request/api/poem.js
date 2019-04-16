import axios from '../http'
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
  }
}

export default poem
