import axios from "../../http";
import qs from "qs";

const gswStudy = {
// 获取古诗文用户列表
  jobPraise(params) {
    return axios.post("/poem-xym/study/praise", qs.stringify(params));
  },
  workComment(params) {
    return axios.get("/poem-xym/study/workComment/listAllByPage", {params: params});
  },
  workCommentShow(params) {
    return axios.post("/poem-xym/study/workComment/show", qs.stringify(params));
  }
};

export default gswStudy;
