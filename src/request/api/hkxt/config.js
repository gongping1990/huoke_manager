import axios from '../../http'
import qs from 'qs'

const config = {
  homeRecommendList(params) {
    return axios.get('/sch/config/homepage/list')
  },
  getHomeRecommendItem(params) {
    return axios.get('/sch/config/homepage/list',{params: params})
  },
  // 新增
  addHomeRecommend(params) {
    return axios.post('/sch/config/homepage/add', params)
  },
  // 修改
  updateHomeRecommend(params) {
    return axios.post('/sch/config/homepage/update', params)
  },
  // 删除
  delHomeRecommend(params) {
    return axios.post('/sch/config/homepage/remove', qs.stringify(params))
  },
  // 年级
  gradeList(params) {
    return axios.get('/declaim/config/grade/list', params)
  }
}

export default config
