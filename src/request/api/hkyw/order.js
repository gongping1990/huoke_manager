import axios from '../../http'
import qs from 'querystring'


const order = {
  //订单 huokeyuwen
  hkywOrderList(params) {
    return axios.get(`/prep/order/adminOrderList`, {params})
  }
}

export default order
