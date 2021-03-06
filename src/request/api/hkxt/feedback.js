import axios from '../../http'
import qs from 'qs'

const feedback = {
  // 获取反馈列表
  feedbackList(params) {
    return axios.get('/sch/feedback/listByPage', {params: params})
  },

  // huifu
  addReply(params) {
    return axios.post('/sch/feedback/addReply',  qs.stringify(params))
  },

  // 审核 、回复
  addCourseReply(params) {
    return axios.post('/sch/feedback/course/addReply',  qs.stringify(params))
  },

  // 获取审核列表
  messageManagementList(params) {
    return axios.get('/sch/feedback/course/listAllByPage',{params: params})
  },

  // 删除
  delCourseMessage(params) {
    return axios.post('/sch/feedback/course/remove',  qs.stringify(params))
  },

  // 置顶
  changeLevel(params) {
    return axios.get('/sch/feedback/course/changeLevel',  {params: params})
  }
}

export default feedback
