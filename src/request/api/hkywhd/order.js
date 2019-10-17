import axios from '../../http'
import qs from 'querystring'


const hkywhdOrder = {
  //订单 huokeyuwen
  hkywOrderList(params) {
    return axios.get(`/fissionprep/order/adminOrderList`, {params})
  }
}

export default hkywhdOrder
