import axios from '../../http'
import qs from 'querystring'


const jsdJob = {

  addTeacherDay(params) {
    return axios.post(`/homework/job/addTeacherDay`, qs.stringify(params))
  },
  listTeacherWorkByPage(params) {
    return axios.get(`/homework/job/listTeacherWorkByPage`, {params})
  },
  praise(params) {
    return axios.post(`/homework/job/praise`, qs.stringify(params))
  },
  receiveWork(params) {
    return axios.post(`/homework/job/receiveWork`, qs.stringify(params))
  },
  removeHomework(params) {
    return axios.post(`/homework/job/removeHomework`, qs.stringify(params))
  },
  removeTeacherDay(params) {
    return axios.post(`/homework/job/removeTeacherDay`, qs.stringify(params))
  },
  replyHomework(params) {
    return axios.post(`/homework/job/replyHomework`, qs.stringify(params))
  },
  viewWork(params) {
    return axios.get(`/homework/job/viewWork`, {params})
  },
}

export default jsdJob
