import axios from '../../http'
import qs from 'qs'

const popManage = {
  // 获取反馈列表
  popManageList(params) {
    return axios.get('/sch/popManage/queryPage', {params: params})
  },

  // huifu
  addPopManage(params) {
    return axios.post('/sch/popManage/save',  qs.stringify(params))
  },

  // 修改
  updatePopManage(params) {
    return axios.post('/sch/popManage/update',  qs.stringify(params))
  },

  // 排序
  updateSortNum(params) {
    return axios.post('/sch/popManage/updateSortNum', qs.stringify(params))
  },

  // 删除
  delPopManage(params) {
    return axios.post('/sch/popManage/removeById',  qs.stringify(params))
  }
}

export default popManage
