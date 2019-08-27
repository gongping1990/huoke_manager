import axios from "../../http";
import qs from "qs";

const tbzwStudy = {
  getUserByPhone(params) {
    return axios.get('/composition/user/getUserByPhone', {params: params})
  },
  repairCard(params) {
    return axios.post("/composition/study/repairCard", qs.stringify(params));
  },
  listRepairCard(params) {
    return axios.post("/composition/study/listRepairCard", qs.stringify(params));
  },
};

export default tbzwStudy;
