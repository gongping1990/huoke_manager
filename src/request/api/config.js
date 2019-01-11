import axios from '../http'
import qs from 'qs'

const config = {
  homeRecommendList(params) {
    return axios.get('/config/homepage/list')
  },
  getHomeRecommendItem(params) {
    return axios.get('/config/homepage/list',{params: params})
  },
  // 新增
  addHomeRecommend(params) {
    return axios.post('/config/homepage/add', params)
  },
  // 修改
  updateHomeRecommend(params) {
    return axios.post('/config/homepage/update', params)
  },
  // 删除
  delHomeRecommend(params) {
    return axios.post('/config/homepage/remove', qs.stringify(params))
  }
}

export default config
