import axios from "../../http";
import qs from "qs";

const tbzwStudy = {
  pageCouponConfig(params) {
    return axios.get("/composition/study/listRepairCard", {params: params});
  },
  repairCard(params) {
    return axios.get("/composition/study/repairCard", {params: params});
  },
  listRepairCard(params) {
    return axios.post("/composition/study/listRepairCard", qs.stringify(params));
  },
};

export default tbzwStudy;
