import axios from '../../http'
import qs from 'qs'

const goods = {
  courseGoodsList(params) {
    return axios.get('/sch/goods/listPage', {params: params})
  },

  // 获取课程详情
  courseInfo(params) {
    return axios.get('/sch/goods/getCourseGoods', {params: params})
  },

  // 获取单独购列表
  aloneList(params) {
    return axios.get('/sch/goods/listSingleGoodsByPage', {params: params})
  },

  // 新增单独购
  addAlone(params) {
    return axios.post('/sch/goods/addSingle', qs.stringify(params))
  },

  // 修改
  updateAlone(params) {
    return axios.post('/sch/goods/updateSingle', qs.stringify(params))
  },

  // 是否上下架
  changeAloneStatus(params) {
    return axios.post('/sch/goods/changeStatus',  qs.stringify(params))
  },

  // 获取拼课列表
  groupList(params) {
    return axios.get('/sch/goods/listGroupGoodsByPage', {params: params})
  },

  // 新增拼课
  addGroup(params) {
    return axios.post('/sch/goods/addGroup', qs.stringify(params))
  },

  // 修改拼课
  updateGroup(params) {
    return axios.post('/sch/goods/updateGroup', qs.stringify(params))
  },

  // 结束拼课
  closeGroup(params) {
    return axios.post('/sch/goods/updateCloseGroup', qs.stringify(params))
  },

  // 好友助力列表
  friendHelpList(params) {
    return axios.get('/sch/goods/activty/frendHelpList', {params: params})
  },

  // 修改好友助力
  editFriendHelp(params) {
    return axios.post('/sch/goods/activty/frendHelp/save', qs.stringify(params))
  },

  // 修改拼课
  closeFrendHelp(params) {
    return axios.post('/sch/goods/activty/closeFrendHelp', qs.stringify(params))
  }
}

export default goods
