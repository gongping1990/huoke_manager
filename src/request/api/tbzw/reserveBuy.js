import axios from "../../http";
import qs from "qs";

const tbzwReserveBuy = {
  listByPage(params) {
    return axios.get('/compositionv2/reserveBuy/listByPage', {params: params})
  },
  reserveBuyUpdate(params) {
    return axios.post("/compositionv2/reserveBuy/update", params);
  },
  reserveBuyAdd(params) {
    return axios.post("/compositionv2/reserveBuy/add", params);
  },
  reserveBuyClose(params) {
    return axios.post("/compositionv2/reserveBuy/close", qs.stringify(params));
  },
};

export default tbzwReserveBuy;
