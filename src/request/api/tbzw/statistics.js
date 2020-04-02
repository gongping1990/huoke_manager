import axios from "../../http";
import qs from "qs";

const tbzwStatistics = {
  getUserLossData(params) {
    return axios.get("/compositionv3/statistics/getUserLossData", {params: params});
  },
  getUserLossDataByDay(params) {
    return axios.get("/compositionv3/statistics/getUserLossDataByDay", {params: params});
  },
  getUserPlayOfUnfinished(params) {
    return axios.get("/compositionv3/statistics/getUserPlayOfUnfinished", {params: params});
  },
  listSituationOfLearn(params) {
    return axios.get("/compositionv3/statistics/listSituationOfLearn", {params: params});
  },
  listSituationOfLearnLineChart(params) {
    return axios.get("/compositionv3/statistics/listSituationOfLearnLineChart", {params: params});
  },
};

export default tbzwStatistics;
