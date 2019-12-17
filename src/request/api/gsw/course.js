import axios from "../../http";
import qs from "qs";

const gswCourse = {
// 获取古诗文用户列表
  queryPage(params) {
    return axios.get("/poem/course/queryPage", {params: params});
  },
  getById(params) {
    return axios.get(`/poem/course/getById/${params}`);
  }
};

export default gswCourse;
