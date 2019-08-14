import axios from "../../http";
import qs from "qs";

const gswStatistics = {
  listVersionStatistics(params) {
    return axios.get("/poem/statistics/listVersionStatistics", {params: params});
  },
  listInstallStatistics(params) {
    return axios.get("/poem/statistics/listInstallStatistics", {params: params});
  },
  countAllInstall(params) {
    return axios.get("/poem/statistics/countAllInstall", {params: params});
  },
};

export default gswStatistics;
