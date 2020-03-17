import axios from '../../http'
import qs from 'qs'


const jsdTeacher = {

  listTeachByPage(params) {
    return axios.get(`/homework/teacher/listTeachByPage`, {params: params})
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
  selectTeacher(params) {
    return axios.get(`/homework/teacher/selectTeacher`, {params: params})
  },
  moveUserToTeacher(params) {
    return axios.post(`/homework/teacher/moveUserToTeacher`, qs.stringify(params))
  },
  listStudentByPage(params) {
    return axios.get("/homework/teacher/listStudentByPage", {params: params});
  },
  listBindUser(params) {
    return axios.get("/homework/teacher/listBindUser", {params: params});
  },
  bindUser(params) {
    return axios.post("/homework/teacher/bindUser", qs.stringify(params));
  }
}

export default jsdTeacher
