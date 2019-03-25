import axios from '../http'
import qs from 'qs'

const work = {
  workList(params) {
    return axios.post('/declaim/work/backstage/pagelist', qs.stringify(params))
  },

  // 禁用启用
  changeWorkChange(params) {
    return axios.post('/declaim/work/disabled', qs.stringify(params))
  },

  // 推荐
  workRecommend(params) {
    return axios.post('/declaim/work/recommend', qs.stringify(params))
  },

  // 删除
  delWork(params) {
    return axios.post('/declaim/work/removeById', qs.stringify(params))
  }
}


export default work
