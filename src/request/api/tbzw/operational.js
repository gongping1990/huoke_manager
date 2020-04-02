import axios from "../../http";
import qs from "qs";

const tbzwOperational = {
  finishBanner(params) {
    return axios.get('/compositionv3/operational/finishBanner', {params: params})
  },
  removeBanner(params) {
    return axios.get('/compositionv3/operational/removeBanner', {params: params})
  },
  listBannerStatistics(params) {
    return axios.get('/compositionv3/operational/listBannerStatistics', {params: params})
  },
  listBanner(params) {
    return axios.post("/compositionv3/operational/listBanner", qs.stringify(params));
  },
  saveBanner(params) {
    return axios.post("/compositionv3/operational/saveBanner", qs.stringify(params));
  },
};

export default tbzwOperational;
