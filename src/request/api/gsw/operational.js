import axios from '../../http'
import qs from 'querystring'


const gswOperational = {
  //订单 gsw
  saveOperational(params) {
    return axios.post(`/poem-xym/operational/saveOperational`, qs.stringify(params))
  },
  removeOperational(params) {
    return axios.get(`/poem-xym/operational/removeOperational`, {params})
  },
  recordVisits(params) {
    return axios.get(`/poem-xym/operational/recordVisits`, {params})
  },
  listOperational(params) {
    return axios.post(`/poem-xym/operational/listOperational`, qs.stringify(params))
  },
  finishOperational(params) {
    return axios.get(`/poem-xym/operational/finishOperational`, {params})
  },
  getOperationalStatistics(params) {
    return axios.get(`/poem-xym/operational/getOperationalStatistics`, {params})
  }
}

export default gswOperational
