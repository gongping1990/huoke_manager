import axios from "../../http";
import qs from "qs";

const user = {
  // 禁用启用用户-朗读
  ldChangeUserStatus(params) {
    return axios.post("/declaim/user/updateUserDisabledStatusById",qs.stringify(params));
  },

  // 获取朗读用户列表
  getLdUserList(params) {
    return axios.get("/declaim/user/listUserByPage", {params: params});
  }
};

export default user;
