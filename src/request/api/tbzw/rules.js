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
  listTimeTableRules(params) {
    return axios.get("/compositionv2/rules/listTimeTableRules", {params: params});
  },
  removeTimeTableRules(params) {
    return axios.get("/compositionv2/rules/removeTimeTableRules", {params: params});
  },
  editTimeTableRules(params) {
    return axios.post("/compositionv2/rules/editTimeTableRules", qs.stringify(params));
  },
  pageUserTtr(params) {
    return axios.get("/compositionv2/rules/pageUserTtr", {params: params});
  },
  pageUserDateTtr(params) {
    return axios.get("/compositionv2/rules/pageUserDateTtr", {params: params});
  },
  switchUserTtr(params) {
    return axios.post("/compositionv2/rules/switchUserTtr", params);
  },
  editSubmitWorkRules(params) {
    return axios.post("/compositionv2/rules/editSubmitWorkRules", qs.stringify(params));
  },
};

export default tbzwRules;
