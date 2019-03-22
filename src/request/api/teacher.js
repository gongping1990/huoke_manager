import axios from '../http'
import qs from 'qs'

const teacher = {
  teacherList(params) {
    return axios.get('/declaim/teacher/queryPage', {params: params})
  },

  // 新增
  addTeacher(params) {
    return axios.post('/declaim/teacher/save', qs.stringify(params))
  },

  // 修改
  updateTeacher(params) {
    return axios.post('/declaim/teacher/update', qs.stringify(params))
  },

  // 删除
  delTeacher(params) {
    return axios.post('/declaim/teacher/removeById',  qs.stringify(params))
  }
}

export default teacher
