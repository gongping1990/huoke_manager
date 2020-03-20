import axios from "../../http";
import qs from "qs";

const tbzwInternalChannel = {

  categoryList(params) {
    return axios.get("/compositionv2/internalChannel/categoryList", {params: params});
  },

  saveCategory(params) {
    return axios.post("/compositionv2/internalChannel/saveCategory", qs.stringify(params));
  },

  deleteCategory(params) {
    return axios.post("/compositionv2/internalChannel/deleteCategory", qs.stringify(params));
  },

  listChannel(params) {
    return axios.get("/compositionv2/internalChannel/list", {params: params});
  },

  getInternalChannelData(params) {
    return axios.get("/compositionv2/internalChannel/getInternalChannelData", {params: params});
  },

  getInternalChannelDataByDate(params) {
    return axios.get("/compositionv2/internalChannel/getInternalChannelDataByDate", {params: params});
  },

  saveChannel(params) {
    return axios.post("/compositionv2/internalChannel/save", qs.stringify(params));
  },

  deleteChannel(params) {
    return axios.post("/compositionv2/internalChannel/delete", qs.stringify(params));
  },
};

export default tbzwInternalChannel;
