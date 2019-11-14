import axios from "../../http";
import qs from "qs";

const tbzwStudyRecordData = {
  getConversionData(params) {
    return axios.get('/compositionv2/studyRecordData/getConversionData', {params: params})
  },
  getStudyData(params) {
    return axios.get(`/compositionv2/studyRecordData/getStudyData`, {params: params})
  }
};

export default tbzwStudyRecordData;
