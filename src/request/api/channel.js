import axios from '../http'
import qs from 'qs'

const channel = {
  // 获取列表
  getList(params) {
    return axios.get('/channel/queryPage', {params: params})
  },

  // 获取列表
  getInfoList(params) {
    return axios.get('/channel/listCourseByPage', {params: params})
  },

  // 下载
  downList(params) {
    return axios.get('/channel/download', {params: params})
  },

  // 删除
  delChannel(params) {
    return axios.post('/channel/removeById', params)
  },

  // 新增
  addChannel(params) {
    return axios.post('/channel/save', qs.stringify(params))
  },

  // 修改
  upadteChannel(params) {
    return axios.post('/channel/update', qs.stringify(params))
  }
}

export default channel
