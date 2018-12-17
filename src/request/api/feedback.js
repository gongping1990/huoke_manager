import axios from '../http'
import qs from 'qs'

const feedback = {
  // 获取反馈列表
  feedbackList(params) {
    return axios.get('/feedback/listByPage', {params: params})
  },

  // huifu
  addReply(params) {
    return axios.post('/feedback/addReply',  qs.stringify(params))
  }
}

export default feedback
