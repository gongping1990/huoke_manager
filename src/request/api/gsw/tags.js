import axios from "../../http";
import qs from "qs";

const gswTags = {
// 获取古诗文用户列表
  disabledTags(params) {
    return axios.get("/poem-xym/tags/disabledTags", {params: params});
  },
  // 用户禁用启用
  editTag(params) {
    return axios.post("/poem-xym/tags/editTag", qs.stringify(params));
  },
  listByTags(params) {
    return axios.get("/poem-xym/tags/listByTags", {params: params});
  },
  listCourseTags(params) {
    return axios.get("/poem-xym/tags/listCourseTags", {params: params});
  },
  pageByTags(params) {
    return axios.get("/poem-xym/tags/pageByTags", {params: params});
  },
  removeTagById(params) {
    return axios.get("/poem-xym/tags/removeTagById", {params: params});
  },
  saveCourseTag(params) {
    return axios.post("/poem-xym/tags/saveCourseTag", qs.stringify(params));
  },
};

export default gswTags;
