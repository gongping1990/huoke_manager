import axios from "../../http";
import qs from "qs";

const tbzwInternalChannel = {

  categoryList(params) {
    return axios.get("/compositionv3/internalChannel/categoryList", {params: params});
  },

  saveCategory(params) {
    return axios.post("/compositionv3/internalChannel/saveCategory", qs.stringify(params));
  },

  deleteCategory(params) {
    return axios.post("/compositionv3/internalChannel/deleteCategory", qs.stringify(params));
  },

  listChannel(params) {
    return axios.get("/compositionv3/internalChannel/list", {params: params});
  },

  getInternalChannelData(params) {
    return axios.get("/compositionv3/internalChannel/getInternalChannelData", {params: params});
  },

  getInternalChannelDataByDate(params) {
    return axios.get("/compositionv3/internalChannel/getInternalChannelDataByDate", {params: params});
  },

  saveChannel(params) {
    return axios.post("/compositionv3/internalChannel/save", qs.stringify(params));
  },

  deleteChannel(params) {
    return axios.post("/compositionv3/internalChannel/delete", qs.stringify(params));
  },
};

export default tbzwInternalChannel;
