import axios from "../../http";
import qs from "qs";

const tbzwGroupConfig = {
  adminList(params) {
    return axios.get("/compositionv2/groupConfig/adminList", {params: params});
  },
  finish(params) {
    return axios.post("/compositionv2/groupConfig/finish", qs.stringify(params));
  },
  save(params) {
    return axios.post("/compositionv2/groupConfig/save", qs.stringify(params));
  },
};

export default tbzwGroupConfig;
