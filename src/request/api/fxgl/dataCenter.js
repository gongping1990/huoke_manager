import axios from '../../http'
import qs from 'querystring'


const fxglDataCenter = {

  getSalesData(params) {
    return axios.get(`/distribution/dataCenter/getSalesData`, {params})
  },
  getPromotorData(params) {
    return axios.get(`/distribution/dataCenter/getPromotorData`, {params})
  },
  getPromotionData(params) {
    return axios.get(`/distribution/dataCenter/getPromotionData`, {params})
  },
  getDataFunnel(params) {
    return axios.get(`/distribution/dataCenter/getDataFunnel`, {params})
  },
  getFranchiseeData(params) {
    return axios.get(`/distribution/dataCenter/getFranchiseeData`, {params})
  },
  getPlatformOutData(params) {
    return axios.get(`/distribution/dataCenter/getPlatformOutData`, {params})
  },
  getPlatformUserData(params) {
    return axios.get(`/distribution/dataCenter/getPlatformUserData`, {params})
  },

  refund(params) {
    return axios.post(`/distribution/dataCenter/refund`, qs.stringify(params))
  }
}

export default fxglDataCenter
