import axios from '../http'
import qs from 'qs'

const banner = {
  // 获取banner列表
  bannerList(params) {
    return axios.get('/banner/queryPage',{params: params})
  },

  // 修改排序值
  updateSortNum(params) {
    return axios.post('/banner/updateSortNum',qs.stringify(params))
  },

  // 创建
  addBanner(params) {
    return axios.post('/banner/save', qs.stringify(params))
  },

  // 修改
  updateBanner(params) {
    return axios.post('/banner/update', qs.stringify(params))
  },

  // 删除banner
  delBanner(params) {
    return axios.post('/banner/removeById', qs.stringify(params))
  },

  // 获取首页topbar
  getTopbar() {
    return axios.get('/banner/topbar/get')
  },

  // 修改首页topbar
  updateTopbar(params) {
    return axios.post('/banner/topbar/update', qs.stringify(params))
  }
}

export default banner
