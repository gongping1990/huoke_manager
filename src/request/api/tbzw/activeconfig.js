import axios from "../../http";
import qs from "qs";

const tbzwActiveconfig = {
  listActiveConfig(params) {
    return axios.get('/compositionv3/activeconfig/listActiveConfig', {params: params})
  },
  listByActiveDetailsConfig(params) {
    return axios.get(`/compositionv3/activeconfig/listByActiveDetailsConfig`, {params: params})
  },
  getActiveDetailsByActiveId(params) {
    return axios.get(`/compositionv3/activeconfig/getActiveDetailsByActiveId`, {params: params})
  },
  getActiveDetails(params) {
    return axios.get(`/compositionv3/activeconfig/getActiveDetails`, {params: params})
  },
  // 新增课程信息
  remove(params) {
    return axios.get('/compositionv3/activeconfig/remove', {params: params})
  },
  // 修改课程信息
  editActiveConfig(params) {
    return axios.post('/compositionv3/activeconfig/editActiveConfig', params)
  },
  getActiveDetailsOfToday(params) {
    return axios.get('/compositionv3/activeconfig/getActiveDetailsOfToday', {params: params})
  },
  listActiveByPayExperience(params) {
    return axios.get('/compositionv3/activeconfig/listActiveByPayExperience', {params: params})
  },
};

export default tbzwActiveconfig;
