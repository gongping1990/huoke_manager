import axios from '../http'
import qs from 'qs'

const operation = {
  // 获取反馈列表
  operationalLocationList(params) {
    return axios.get('/operation/queryPage', {params: params})
  },

  // huifu
  addOperation(params) {
    return axios.post('/operation/save',  qs.stringify(params))
  },

  // 修改
  updateOperation(params) {
    return axios.post('/operation/update',  qs.stringify(params))
  },

  // 排序
  updateSortNum(params) {
    return axios.post('/operation/updateSortNum', qs.stringify(params))
  },

  // 删除
  delOperation(params) {
    return axios.post('/operation/removeById',  qs.stringify(params))
  }
}

export default operation
