import axios from '../../http'
import qs from 'qs'

const operation = {
  // 获取反馈列表
  operationalLocationList(params) {
    return axios.get('/search/operation/queryPage', {params: params})
  },
  // 获取反馈列表
  getSubjectList(params) {
    return axios.get('/search/operation/subject/list', {params: params})
  },

  // huifu
  addOperation(params) {
    return axios.post('/search/operation/save',  qs.stringify(params))
  },
  // huifu
  updateSubject(params) {
    return axios.post('/search/operation/subject/update',  qs.stringify(params))
  },

  // 修改
  updateOperation(params) {
    return axios.post('/search/operation/update',  qs.stringify(params))
  },

  // 排序
  updateSortNum(params) {
    return axios.post('/search/operation/updateSortNum', qs.stringify(params))
  },

  // 删除
  delOperation(params) {
    return axios.post('/search/operation/removeById',  qs.stringify(params))
  }
}

export default operation
