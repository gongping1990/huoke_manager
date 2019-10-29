import axios from "../../http";
import qs from "qs";

const hkywhdUser = {
  // 获取语文用户列表
  getPrepUserList(params) {
    return axios.get("/fissionprep/preuser/queryUserPage", {params: params});
  }
};

export default hkywhdUser;
