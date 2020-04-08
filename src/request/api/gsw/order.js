import axios from '../../http'
import qs from 'querystring'


const order = {
  //订单 gsw
  gswOrderList(params) {
    return axios.get(`/poem-xym/order/orderList`, {params})
  },
  newSourceOrder(params) {
    return axios.post(`/poem-xym/order/newSourceOrder`, qs.stringify(params))
  },
  refund(params) {
    return axios.post(`/poem-xym/order/refund`, qs.stringify(params))
  },
  getTotalData(params) {
    return axios.get("/poem-xym/order/getTotalData", {params: params});
  },
  getDataDetails(params) {
    return axios.get("/poem-xym/order/getDataDetails", {params: params});
  },
}

export default order
