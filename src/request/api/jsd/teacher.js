import axios from '../../http'
import qs from 'querystring'


const jsdTeacher = {

  listTeachByPage(params) {
    return axios.post(`/homework/teacher/listTeachByPage`, qs.stringify(params))
  },
  addTeacher(params) {
    return axios.post(`/homework/teacher/add`, qs.stringify(params))
  },
  changeStatusTeacher(params) {
    return axios.post(`/homework/teacher/changeStatus`, qs.stringify(params))
  },
  removeTeacher(params) {
    return axios.post(`/homework/teacher/remove`, qs.stringify(params))
  },
  updateTeacher(params) {
    return axios.post(`/homework/teacher/update`, qs.stringify(params))
  },
  updatePasswordTeacher(params) {
    return axios.post(`/homework/teacher/updatePassword`, qs.stringify(params))
  },
}

export default jsdTeacher
