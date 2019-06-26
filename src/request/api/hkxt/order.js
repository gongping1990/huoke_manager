import axios from '../../http'
import qs from 'querystring'


const order = {
  // 获取订单列表
  orderList(params) {
    return axios.get('/sch/order/queryAdminPage', {params})
  },

  //订单详情
  orderDetail(params) {
    return axios.get(`/sch/order/getOrderById/${params}`)
  }
}

export default order
