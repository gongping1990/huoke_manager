import axios from "../../http";
import qs from "qs";

const tbzwOfficenews = {
  pageByAdminNews(params) {
    return axios.get('/compositionv3/officenews/pageByAdminNews', {params: params})
  },
  publish(params) {
    return axios.get('/compositionv3/officenews/publish', {params: params})
  },
  deleteByNewsId(params) {
    return axios.get('/compositionv3/officenews/deleteByNewsId', {params: params})
  },
  getById(params) {
    return axios.get(`/compositionv3/officenews/getById/${params}`)
  },
  // 新增课程信息
  saveNews(params) {
    return axios.post('/compositionv3/officenews/saveNews', qs.stringify(params))
  },
  // 修改课程信息
  updateNews(params) {
    return axios.post('/compositionv3/officenews/updateNews', qs.stringify(params))
  },
};

export default tbzwOfficenews;
