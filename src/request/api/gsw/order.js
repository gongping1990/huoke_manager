import axios from '../../http'
import qs from 'querystring'


const order = {
  //订单 gsw
  gswOrderList(params) {
    return axios.get(`/poem/order/orderList`, {params})
  },
  newSourceOrder(params) {
    return axios.post(`/poem/order/newSourceOrder`, qs.stringify(params))
  },
  getTotalData(params) {
    return axios.get("/poem/order/getTotalData", {params: params});
  },
  getDataDetails(params) {
    return axios.get("/poem/order/getDataDetails", {params: params});
  },
}

export default order
