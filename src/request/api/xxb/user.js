import axios from "../../http";
import qs from "qs";

const xxbUser = {
  // 获取语文用户列表
  getPrepUserList(params) {
    return axios.get("/xxb/preuser/queryUserPage", {params: params});
  }
};

export default xxbUser;
