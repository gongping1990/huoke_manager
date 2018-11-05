import axios from '../http'
import qs from 'querystring'

const lesson = {
  // 根据课时id查看课时信息
  getById(params) {
    return axios.get('/course/lesson/viewLesson', {params})
  },
  // 获取课时列表
  listLessonGroups(params) {
    return axios.get('/lesson/group/listLessonGroups', {params})
  },
  // 增加播放量
  updateReadNum(params) {
    return axios.post('/course/lesson/user/updateReadNum', qs.stringify(params))
  },
  // 更新课时进度
  insertOrUpdate(params) {
    return axios.post('/course/lesson/progress/insertOrUpdate', qs.stringify(params))
  },
  // 分享信息
  shareInfo(params) {
    return axios.post('/lesson/share/save', qs.stringify(params))
  },
  // 分享课时
  shareTakeLesson(params) {
    return axios.get('/lesson/share',{params})
  },
  // 抢课
  shareJoin(params) {
    return axios.post('/lesson/share/join', qs.stringify(params))
  }
}

export default lesson
