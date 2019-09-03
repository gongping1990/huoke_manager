import axios from "../../http";
import qs from "qs";

const gswInternalChannel = {

  categoryList(params) {
    return axios.get("/poem/internalChannel/categoryList", {params: params});
  },

  saveCategory(params) {
    return axios.post("/poem/internalChannel/saveCategory", qs.stringify(params));
  },

  deleteCategory(params) {
    return axios.post("/poem/internalChannel/deleteCategory", qs.stringify(params));
  },

  listChannel(params) {
    return axios.get("/poem/internalChannel/list", {params: params});
  },

  getInternalChannelData(params) {
    return axios.get("/poem/internalChannel/getInternalChannelData", {params: params});
  },

  getInternalChannelDataByDate(params) {
    return axios.get("/poem/internalChannel/getInternalChannelDataByDate", {params: params});
  },

  saveChannel(params) {
    return axios.post("/poem/internalChannel/save", qs.stringify(params));
  },

  deleteChannel(params) {
    return axios.post("/poem/internalChannel/delete", qs.stringify(params));
  },
};

export default gswInternalChannel;
