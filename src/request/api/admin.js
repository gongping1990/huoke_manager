import axios from "../http";
import qs from "querystring";

const admin = {
  // 登录
  loginAdmin(params) {
    return axios.post("/admin/login", qs.stringify(params));
  },
  // 退出登录
  loginOut(params) {
    return axios.get("/admin/logout", {params});
  },
  // 用户管理列表（设置）
  adminList(params) {
    return axios.get("/admin/user/list", {params});
  },
  // 新增用户权限角色列表（设置）
  roleList(params) {
    return axios.get("/admin/user/role/list", {params});
  },
  // 新增管理员
  addAdmin(params) {
    return axios.post("/admin/user/save", qs.stringify(params));
  },
  // 角色管理
  roleListCount(params) {
    return axios.get("/admin/user/role/listCountUser",{params});
  },
  // 用户信息
  userAdminInfo(params) {
    return axios.get("/admin/user/loginInfo",{params});
  },
  // 修改管理员密码
  updatePassword(params) {
    return axios.post("/admin/updatePassword",qs.stringify(params));
  },
  // 启用禁用
  changeAdminStatus(params) {
    return axios.post("/admin/disable",qs.stringify(params));
  },
  // 修改其他管理员密码
  changeOtherAdminPassword(params) {
    return axios.post("/admin/changePassword",qs.stringify(params));
  },
  // 修改其他管理员信息
  updateAdmin(params) {
    return axios.post("/admin/user/update",qs.stringify(params));
  },
};

export default admin;
