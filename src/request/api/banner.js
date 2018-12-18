import axios from '../http'
import qs from 'qs'

const banner = {
  // 获取首页banner
  listDefault() {
    return axios.get('/banner/listDefault')
  },

  // 获取首页topbar
  getTopbar() {
    return axios.get('/banner/topbar/get')
  },

  // 修改首页topbar
  updateTopbar(params) {
    return axios.post('/banner/topbar/update', qs.stringify(params))
  },

}

export default banner
