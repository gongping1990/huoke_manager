import axios from '../../http'
import qs from 'querystring'


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
    return axios.get(`/distribution/distributorAccount/uploadDeliverImg`, {params})
  }
}

export default jsdDistributorAccount
