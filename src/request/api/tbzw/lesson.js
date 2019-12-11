import axios from "../../http";
import qs from "qs";

const tbzwLesson = {
  getLearnContent(params) {
    return axios.get('/compositionv2/lesson/getLearnContent', {params: params})
  },
  removeLearnContentById(params) {
    return axios.get(`/compositionv2/lesson/removeLearnContentById`,  {params: params})
  },
  editLearnContent(params) {
    return axios.post('/compositionv2/lesson/editLearnContent', params)
  },
  editQuestion(params) {
    return axios.post('/compositionv2/lesson/editQuestion', qs.stringify(params))
  }
};

export default tbzwLesson;
