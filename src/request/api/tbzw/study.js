import axios from "../../http";
import qs from "qs";

const tbzwStudy = {
  getUserByPhone(params) {
    return axios.get("/compositionv3/user/getUserByPhone", { params: params });
  },
  repairCard(params) {
    return axios.post("/compositionv3/study/repairCard", qs.stringify(params));
  },
  listRepairCard(params) {
    return axios.post(
      "/compositionv3/study/listRepairCard",
      qs.stringify(params)
    );
  },
  homeworkNotes(params) {
    return axios.get("/compositionv3/study/homeworkNotes", { params: params });
  },
  addTimeTag(params) {
    return axios.post("/compositionv3/study/addTimeTag", qs.stringify(params));
  }
};

export default tbzwStudy;
