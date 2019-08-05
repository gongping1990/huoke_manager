import axios from "../../http";
import qs from "qs";

const gswCustomer = {
// 获取古诗文用户列表
  getDefaultCustomer(params) {
    return axios.get("/poem/customer/getDefaultCustomer", {params: params});
  },
  // 用户禁用启用
  editCustomer(params) {
    return axios.post("/poem/customer/editCustomer", qs.stringify(params));
  }
};

export default gswCustomer;
