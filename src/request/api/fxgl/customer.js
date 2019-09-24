import axios from '../../http'
import qs from 'querystring'


const jsdCustomer = {

  getBaseConfig(params) {
    return axios.get(`/distribution/customer/getBaseConfig`, {params})
  },
  editBaseConfig(params) {
    return axios.post(`/distribution/customer/editBaseConfig`, qs.stringify(params))
  }
}

export default jsdCustomer
