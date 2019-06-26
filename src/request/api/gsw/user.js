import axios from "../../http";
import qs from "qs";

const user = {
// 获取古诗文用户列表
  getGswUserList(params) {
    return axios.get("/poem/user/listUserByPage", {params: params});
  },
  // 用户禁用启用
  gswChangeStatus(params) {
    return axios.post("/poem/user/updateUserDisabledStatusById", qs.stringify(params));
  },
};

export default user;
