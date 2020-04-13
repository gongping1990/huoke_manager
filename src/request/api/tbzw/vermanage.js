import axios from "../../http";
import qs from "qs";

const tbzwVermanage = {
  pageVersionControl(params) {
    return axios.get("/compositionv3/vermanage/pageVersionControl", {params: params});
  },
  editVersionControl(params) {
    return axios.post("/compositionv3/vermanage/editVersionControl", qs.stringify(params));
  },
  editPassedVer(params) {
    return axios.post("/compositionv3/vermanage/editPassedVer", qs.stringify(params));
  },
};

export default tbzwVermanage;
