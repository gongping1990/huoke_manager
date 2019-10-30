import axios from '../../http'
import qs from 'qs'


const jsdDistributorAccount = {

  getDistributorAccountIncome(params) {
    return axios.get(`/distribution/distributorAccount/getDistributorAccountIncome`, {params})
  },
  getAdminWithdrawRecord(params) {
    return axios.get(`/distribution/distributorAccount/getAdminWithdrawRecord`, {params})
  },
  getAdminUserIncomeRecord(params) {
    return axios.get(`/distribution/distributorAccount/getAdminUserIncomeRecord`, {params})
  },
  getAdminUserWithDrawRecord(params) {
    return axios.get(`/distribution/distributorAccount/getAdminUserWithDrawRecord`, {params})
  },
  uploadDeliverImg(params) {
    return axios.post(`/distribution/distributorAccount/uploadDeliverImg`, qs.stringify(params))
  }
}

export default jsdDistributorAccount
