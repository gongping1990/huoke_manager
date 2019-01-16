import axios from '../http'
import qs from 'qs'

const black = {
  // 获取列表
  blackList(params) {
    return axios.get('/black/page', {params: params})
  },

  // 删除
  delBlack(params) {
    return axios.post('/black/deleteList',  params)
  },

  // 新增
  addBlack(params) {
    return axios.post('/black/saveList',  params)
  }
}

export default black
