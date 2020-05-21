import axios from "../../http";
import qs from "qs";

const tbzwOpenTime = {
  pageOpenTimeManage(params) {
    return axios.get('/compositionv3/opentime/pageOpenTimeManage', {params: params})
  },
  initOpenTimeManageByYear(params) {
    return axios.get('/compositionv3/opentime/initOpenTimeManageByYear', {params: params})
  },
  listByGroupYear(params) {
    return axios.get('/compositionv3/opentime/listByGroupYear', {params: params})
  },
  getUserBuyCourseInfo(params) {
    return axios.post("/compositionv3/opentime/getUserBuyCourseInfo", qs.stringify(params));
  },
  editOpenTimeManage(params) {
    return axios.post("/compositionv3/opentime/editOpenTimeManage", qs.stringify(params));
  },
};

export default tbzwOpenTime;
