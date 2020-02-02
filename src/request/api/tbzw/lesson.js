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
  },
  listCheckPoint(params) {
    return axios.get('/compositionv2/lesson/listCheckPoint', {params: params})
  },
  removeCheckPointById(params) {
    return axios.get('/compositionv2/lesson/removeCheckPointById', {params: params})
  },
  saveCheckPoint(params) {
    return axios.post('/compositionv2/lesson/saveCheckPoint', qs.stringify(params))
  },
  sortByIds(params) {
    return axios.post('/compositionv2/lesson/sortByIds', params)
  },
  listIllustrationBook(params) {
    return axios.get('/compositionv2/lesson/listIllustrationBook', {params: params})
  },
  removeIllustrationBookById(params) {
    return axios.get('/compositionv2/lesson/removeIllustrationBookById', {params: params})
  },
  saveIllustrationBook(params) {
    return axios.post('/compositionv2/lesson/saveIllustrationBook', qs.stringify(params))
  },
  saveCheckPointVideo(params) {
    return axios.post('/compositionv2/lesson/saveCheckPointVideo', qs.stringify(params))
  },
  listProblem(params) {
    return axios.get('/compositionv2/lesson/listProblem', {params: params})
  },
  removeProblemById(params) {
    return axios.get('/compositionv2/lesson/removeProblemById', {params: params})
  },
  getPresetIcon(params) {
    return axios.get('/compositionv2/lesson/getPresetIcon', {params: params})
  },
  saveProblem(params) {
    return axios.post('/compositionv2/lesson/saveProblem', params)
  },
  saveLessonVideo(params) {
    return axios.post('/compositionv2/lesson/saveLessonVideo', qs.stringify(params))
  },
  saveStrokeImgById(params) {
    return axios.post('/compositionv2/lesson/saveStrokeImgById', qs.stringify(params))
  }
};

export default tbzwLesson;
