import axios from '../../http'
import qs from 'querystring'


const hkywhdOrder = {
  //订单 huokeyuwen
  hkywOrderList(params) {
    return axios.get(`/fissionprep/order/adminOrderList`, {params})
  },
  listOrderDayCount(params) {
    return axios.get(`/fissionprep/order/listOrderDayCount`, {params})
  },
  getOrderDayCountVOByToday(params) {
    return axios.get(`/fissionprep/order/getOrderDayCountVOByToday`, {params})
  },
  sumOrderDayCount(params) {
    return axios.get(`/fissionprep/order/sumOrderDayCount`, {params})
  },
}

export default hkywhdOrder
