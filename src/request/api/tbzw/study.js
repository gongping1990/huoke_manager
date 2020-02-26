import axios from "../../http";
import qs from "qs";

const tbzwStudy = {
  getUserByPhone(params) {
    return axios.get("/compositionv2/user/getUserByPhone", { params: params });
  },
  repairCard(params) {
    return axios.post("/compositionv2/study/repairCard", qs.stringify(params));
  },
  listRepairCard(params) {
    return axios.post(
      "/compositionv2/study/listRepairCard",
      qs.stringify(params)
    );
  },
  homeworkNotes(params) {
    return axios.get("/compositionv2/study/homeworkNotes", { params: params });
  },
  addTimeTag(params) {
    return axios.post("/compositionv2/study/addTimeTag", qs.stringify(params));
  }
};

export default tbzwStudy;
