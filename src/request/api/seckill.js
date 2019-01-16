import axios from '../http'
import qs from 'qs'

const seckill = {
  // 获取列表
  getList(params) {
    return axios.get('/seckill/listAllByPage', {params: params})
  },

  // 删除
  closeSecKill(params) {
    return axios.post('/seckill/updateClose',  params)
  },

  // 新增
  addSecKill(params) {
    return axios.post('/seckill/add',  params)
  },

  // 修改
  upadteSecKill(params) {
    return axios.post('/seckill/edit',  params)
  }
}

export default seckill
