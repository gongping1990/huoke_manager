import axios from '../../http'
import qs from 'querystring'


const hkywhdTagManage = {
  //订单 huokeyuwen
  getTagCategoryList(params) {
    return axios.get(`/umg/tagManage/getTagCategoryList`, {params})
  },
  getTagPage(params) {
    return axios.get(`/umg/tagManage/getTagPage`, {params})
  },
  saveTagCategory(params) {
    return axios.post("/umg/tagManage/saveTagCategory", qs.stringify(params));
  },
  saveTag(params) {
    return axios.post("/umg/tagManage/saveTag", qs.stringify(params));
  },
  getTags(params) {
    return axios.get("/umg/userTag/getTags",{params});
  }
}

export default hkywhdTagManage
