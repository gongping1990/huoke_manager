import axios from '../../http'
import qs from 'querystring'

const jsdJob = {
  listTeacherWorkByPage(params) {
    return axios.get(`/homework/job/listTeacherWorkByPage`, { params })
  },
  listManagerWorkByPage(params) {
    return axios.get(`/homework/job/listManagerWorkByPage`, { params })
  },
  praise(params) {
    return axios.post(`/homework/job/praise`, qs.stringify(params))
  },
  reAllotJob(params) {
    return axios.post(`/homework/job/reAllotJob`, params)
  },
  removeHomework(params) {
    return axios.post(`/homework/job/removeHomework`, qs.stringify(params))
  },
  replyHomework(params) {
    return axios.post(`/homework/job/replyHomework`, qs.stringify(params))
  },
  listHomeWorkLog(params) {
    return axios.get(`/homework/job/listHomeWorkLog`, { params })
  },
  updatePhones(params) {
    return axios.post(`/homework/job/updatePhones`, params)
  },
  listWarnMessagePage(params) {
    return axios.get(`/homework/job/listWarnMessagePage`, { params })
  },
  remindReSubmit(params) {
    return axios.post(`/homework/job/remindReSubmit`, params)
  },
  listMyWorkJobCountByPage(params) {
    return axios.get(`/homework/job/listMyWorkJobCountByPage`, { params })
  },
  listWorkJobCountByPage(params) {
    return axios.get(`/homework/job/listWorkJobCountByPage`, { params })
  },
  viewTeacherDateCount(params) {
    return axios.get(`/homework/job/viewTeacherDateCount`, { params })
  },
  todayWorkJobCount(params) {
    return axios.get(`/homework/job/todayWorkJobCount`, { params })
  },
  topGood(params) {
    return axios.get(`/homework/job/topGood`, { params })
  },
  topHandleRate(params) {
    return axios.get(`/homework/job/topHandleRate`, { params })
  },
  topHandled(params) {
    return axios.get(`/homework/job/topHandled`, { params })
  },
  topReplytime(params) {
    return axios.get(`/homework/job/topReplytime`, { params })
  },
  listDaySumWorkJobCountByPage(params) {
    return axios.get(`/homework/job/listDaySumWorkJobCountByPage`, { params })
  },
  sumWorkJobCount(params) {
    return axios.get(`/homework/job/sumWorkJobCount`, { params })
  },
  getLastActiveMessage(params) {
    return axios.get(`/homework/job/getLastActiveMessage`, { params })
  },
  getTeacherRemind(params) {
    return axios.get(`/homework/job/getTeacherRemind`, { params })
  },
  getLearnDTO(params) {
    return axios.get(`/homework/job/getLearnDTO`, { params })
  },
  listLessonProgress(params) {
    return axios.get(`/homework/job/listLessonProgress`, { params })
  },
  moveNOReplyHomework(params) {
    return axios.post(`/homework/job/moveNOReplyHomework`, params)
  },
  listHomeWorkLogByLesson(params) {
    return axios.get(`/homework/job/listHomeWorkLogByLesson`, { params })
  },
  listBase(params) {
    return axios.get(`/homework/job/course/listBase`, { params })
  },
  listRuleByPage(params) {
    return axios.get(`/homework/job/listRuleByPage`, { params })
  },
  addOrUpdateRule(params) {
    return axios.post(`/homework/job/addOrUpdateRule`, params)
  },
  removeRule(params) {
    return axios.post(`/homework/job/removeRule`, qs.stringify(params))
  },
  changeRuleStatus(params) {
    return axios.post(`/homework/job/changeRuleStatus`, qs.stringify(params))
  },
  getRuleStatus(params) {
    return axios.post(`/homework/job/getRuleStatus`, qs.stringify(params))
  },
  viewWork(params) {
    return axios.get('/homework/job/viewWork', { params })
  },
  uploadReplyImg(params) {
    return axios.post('/homework/job/uploadReplyImg', qs.stringify(params))
  },
  reviewReplyHomework(params) {
    return axios.post(`/homework/job/reviewReplyHomework`, qs.stringify(params))
  }
}

export default jsdJob
