import axios from "../../http";
import qs from "qs";

const user = {
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
