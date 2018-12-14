import axios from '../http'
import qs from 'qs'

const goods = {
  courseGoodsList(params) {
    return axios.get('/goods/listPage', {params: params})
  },

  // 获取课程详情
  courseInfo(params) {
    return axios.get('/goods/getCourseGoods', {params: params})
  },

  // 获取单独购列表
  aloneList(params) {
    return axios.get('/goods/listSingleGoodsByPage', {params: params})
  },

  // 新增单独购
  addAlone(params) {
    return axios.post('/goods/addSingle', qs.stringify(params))
  },

  // 修改
  updateAlone(params) {
    return axios.post('/goods/updateSingle', qs.stringify(params))
  },

  // 是否上下架
  changeAloneStatus(params) {
    return axios.post('/goods/changeStatus',  qs.stringify(params))
  },

  // 获取拼课列表
  groupList(params) {
    return axios.get('/goods/listGroupGoodsByPage', {params: params})
  },

  // 新增拼课
  addGroup(params) {
    return axios.post('/goods/addGroup', qs.stringify(params))
  },

  // 修改拼课
  updateGroup(params) {
    return axios.post('/goods/updateGroup', qs.stringify(params))
  },
}

export default goods
