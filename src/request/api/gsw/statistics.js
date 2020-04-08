import axios from "../../http";
import qs from "qs";

const gswStatistics = {
  listVersionStatistics(params) {
    return axios.get("/poem-xym/statistics/listVersionStatistics", {params: params});
  },
  listInstallStatistics(params) {
    return axios.get("/poem-xym/statistics/listInstallStatistics", {params: params});
  },
  countAllInstall(params) {
    return axios.get("/poem-xym/statistics/countAllInstall", {params: params});
  },
};

export default gswStatistics;
