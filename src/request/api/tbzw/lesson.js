import axios from "../../http";
import qs from "qs";

const tbzwLesson = {
  getLearnContent(params) {
    return axios.get('/compositionv2/lesson/getLearnContent', {params: params})
  },
  editLearnContent(params) {
    return axios.post('/compositionv2/lesson/editLearnContent', params)
  },
  editQuestion(params) {
    return axios.post('/compositionv2/lesson/editQuestion', params)
  },
  sortByLessonQuestion(params) {
    return axios.post('/compositionv2/lesson/sortByLessonQuestion', params)
  }
};

export default tbzwLesson;
