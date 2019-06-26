import axios from '../../http'
import qs from 'querystring'

const course = {
   // 朗读-教材列表
  ldCourseList(params) {
    return axios.get(`/declaim/course/queryPage`, {params: params})
  },
  // 朗读-禁用
  ldChangeStatus(params) {
    return axios.post(`/declaim/course/disabled`, qs.stringify(params))
  },
  // 朗读-新增
  ldAddCourse(params) {
    return axios.post(`/declaim/course/save`, qs.stringify(params))
  },
  // 朗读-删除
  ldDelList(params) {
    return axios.post(`/declaim/course/removeById`, qs.stringify(params))
  },
  // 朗读-修改
  ldUpdateList(params) {
    return axios.post(`/declaim/course/update`, qs.stringify(params))
  },
  // 朗读-排序
  ldUpdateSortNum(params) {
    return axios.post(`/declaim/course/updateSortNum`, qs.stringify(params))
  },
  // 朗读-修改-课程内容
  ldUpdateContentCourse(params) {
    return axios.post(`/declaim/course/updateContentCourse`, qs.stringify(params))
  },
  // 朗读-修改-音频地址
  ldUpdateAudioCourse(params) {
    return axios.post(`/declaim/course/updateAudioCourse`, qs.stringify(params))
  },
  // 朗读-修改-图片地址
  ldUpdateAchievementCourse(params) {
    return axios.post(`/declaim/course/updateAchievementCourse`, qs.stringify(params))
  }
}

export default course
