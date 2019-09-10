import axios from '../../http'
import qs from 'querystring'


const jsdDistributie = {

  listDistributieRatio(params) {
    return axios.get(`/distribution/distributie/listDistributieRatio`, {params})
  },
  listByPromoter(params) {
    return axios.post(`/distribution/distributie/listByPromoter`, qs.stringify(params))
  },
  listByFranchisee(params) {
    return axios.post(`/distribution/distributie/listByFranchisee`, qs.stringify(params))
  },
  listByApplyFranchisee(params) {
    return axios.post(`/distribution/distributie/listByApplyFranchisee`, qs.stringify(params))
  },
  editDistributieRatio(params) {
    return axios.post(`/distribution/distributie/editDistributieRatio`, qs.stringify(params))
  },
  audit(params) {
    return axios.get(`/distribution/distributie/audit`, {params})
  },
  pageDistributieRatioLog(params) {
    return axios.post(`/distribution/distributie/pageDistributieRatioLog`, qs.stringify(params))
  }
}

export default jsdDistributie
