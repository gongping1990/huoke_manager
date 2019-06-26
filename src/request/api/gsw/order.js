import axios from '../../http'
import qs from 'querystring'


const order = {
  //订单 gsw
  gswOrderList(params) {
    return axios.get(`/poem/order/orderList`, {params})
  }
}

export default order
