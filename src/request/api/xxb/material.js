import axios from "../../http";
import qs from "qs";

const xxbMaterial = {
  // 获取语文用户列表
  getArticleData(params) {
    return axios.get("/xxb/material/admin/getArticleData", {params: params});
  },
  getCompositionMaterial(params) {
    return axios.get("/xxb/material/admin/getCompositionMaterial", {params: params});
  },
  getChengyuCategory(params) {
    return axios.get("/xxb/material/admin/getChengyuCategory", {params: params});
  },
  getChengyu(params) {
    return axios.get("/xxb/material/admin/getChengyu", {params: params});
  },
  getCompositionMaterialCategory(params) {
    return axios.get("/xxb/material/admin/getCompositionMaterialCategory", {params: params});
  },
  getMaterialCategory(params) {
    return axios.get("/xxb/material/admin/getMaterialCategory", {params: params});
  },
  getDrawTutorialCategory(params) {
    return axios.get("/xxb/material/admin/getDrawTutorialCategory", {params: params});
  },
  getDrawTutorial(params) {
    return axios.get("/xxb/material/admin/getDrawTutorial", {params: params});
  },
  getRiddleCategory(params) {
    return axios.get("/xxb/material/admin/getRiddleCategory", {params: params});
  },
  getRiddle(params) {
    return axios.get("/xxb/material/admin/getRiddle", {params: params});
  },
  getGrammarCategory(params) {
    return axios.get("/xxb/material/admin/getGrammarCategory", {params: params});
  },
  getGrammar(params) {
    return axios.get("/xxb/material/admin/getGrammar", {params: params});
  },
  getLetter(params) {
    return axios.get("/xxb/material/admin/getLetter", {params: params});
  },
  getPhonetic(params) {
    return axios.get("/xxb/material/admin/getPhonetic", {params: params});
  },

};

export default xxbMaterial;
