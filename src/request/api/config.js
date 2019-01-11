import axios from '../http'
import qs from 'qs'

const config = {
  homeRecommendList(params) {
    return axios.get('/config/list')
  },
  getHomeRecommendItem(params) {
    return axios.get('/config/list',{params: params})
  },
  // 新增
  addHomeRecommend(params) {
    return axios.post('/config/add', params)
  },
  // 修改
  updateHomeRecommend(params) {
    return axios.post('/config/update', params)
  },
  // 删除
  delHomeRecommend(params) {
    return axios.post('/config/remove', qs.stringify(params))
  }
}

export default config
