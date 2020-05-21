import axios from "../../http";
import qs from "qs";

const tbzwOrder = {
  getTotalData(params) {
    return axios.get("/compositionv3/order/getTotalData", {params: params});
  },
  getDataDetails(params) {
    return axios.get("/compositionv3/order/getDataDetails", {params: params});
  },
  getOrderDetails(params) {
    return axios.get("/compositionv3/order/getOrderDetails", {params: params});
  },
  newManualOpenOrder(params) {
    return axios.post("/compositionv3/order/newManualOpenOrder", qs.stringify(params));
  },
  createNewInvoice(params) {
    return axios.post("/compositionv3/order/createNewInvoice", qs.stringify(params));
  },
  refund(params) {
    return axios.post("/compositionv3/order/refund", qs.stringify(params));
  },
  createGroupOrder(params) {
    return axios.post("/compositionv3/order/createGroupOrder", params);
  },
};

export default tbzwOrder;
