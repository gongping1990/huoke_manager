import axios from '../../http'
import qs from 'qs'


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
  },
  pageBindingRelationship(params) {
    return axios.get(`/distribution/distributie/pageBindingRelationship`, {params})
  },
  pageByInvitationUser(params) {
    return axios.get(`/distribution/distributie/pageByInvitationUser`, {params})
  },
  listByCourse(params) {
    return axios.get(`/distribution/distributie/listByCourse`, {params})
  },
  editDistributieCourse(params) {
    return axios.post(`/distribution/distributie/editDistributieCourse`, qs.stringify(params))
  },
  editDistributieShare(params) {
    return axios.post(`/distribution/distributie/editDistributieShare`, qs.stringify(params))
  }
}

export default jsdDistributie
