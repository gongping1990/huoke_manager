import axios from "../../http";
import qs from "qs";

const tbzwReserveBuy = {
  listByPage(params) {
    return axios.get('/compositionv3/reserveBuy/listByPage', {params: params})
  },
  getReserveBuyData(params) {
    return axios.get('/compositionv3/reserveBuy/getReserveBuyData', {params: params})
  },
  reserveBuyUpdate(params) {
    return axios.post("/compositionv3/reserveBuy/update", params);
  },
  reserveBuyAdd(params) {
    return axios.post("/compositionv3/reserveBuy/add", params);
  },
  reserveBuyClose(params) {
    return axios.post("/compositionv3/reserveBuy/close", qs.stringify(params));
  },
};

export default tbzwReserveBuy;
