import axios from "../../http";
import qs from "qs";

const gswCourseCode = {
// 获取古诗文用户列表
  list(params) {
    return axios.get("/poem-xym/courseCode/list", {params: params});
  },
  useCode(params) {
    return axios.post("/poem-xym/courseCode/useCode", qs.stringify(params));
  },
  generateCode(params) {
    return axios.post("/poem-xym/courseCode/generateCode", qs.stringify(params));
  },
  getCourseCodeUseRecord(params) {
    return axios.get(`/poem-xym/courseCode/getCourseCodeUseRecord`,{params: params});
  },
  getStatistics(params) {
    return axios.get(`/poem-xym/courseCode/getStatistics`,{params: params});
  }
};

export default gswCourseCode;
