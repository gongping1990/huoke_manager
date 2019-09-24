import axios from '../../http'
import qs from 'querystring'


const jsdCustomer = {

  editBaseConfig(params) {
    return axios.get(`/distribution/customer/editBaseConfig`, {params})
  },
  withdraw(params) {
    return axios.post(`/distribution/customer/editBaseConfig`, qs.stringify(params))
  }
}

export default jsdCustomer
