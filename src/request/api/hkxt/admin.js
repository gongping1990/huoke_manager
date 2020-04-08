import axios from "../../http";
import qs from "querystring";

const admin = {
  // 登录
  loginAdmin(params) {
    return axios.post("/xumg/admin/login", qs.stringify(params));
  },
  // 退出登录
  loginOut(params) {
    return axios.get("/xumg/admin/logout", {params});
  },
  // 用户管理列表（设置）
  adminList(params) {
    return axios.get("/xumg/admin/user/list", {params});
  },
  // 新增用户权限角色列表（设置）
  roleList(params) {
    return axios.get("/xumg/admin/user/role/list", {params});
  },
  // 新增管理员
  addAdmin(params) {
    return axios.post("/xumg/admin/user/save", qs.stringify(params));
  },
  // 角色管理
  roleListCount(params) {
    return axios.get("/xumg/admin/user/role/listCountUser",{params});
  },
  // 用户信息
  userAdminInfo(params) {
    return axios.get("/xumg/admin/user/loginInfo",{params});
  },
  // 修改管理员密码
  updatePassword(params) {
    return axios.post("/xumg/admin/updatePassword",qs.stringify(params));
  },
  // 启用禁用
  changeAdminStatus(params) {
    return axios.post("/xumg/admin/disable",qs.stringify(params));
  },
  // 修改其他管理员密码
  changeOtherAdminPassword(params) {
    return axios.post("/xumg/admin/changePassword",qs.stringify(params));
  },
  // 修改其他管理员信息
  updateAdmin(params) {
    return axios.post("/xumg/admin/user/update",qs.stringify(params));
  },
  // 修改其他管理员信息
  addRole(params) {
    return axios.post("/xumg/admin/user/addRole",qs.stringify(params));
  },
  getUserInfo(params) {
    return axios.get("/xumg/user/getUserInfo", {params});
  },
  // 修改其他管理员信息
  removeRole(params) {
    return axios.post("/xumg/admin/user/removeRole",qs.stringify(params));
  },
  // 权限列表信息
  permissionsList(params) {
    return axios.get("/xumg/admin/menuPermissions", {params});
  },
  // 修改其他管理员信息
  updateRolePerm(params) {
    return axios.post("/xumg/admin/user/updateRolePerm",qs.stringify(params));
  },// 修改其他管理员信息
  updateMenuPerm(params) {
    return axios.post("/xumg/admin/user/updateMenuPerm",qs.stringify(params));
  },
  // 修改其他管理员信息
  listBizSystem(params) {
    return axios.post("/xumg/listBizSystem",qs.stringify(params));
  },
  // 修改其他管理员信息
  roleListMenu(params) {
    return axios.get("/xumg/admin/menu/list",{params});
  },
  // 修改其他管理员信息
  roleAdd(params) {
    return axios.post("/xumg/admin/menu/add",qs.stringify(params));
  },
  // 修改其他管理员信息
  roleUpdate(params) {
    return axios.post("/xumg/admin/menu/update",qs.stringify(params));
  },
  // 修改其他管理员信息
  roleRemove(params) {
    return axios.post("/xumg/admin/menu/remove",qs.stringify(params));
  },
  // 修改其他管理员信息
  updateRoleMenu(params) {
    return axios.post("xumg/admin/updateRoleMenu",qs.stringify(params));
  },
  // 修改其他管理员信息
  listChecked(params) {
    return axios.get("xumg/admin/menu/listChecked",{params});
  },
  // 修改其他管理员信息
  listByUserPerm(params) {
    return axios.get("xumg/admin/menu/listByUserPerm",{params});
  }
};

export default admin;
