import axios from "../../http";
import qs from "qs";

const tbzwGroupConfig = {
  adminList(params) {
    return axios.get("/compositionv3/groupConfig/adminList", {params: params});
  },
  getGroupData(params) {
    return axios.get("/compositionv3/groupConfig/getGroupData", {params: params});
  },
  finish(params) {
    return axios.post("/compositionv3/groupConfig/finish", qs.stringify(params));
  },
  save(params) {
    return axios.post("/compositionv3/groupConfig/save", qs.stringify(params));
  },
};

export default tbzwGroupConfig;
