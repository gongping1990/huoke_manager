import axios from "../../http";
import qs from "qs";

const gswInternalChannel = {

  categoryList(params) {
    return axios.get("/poem-xym/internalChannel/categoryList", {params: params});
  },

  saveCategory(params) {
    return axios.post("/poem-xym/internalChannel/saveCategory", qs.stringify(params));
  },

  deleteCategory(params) {
    return axios.post("/poem-xym/internalChannel/deleteCategory", qs.stringify(params));
  },

  listChannel(params) {
    return axios.get("/poem-xym/internalChannel/list", {params: params});
  },

  getInternalChannelData(params) {
    return axios.get("/poem-xym/internalChannel/getInternalChannelData", {params: params});
  },

  getInternalChannelDataByDate(params) {
    return axios.get("/poem-xym/internalChannel/getInternalChannelDataByDate", {params: params});
  },

  saveChannel(params) {
    return axios.post("/poem-xym/internalChannel/save", qs.stringify(params));
  },

  deleteChannel(params) {
    return axios.post("/poem-xym/internalChannel/delete", qs.stringify(params));
  },
};

export default gswInternalChannel;
