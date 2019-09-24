import axios from '../../http'
import qs from 'querystring'


const jsdDistributorAccount = {

  getDistributorAccountIncome(params) {
    return axios.get(`/distribution/distributorAccount/getDistributorAccountIncome`, {params})
  },
  getAdminWithdrawRecord(params) {
    return axios.get(`/distribution/distributorAccount/getAdminWithdrawRecord`, {params})
  },
  withdraw(params) {
    return axios.post(`/distribution/distributorAccount/withdraw`, qs.stringify(params))
  }
}

export default jsdDistributorAccount
