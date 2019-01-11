import axios from '../http'
import qs from 'qs'

const trusteeship = {
  getList(params) {
    return axios.get('/trusteeship/list',{params: params})
  },
  getDetail(params) {
    return axios.get('/trusteeship/getDetails',{params: params})
  },
  // 新增
  saveTrusteeship(params) {
    return axios.post('/trusteeship/save', qs.stringify(params))
  },
  // 删除
  delTrusteeship(params) {
    return axios.post('/trusteeship/delete', qs.stringify(params))
  }
}

export default trusteeship
