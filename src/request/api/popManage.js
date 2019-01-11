import axios from '../http'
import qs from 'qs'

const popManage = {
  // 获取反馈列表
  popManageList(params) {
    return axios.get('/popManage/queryPage', {params: params})
  },

  // huifu
  addPopManage(params) {
    return axios.post('/popManage/save',  qs.stringify(params))
  },

  // 修改
  updatePopManage(params) {
    return axios.post('/popManage/update',  qs.stringify(params))
  },

  // 排序
  updateSortNum(params) {
    return axios.post('/popManage/updateSortNum', qs.stringify(params))
  },

  // 删除
  delPopManage(params) {
    return axios.post('/popManage/removeById',  qs.stringify(params))
  }
}

export default popManage
