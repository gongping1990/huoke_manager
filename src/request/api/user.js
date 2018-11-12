import axios from "../http";
import qs from "querystring";

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
    return axios.get("/user/updateUserDisabledStatusById",qs.stringify(params));
  },
  // 更改用户信息
  modifyNicknameOrHeadImgUrl(data) {
    return axios.post("/user/modifyNicknameOrHeadImgUrl", qs.stringify(data));
  },
  // 更改用户手机号
  updateUserPhone(data) {
    return axios.post("/user/updateUserPhone", qs.stringify(data));
  },
  // 退出登录
  loginOut() {
    return axios.get("/user/loginOut");
  },
  // 绑定手机号
  bindPhone() {
    return axios.post("/user/bindPhone", qs.stringify(params));
  }
};

export default user;
