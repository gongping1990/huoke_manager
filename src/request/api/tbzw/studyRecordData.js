import axios from "../../http";
import qs from "qs";

const tbzwStudyRecordData = {
  getConversionData(params) {
    return axios.get('/compositionv3/studyRecordData/getConversionData', {params: params})
  },
  getStudyData(params) {
    return axios.get(`/compositionv3/studyRecordData/getStudyData`, {params: params})
  },
  getUserStudyRecordByLessonId(params) {
    return axios.get(`/compositionv3/studyRecordData/getUserStudyRecordByLessonId`, {params: params})
  },
  getStudyDataDetails(params) {
    return axios.get(`/compositionv3/studyRecordData/getStudyDataDetails`, {params: params})
  },
  getCourseQualityData(params) {
    return axios.get(`/compositionv3/studyRecordData/getCourseQualityData`, {params: params})
  },
  getCourseQualityOutData(params) {
    return axios.get(`/compositionv3/studyRecordData/getCourseQualityOutData`, {params: params})
  },
  getReserveBuyDataDetails(params) {
    return axios.get(`/compositionv3/studyRecordData/getReserveBuyDataDetails`, {params: params})
  }
};

export default tbzwStudyRecordData;
