import axios from '../../http'
import qs from 'querystring'


const gswOperational = {
  //订单 gsw
  saveOperational(params) {
    return axios.post(`/poem/operational/saveOperational`, qs.stringify(params))
  },
  removeOperational(params) {
    return axios.get(`/poem/operational/removeOperational`, {params})
  },
  recordVisits(params) {
    return axios.get(`/poem/operational/recordVisits`, {params})
  },
  listOperational(params) {
    return axios.post(`/poem/operational/listOperational`, qs.stringify(params))
  },
  finishOperational(params) {
    return axios.get(`/poem/operational/finishOperational`, {params})
  },
  getOperationalStatistics(params) {
    return axios.get(`/poem/operational/getOperationalStatistics`, {params})
  }
}

export default gswOperational
