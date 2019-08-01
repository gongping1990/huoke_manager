import axios from "../../http";
import qs from "qs";

const gswChannel = {
  managerList(params) {
    return axios.post("/poem/channel/manager/list", qs.stringify(params));
  },
  managerRemove(params) {
    return axios.post("/poem/channel/manager/remove", qs.stringify(params));
  },
  managerUpdate(params) {
    return axios.post("/poem/channel/manager/update", qs.stringify(params));
  },
  managerAdd(params) {
    return axios.post("/poem/channel/manager/add", qs.stringify(params));
  },
  listPChannelTypeCount(params) {
    return axios.post("/poem/channel/listPChannelTypeCount", qs.stringify(params));
  },
  listPChannelCount(params) {
    return axios.post("/poem/channel/listPChannelCount", qs.stringify(params));
  },
  channerPriceClose(params) {
    return axios.post("/poem/channel/price/close", qs.stringify(params));
  },
  channerPriceGet(params) {
    return axios.post("/poem/channel/price/get", qs.stringify(params));
  },
  channerPriceUpdate(params) {
    return axios.post("/poem/channel/price/update", params);
  },
  channerPriceList(params) {
    return axios.post("/poem/channel/price/list", qs.stringify(params));
  },
  channerAdd(params) {
    return axios.post("/poem/channel/add", qs.stringify(params));
  },
  channerUpdate(params) {
    return axios.post("/poem/channel/update", qs.stringify(params));
  },
  channerAdAdd(params) {
    return axios.post("/poem/channel/ad/add", qs.stringify(params));
  },
  channerAdUpdate(params) {
    return axios.post("/poem/channel/ad/update", qs.stringify(params));
  },
  channerAdList(params) {
    return axios.post("/poem/channel/ad/list", qs.stringify(params));
  },
  channerAdDayList(params) {
    return axios.post("/poem/channel/adDay/list", qs.stringify(params));
  },
  channerAdInfo(params) {
    return axios.post("/poem/channel/ad/info", qs.stringify(params));
  },
  channerAdGet(params) {
    return axios.post("/poem/channel/ad/get", qs.stringify(params));
  },
};

export default gswChannel;
