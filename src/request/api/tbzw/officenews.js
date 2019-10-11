import axios from "../../http";
import qs from "qs";

const tbzwOfficenews = {
  pageByAdminNews(params) {
    return axios.get('/compositionv2/officenews/pageByAdminNews', {params: params})
  },
  publish(params) {
    return axios.get('/compositionv2/officenews/publish', {params: params})
  },
  deleteByNewsId(params) {
    return axios.get('/compositionv2/officenews/deleteByNewsId', {params: params})
  },
  getById(params) {
    return axios.get(`/compositionv2/officenews/getById/${params}`)
  },
  // 新增课程信息
  saveNews(params) {
    return axios.post('/compositionv2/officenews/saveNews', qs.stringify(params))
  },
  // 修改课程信息
  updateNews(params) {
    return axios.post('/compositionv2/officenews/updateNews', qs.stringify(params))
  },
};

export default tbzwOfficenews;
