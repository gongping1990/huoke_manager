import axios from "../../http";
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
    return axios.get("/umg/admin/user/list", {params});
  },
  // 新增用户权限角色列表（设置）
  roleList(params) {
    return axios.get("/umg/admin/user/role/list", {params});
  },
  // 新增管理员
  addAdmin(params) {
    return axios.post("/umg/admin/user/save", qs.stringify(params));
  },
  // 角色管理
  roleListCount(params) {
    return axios.get("/umg/admin/user/role/listCountUser",{params});
  },
  // 用户信息
  userAdminInfo(params) {
    return axios.get("/umg/admin/user/loginInfo",{params});
  },
  // 修改管理员密码
  updatePassword(params) {
    return axios.post("/umg/admin/updatePassword",qs.stringify(params));
  },
  // 启用禁用
  changeAdminStatus(params) {
    return axios.post("/umg/admin/disable",qs.stringify(params));
  },
  // 修改其他管理员密码
  changeOtherAdminPassword(params) {
    return axios.post("/umg/admin/changePassword",qs.stringify(params));
  },
  // 修改其他管理员信息
  updateAdmin(params) {
    return axios.post("/umg/admin/user/update",qs.stringify(params));
  },
  // 修改其他管理员信息
  addRole(params) {
    return axios.post("/umg/admin/user/addRole",qs.stringify(params));
  },
  // 修改其他管理员信息
  removeRole(params) {
    return axios.post("/umg/admin/user/removeRole",qs.stringify(params));
  },
  // 权限列表信息
  permissionsList(params) {
    return axios.get("/umg/admin/permissions", {params});
  },
  // 修改其他管理员信息
  updateRolePerm(params) {
    return axios.post("/umg/admin/user/updateRolePerm",qs.stringify(params));
  },
  // 修改其他管理员信息
  listBizSystem(params) {
    return axios.post("/umg/listBizSystem",qs.stringify(params));
  },
  // 修改其他管理员信息
  roleListMenu(params) {
    return axios.get("/umg/admin/menu/list",{params});
  },
  // 修改其他管理员信息
  roleAdd(params) {
    return axios.post("/umg/admin/menu/add",qs.stringify(params));
  },
  // 修改其他管理员信息
  roleUpdate(params) {
    return axios.post("/umg/admin/menu/update",qs.stringify(params));
  },
  // 修改其他管理员信息
  roleRemove(params) {
    return axios.post("/umg/admin/menu/remove",qs.stringify(params));
  }
};

export default admin;
