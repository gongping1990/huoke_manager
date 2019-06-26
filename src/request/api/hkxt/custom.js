import axios from '../../http'
import qs from 'qs'

const custom = {
  // 获取列表
  getAppList(params) {
    return axios.get('/sch/custom/appList', {params: params})
  },

  // 同步
  pullFansUser(params) {
    return axios.post('/sch/custom/pullFansUser', params)
  },

  // 获取信息
  getInfo(params) {
    return axios.get('/sch/custom/userSync/get', {params: params})
  },

  // 获取信息
  getWxSendList(params) {
    return axios.get('/sch/custom/listWxSendTask', {params: params})
  },

  // 撤销微信自定义消息
  cancelWxTask(params) {
    return axios.post("/sch/custom/cancelWxTask", qs.stringify(params));
  },

  // 重新发送
  reCustomSendFailed(params) {
    return axios.post("/sch/custom/reSendFailed",qs.stringify(params));
  },

  // 获取微信模板列表
  getListCustomTemplate(params) {
    return axios.get("/sch/custom/listCustomTemplate", {params: params});
  },

  // 创建微信自定义消息
  addWxTask(params) {
    return axios.post("/sch/custom/sendWxTask", params);
  },

  // 获取微信发送记录
  getWxMessageList(params) {
    return axios.get("/sch/custom/queryWxTemplateMessagePage",{params: params});
  },

  // 获取第三方用户
  userList(params) {
    return axios.get("/sch/custom/queryUserPage",{params: params});
  },

  // 获取第三方模板
  getTemplateInfo(params) {
    return axios.get("/sch/custom/getTemplateInfo",{params: params});
  },
  // 获取列表
  blackList(params) {
    return axios.get('/sch/custom/queryUserPage', {params: params})
  },

  // 删除
  delBlack(params) {
    return axios.post('/sch/custom/deleteList',  params)
  },

  // 新增
  addBlack(params) {
    return axios.post('/sch/custom/saveList',  params)
  }
}

export default custom
