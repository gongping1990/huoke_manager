import axios from "../../http";
import qs from "qs";

const tbzwOperational = {
  finishBanner(params) {
    return axios.get('/composition/operational/finishBanner', {params: params})
  },
  removeBanner(params) {
    return axios.get('/composition/operational/removeBanner', {params: params})
  },
  listBannerStatistics(params) {
    return axios.get('/composition/operational/listBannerStatistics', {params: params})
  },
  listBanner(params) {
    return axios.post("/composition/operational/listBanner", qs.stringify(params));
  },
  saveBanner(params) {
    return axios.post("/composition/operational/saveBanner", qs.stringify(params));
  },
};

export default tbzwOperational;
