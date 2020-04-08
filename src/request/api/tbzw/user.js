import axios from "../../http";
import qs from "qs";

const user = {
  // 获取同步作文文用户列表
  getTbzwUserList(params) {
    return axios.get("/compositionv3/user/listUserByPage", {params: params});
  },
  // 用户禁用启用
  TbzwChangeStatus(params) {
    return axios.post("/compositionv3/user/updateUserDisabledStatusById", qs.stringify(params));
  },
  // 用户禁用启用
  getUserByPhone(params) {
    return axios.get("/xumg/user/getUserByPhone",{params: params});
  }
};

export default user;
