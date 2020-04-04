import axios from "../../http";
import qs from "qs";

const gswPrzie = {
// 获取古诗文用户列表
  prizeAdminList(params) {
    return axios.get("/poem-xym/prize/adminList", {params: params});
  },
  // 用户禁用启用
  prizeDelete(params) {
    return axios.post("/poem-xym/prize/delete", qs.stringify(params));
  },
  saveOrderUpdate(params) {
    return axios.post("/poem-xym/prize/saveOrderUpdate", qs.stringify(params));
  },
  prizeSend(params) {
    return axios.post("/poem-xym/prize/send", qs.stringify(params));
  },
  getAdminConvertOrder(params) {
    return axios.get("/poem-xym/prize/getAdminConvertOrder", {params: params});
  },
};

export default gswPrzie;
