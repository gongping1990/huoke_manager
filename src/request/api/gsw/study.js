import axios from "../../http";
import qs from "qs";

const gswStudy = {
// 获取古诗文用户列表
  jobPraise(params) {
    return axios.post("/poem/study/praise", qs.stringify(params));
  },
  workComment(params) {
    return axios.get("/poem/study/workComment/listAllByPage", {params: params});
  },
  workCommentShow(params) {
    return axios.post("/poem/study/workComment/show", qs.stringify(params));
  }
};

export default gswStudy;
