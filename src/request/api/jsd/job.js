import axios from '../../http'
import qs from 'querystring'


const jsdJob = {

  listTeacherWorkByPage(params) {
    return axios.get(`/homework/job/listTeacherWorkByPage`, {params})
  },
  praise(params) {
    return axios.post(`/homework/job/praise`, qs.stringify(params))
  },
  removeHomework(params) {
    return axios.post(`/homework/job/removeHomework`, qs.stringify(params))
  },
  replyHomework(params) {
    return axios.post(`/homework/job/replyHomework`, qs.stringify(params))
  }
}

export default jsdJob
