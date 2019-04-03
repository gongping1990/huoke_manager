import axios from '../http'
import qs from 'querystring'


const order = {
  // 获取订单列表
  orderList(params) {
    return axios.get('/order/queryAdminPage', {params})
  },

  //订单详情
  orderDetail(params) {
    return axios.get(`/order/getOrderById/${params}`)
  },
  //订单 huokeyuwen
  hkywOrderList(params) {
    return axios.get(`/prep/order/adminOrderList`, {params})
  }
}

export default order
