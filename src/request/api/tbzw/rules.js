import axios from "../../http";
import qs from "qs";

const tbzwRules = {
  getHistoryLessonRules(params) {
    return axios.get('/compositionv3/rules/getHistoryLessonRules', {params: params})
  },
  changedRulesByUser(params) {
    return axios.post("/compositionv3/rules/changedRulesByUser", qs.stringify(params));
  },
  editLessonRules(params) {
    return axios.post("/compositionv3/rules/editLessonRules", qs.stringify(params));
  },
  pageUserLessonRules(params) {
    return axios.get("/compositionv3/rules/pageUserLessonRules", {params: params});
  },
  supply(params) {
    return axios.get("/compositionv3/rules/supply", {params: params});
  },
  getLessonRulesByUser(params) {
    return axios.get("/compositionv3/rules/getLessonRulesByUser", {params: params});
  },
  listTimeTableRules(params) {
    return axios.get("/compositionv3/rules/listTimeTableRules", {params: params});
  },
  removeTimeTableRules(params) {
    return axios.get("/compositionv3/rules/removeTimeTableRules", {params: params});
  },
  editTimeTableRules(params) {
    return axios.post("/compositionv3/rules/editTimeTableRules", qs.stringify(params));
  },
  pageUserTtr(params) {
    return axios.get("/compositionv3/rules/pageUserTtr", {params: params});
  },
  pageUserDateTtr(params) {
    return axios.get("/compositionv3/rules/pageUserDateTtr", {params: params});
  },
  switchUserTtr(params) {
    return axios.post("/compositionv3/rules/switchUserTtr", params);
  },
  editSubmitWorkRules(params) {
    return axios.post("/compositionv3/rules/editSubmitWorkRules", qs.stringify(params));
  },
};

export default tbzwRules;
