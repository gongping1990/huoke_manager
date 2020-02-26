import axios from '../../http'
import qs from 'querystring'


const hkywhdOrder = {
  //订单 huokeyuwen
  hkywOrderList(params) {
    return axios.get(`/xxb/order/adminOrderList`, {params})
  },
  listOrderDayCount(params) {
    return axios.get(`/xxb/order/listOrderDayCount`, {params})
  },
  getOrderDayCountVOByToday(params) {
    return axios.get(`/xxb/order/getOrderDayCountVOByToday`, {params})
  },
  sumOrderDayCount(params) {
    return axios.get(`/xxb/order/sumOrderDayCount`, {params})
  },
  getOrderHelpUser(params) {
    return axios.get(`/xxb/order/getOrderHelpUser`, {params})
  },
  refund(params) {
    return axios.post("/xxb/order/refund", qs.stringify(params));
  },
}

export default hkywhdOrder
