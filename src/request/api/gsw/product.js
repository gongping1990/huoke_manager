import axios from "../../http";
import qs from "qs";

const gswProduct = {
// 获取古诗文用户列表
  versionFinished(params) {
    return axios.get("/poem/product/finished", {params: params});
  },
  // 用户禁用启用
  addVersion(params) {
    return axios.post("/poem/product/addVersion", qs.stringify(params));
  },
  addRelease(params) {
    return axios.post("/poem/product/release", qs.stringify(params));
  },
  listPackageByProduct(params) {
    return axios.get("/poem/product/listPackageByProduct", {params: params});
  },
  listReleaseByProduct(params) {
    return axios.get("/poem/product/listReleaseByProduct", {params: params});
  }
};

export default gswProduct;
