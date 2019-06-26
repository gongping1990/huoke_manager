import axios from "../../http";
import qs from "qs";

const user = {
  // 获取语文用户列表
  getPrepUserList(params) {
    return axios.get("/prep/preuser/queryUserPage", {params: params});
  }
};

export default user;
