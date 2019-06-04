import axios from "../http";
import qs from "qs";

const user = {
  // 获取用户信息
  userList(params) {
    return axios.get("/user/queryUser", {params});
  },
  // 用户列表信息
  getUserPage(params) {
    return axios.get("/user/queryUserPage", {params});
  },
  // 禁用启用用户
  changeUserStatus(params) {
    return axios.post("/user/updateUserDisabledStatusById",qs.stringify(params));
  },
  // 禁用启用用户-朗读
  ldChangeUserStatus(params) {
    return axios.post("/declaim/user/updateUserDisabledStatusById",qs.stringify(params));
  },
  // 获取用户详情
  getUserInfo(params) {
    return axios.get("/user/queryUserInfoById",{params});
  },
  // 用户日志
  userLoginInfo(params) {
    return axios.get("/user/queryLoginInfoById", {params});
  },
  // 新增虚拟用户
  addVirtualUser(params) {
    return axios.post("/user/saveVirtualUser", qs.stringify(params));
  },
  // 更新虚拟用户
  uploadVirtualUser(params) {
    return axios.post("/user/updateVirtualUser", qs.stringify(params));
  },
  // 获取微信工作中号
  getWxList(params) {
    return axios.get("/user/listMpAppid");
  },
  // 获取微信工作中号(消息管理用的)
  getMessageWxList(params) {
    return axios.get("/user/app/list");
  },
  // 获取短信推送消息
  getSmsList(params) {
    return axios.get("/user/listSmsTemplate",{params: params});
  },
  // 获取短信推送记录
  getSmsMessageList(params) {
    return axios.get("/user/listSmsMessage",{params: params});
  },
  // 获取微信推送消息
  getWxTemplateList(params) {
    return axios.get("/user/listWxTemplate",{params: params});
  },
  // 重新发送
  reSendFailed(params) {
    return axios.post("/user/reSendFailed",qs.stringify(params));
  },
  // 获取微信发送记录
  getWxMessageList(params) {
    return axios.get("/user/queryWxTemplateMessagePage",{params: params});
  },
  // 获取自定义短信消息
  getSmsSendList(params) {
    return axios.get("/user/listSmsSendTask",{params: params});
  },
  // 获取微信短信消息
  getWxSendList(params) {
    return axios.get("/user/listWxSendTask",{params: params});
  },
  // 撤销短信自定义消息
  cancelSmsTask(params) {
    return axios.post("/user/cancelSmsTask", qs.stringify(params));
  },
  // 撤销微信自定义消息
  cancelWxTask(params) {
    return axios.post("/user/cancelWxTask", qs.stringify(params));
  },
  // 创建短信自定义消息
  addSmsTask(params) {
    return axios.post("/user/sendSmsTask", params);
  },
  // 创建微信自定义消息
  addWxTask(params) {
    return axios.post("/user/sendWxTask", params);
  },
  // 模板类型
  getTemplateInfo(params) {
    return axios.get("/user/getTemplateInfo", {params: params});
  },
  // 获取人数
  getUserCount(params) {
    return axios.get("/user/getUserCount", {params: params});
  },
  // 获取微信模板列表
  getListCustomTemplate(params) {
    return axios.get("/user/listCustomTemplate", {params: params});
  },
  // 获取语文用户列表
  getPrepUserList(params) {
    return axios.get("/prep/preuser/queryUserPage", {params: params});
  },
  // 获取朗读用户列表
  getLdUserList(params) {
    return axios.get("/declaim/user/listUserByPage", {params: params});
  },
  // 获取古诗文用户列表
  getGswUserList(params) {
    return axios.get("/poem/user/listUserByPage", {params: params});
  },
  // 用户禁用启用
  gswChangeStatus(params) {
    return axios.post("/poem/user/updateUserDisabledStatusById", qs.stringify(params));
  },
  // 获取同步作文文用户列表
  getTbzwUserList(params) {
    return axios.get("/composition/user/listUserByPage", {params: params});
  },
  // 用户禁用启用
  TbzwChangeStatus(params) {
    return axios.post("/composition/user/updateUserDisabledStatusById", qs.stringify(params));
  }
};

export default user;
