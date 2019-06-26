import axios from '../../http'
import qs from 'qs'

const seckill = {
  // 获取列表
  getList(params) {
    return axios.get('/sch/seckill/listAllByPage', {params: params})
  },

  // 删除
  closeSecKill(params) {
    return axios.post('/sch/seckill/updateClose',  qs.stringify(params))
  },

  // 新增
  addSecKill(params) {
    return axios.post('/sch/seckill/add',  qs.stringify(params))
  },

  // 修改
  upadteSecKill(params) {
    return axios.post('/sch/seckill/edit',  qs.stringify(params))
  }
}

export default seckill
