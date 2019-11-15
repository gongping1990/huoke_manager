import axios from "../../http";
import qs from "qs";

const tbzwStudyRecordData = {
  getConversionData(params) {
    return axios.get('/compositionv2/studyRecordData/getConversionData', {params: params})
  },
  getStudyData(params) {
    return axios.get(`/compositionv2/studyRecordData/getStudyData`, {params: params})
  },
  getUserStudyRecordByLessonId(params) {
    return axios.get(`/compositionv2/studyRecordData/getUserStudyRecordByLessonId`, {params: params})
  },
  getStudyDataDetails(params) {
    return axios.get(`/compositionv2/studyRecordData/getStudyDataDetails`, {params: params})
  }
};

export default tbzwStudyRecordData;
