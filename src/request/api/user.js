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
    return axios.post("/user/updateUserDisabledStatusById",qs.stringify(params));
  },
  // 获取用户详情
  getUserInfo(params) {
    return axios.get("/user/queryUserInfoById",{params});
  },
  // 用户日志
  userLoginInfo(params) {
    return axios.get("/user/queryLoginInfoById", {params});
  }
};

export default user;
