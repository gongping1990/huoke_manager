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
  // 获取微信发送记录
  getWxMessageList(params) {
    return axios.get("/user/queryWxTemplateMessagePage",{params: params});
  },
  // 获取自定义短信消息
  getSmsSendList(params) {
    return axios.get("/user/listSmsSendTask",{params: params});
  },
  // 撤销自定义消息
  cancelSmsTask(params) {
    return axios.post("/user/cancelSmsTask", qs.stringify(params));
  },
  // 创建自定义消息
  addSmsTask(params) {
    return axios.post("/user/sendSmsTask", params);
  },
  // 模板类型
  getTemplateInfo(params) {
    return axios.get("/user/getTemplateInfo", {params: params});
  },
  // 获取人数
  getUserCount(params) {
    return axios.get("/user/getUserCount", {params: params});
  }
};

export default user;
