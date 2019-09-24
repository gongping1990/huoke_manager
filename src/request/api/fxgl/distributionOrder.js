import axios from '../../http'
import qs from 'querystring'


const jsdDistributionOrder = {

  getAdminOrder(params) {
    return axios.get(`/distribution/distributionOrder/getAdminOrder`, {params})
  },
  listByPromoter(params) {
    return axios.post(`/distribution/distributionOrder/listByPromoter`, qs.stringify(params))
  },
  listByFranchisee(params) {
    return axios.post(`/distribution/distributionOrder/listByFranchisee`, qs.stringify(params))
  },
  listByApplyFranchisee(params) {
    return axios.post(`/distribution/distributionOrder/listByApplyFranchisee`, qs.stringify(params))
  },
  editDistributieRatio(params) {
    return axios.post(`/distribution/distributionOrder/editDistributieRatio`, qs.stringify(params))
  },
  audit(params) {
    return axios.get(`/distribution/distributionOrder/audit`, {params})
  },
  pageDistributieRatioLog(params) {
    return axios.post(`/distribution/distributionOrder/pageDistributieRatioLog`, qs.stringify(params))
  },
  refund(params) {
    return axios.post(`/distribution/distributionOrder/refund`, qs.stringify(params))
  }
}

export default jsdDistributionOrder
