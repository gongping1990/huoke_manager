import axios from "../../http";
import qs from "qs";

const tbzwActiveconfig = {
  listActiveConfig(params) {
    return axios.get('/compositionv2/activeconfig/listActiveConfig', {params: params})
  },
  listByActiveDetailsConfig(params) {
    return axios.get(`/compositionv2/activeconfig/listByActiveDetailsConfig`, {params: params})
  },
  getActiveDetailsByActiveId(params) {
    return axios.get(`/compositionv2/activeconfig/getActiveDetailsByActiveId`, {params: params})
  },
  getActiveDetails(params) {
    return axios.get(`/compositionv2/activeconfig/getActiveDetails`, {params: params})
  },
  // 新增课程信息
  remove(params) {
    return axios.get('/compositionv2/activeconfig/remove', {params: params})
  },
  // 修改课程信息
  editActiveConfig(params) {
    return axios.post('/compositionv2/activeconfig/editActiveConfig', params)
  },
};

export default tbzwActiveconfig;
