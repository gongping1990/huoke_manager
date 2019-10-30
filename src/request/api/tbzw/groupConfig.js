import axios from "../../http";
import qs from "qs";

const tbzwGroupConfig = {
  adminList(params) {
    return axios.get("/compositionv2/groupConfig/adminList", {params: params});
  },
  finishCoupon(params) {
    return axios.get("/compositionv2/tbzwGroupConfig/finishCoupon", {params: params});
  },
  save(params) {
    return axios.post("/compositionv2/groupConfig/save", qs.stringify(params));
  },
};

export default tbzwGroupConfig;
