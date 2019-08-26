import axios from "../../http";
import qs from "qs";

const tbzwStudy = {
  getUserByPhone(params) {
    return axios.get('/composition/user/getUserByPhone', {params: params})
  },
  repairCard(params) {
    return axios.get("/composition/study/repairCard", {params: params});
  },
  listRepairCard(params) {
    return axios.post("/composition/study/listRepairCard", qs.stringify(params));
  },
};

export default tbzwStudy;
