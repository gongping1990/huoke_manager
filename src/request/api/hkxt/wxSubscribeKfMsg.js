import axios from '../../http'
import qs from 'qs'

const wxSubscribeKfMsg = {
  // 获取列表
  getList(params) {
    return axios.get('/sch/wxSubscribeKfMsg/getPage', {params: params})
  },

  // 删除
  delete(params) {
    return axios.post('/sch/wxSubscribeKfMsg/delete',  qs.stringify(params))
  },

  // 新增
  saveOrUpdate(params) {
    return axios.post('/sch/wxSubscribeKfMsg/saveOrUpdate',  qs.stringify(params))
  }
}

export default wxSubscribeKfMsg
