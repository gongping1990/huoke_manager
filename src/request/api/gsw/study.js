import axios from "../../http";
import qs from "qs";

const gswStudy = {
// 获取古诗文用户列表
  jobPraise(params) {
    return axios.post("/poem/study/praise", qs.stringify(params));
  }
};

export default gswStudy;
