import axios from "../../http";
import qs from "qs";

const tbzwOrder = {
  getTotalData(params) {
    return axios.get("/compositionv2/order/getTotalData", {params: params});
  },
  getDataDetails(params) {
    return axios.get("/compositionv2/order/getDataDetails", {params: params});
  },
  getOrderDetails(params) {
    return axios.get("/compositionv2/order/getOrderDetails", {params: params});
  },
  newManualOpenOrder(params) {
    return axios.post("/compositionv2/order/newManualOpenOrder", qs.stringify(params));
  },
};

export default tbzwOrder;
