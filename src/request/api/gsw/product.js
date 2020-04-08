import axios from "../../http";
import qs from "qs";

const gswProduct = {
  versionFinished(params) {
    return axios.get("/poem-xym/product/finished", {params: params});
  },
  addVersion(params) {
    return axios.post("/poem-xym/product/addVersion", qs.stringify(params));
  },
  addRelease(params) {
    return axios.post("/poem-xym/product/release", qs.stringify(params));
  },
  listPackageByProduct(params) {
    return axios.get("/poem-xym/product/listPackageByProduct", {params: params});
  },
  listReleaseByProduct(params) {
    return axios.get("/poem-xym/product/listReleaseByProduct", {params: params});
  },
  uploadPackage(params) {
    return axios.get("/poem-xym/product/uploadPackage", {params: params});
  }
};

export default gswProduct;
