import axios from '../../http'
import qs from 'querystring'


const hkywhdTagManage = {
  //订单 huokeyuwen
  getTagCategoryList(params) {
    return axios.get(`/xumg/tagManage/getTagCategoryList`, {params})
  },
  getTagPage(params) {
    return axios.get(`/xumg/tagManage/getTagPage`, {params})
  },
  saveTagCategory(params) {
    return axios.post("/xumg/tagManage/saveTagCategory", qs.stringify(params));
  },
  saveTag(params) {
    return axios.post("/xumg/tagManage/saveTag", qs.stringify(params));
  },
  getTags(params) {
    return axios.get("/xumg/userTag/getTags",{params});
  }
}

export default hkywhdTagManage
