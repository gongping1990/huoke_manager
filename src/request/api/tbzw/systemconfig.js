import axios from "../../http";
import qs from "qs";

const tbzwSystemconfig = {
  getSystemConfigType(params) {
    return axios.get('/compositionv3/systemconfig/getSystemConfigType', {params: params})
  },
  getSystemConfigEnums(params) {
    return axios.get('/compositionv3/systemconfig/getSystemConfigEnums', {params: params})
  },
  listSystemConfig(params) {
    return axios.get('/compositionv3/systemconfig/listSystemConfig', {params: params})
  },
  editSystemConfig(params) {
    return axios.post("/compositionv3/systemconfig/editSystemConfig", qs.stringify(params));
  },
};

export default tbzwSystemconfig;
