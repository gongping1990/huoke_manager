import axios from "../http";
import qs from "querystring";

const admin = {
  // 登录
  loginAdmin(params) {
    return axios.post("/admin/login", qs.stringify(params));
  },
  // 退出登录
  loginOut(params) {
    return axios.get("/admin/logout", qs.stringify(params));
  }
};

export default admin;
