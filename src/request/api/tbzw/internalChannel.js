import axios from "../../http";
import qs from "qs";

const gswInternalChannel = {

  categoryList(params) {
    return axios.get("/composition/internalChannel/categoryList", {params: params});
  },

  saveCategory(params) {
    return axios.post("/composition/internalChannel/saveCategory", qs.stringify(params));
  },

  deleteCategory(params) {
    return axios.post("/composition/internalChannel/deleteCategory", qs.stringify(params));
  },

  listChannel(params) {
    return axios.get("/composition/internalChannel/list", {params: params});
  },

  getInternalChannelData(params) {
    return axios.get("/composition/internalChannel/getInternalChannelData", {params: params});
  },

  getInternalChannelDataByDate(params) {
    return axios.get("/composition/internalChannel/getInternalChannelDataByDate", {params: params});
  },

  saveChannel(params) {
    return axios.post("/composition/internalChannel/save", qs.stringify(params));
  },

  deleteChannel(params) {
    return axios.post("/composition/internalChannel/delete", qs.stringify(params));
  },
};

export default gswInternalChannel;
