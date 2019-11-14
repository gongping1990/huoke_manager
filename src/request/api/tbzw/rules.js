import axios from "../../http";
import qs from "qs";

const tbzwRules = {
  getHistoryLessonRules(params) {
    return axios.get('/compositionv2/rules/getHistoryLessonRules', {params: params})
  },
  changedRulesByUser(params) {
    return axios.post("/compositionv2/rules/changedRulesByUser", qs.stringify(params));
  },
  editLessonRules(params) {
    return axios.post("/compositionv2/rules/editLessonRules", qs.stringify(params));
  },
  pageUserLessonRules(params) {
    return axios.get("/compositionv2/rules/pageUserLessonRules", {params: params});
  },
  supply(params) {
    return axios.get("/compositionv2/rules/supply", {params: params});
  },
  getLessonRulesByUser(params) {
    return axios.get("/compositionv2/rules/getLessonRulesByUser", {params: params});
  },
};

export default tbzwRules;
