import axios from "../../http";
import qs from "qs";

const tbzwOrder = {
  getTotalData(params) {
    return axios.get("/composition/order/getTotalData", {params: params});
  },
  getDataDetails(params) {
    return axios.get("/composition/order/getDataDetails", {params: params});
  },
};

export default tbzwOrder;
