import axios from '../http'
import qs from 'querystring'


const order = {
  // 获取订单列表
  orderList() {
    return axios.get('/order/queryMyOrder')
  },

  //订单详情
  orderDetail (params) {
    return axios.get('/order/queryOrderDetail',{params})
  },

  //我的拼课列表
  collageList () {
    return axios.get('/order/queryMyGroup')
  },

  // 订单详情
  collageDetail (params) {
    return axios.get('/order/queryGroupStatus',{params})
  },

  //获取该课程用户玩家数据
  orderUserList (params) {
    return axios.get('/order/queryGoodsPayUser',{params})
  },

  //获取该课程拼团数据
  groupList (params) {
    return axios.get('/order/queryGoodsProcessingGroup',{params})
  },

  //获取当前用户的课程状态
  groupUserStatus (params) {
    return axios.get('/order/queryGoodsWithUserStatus',{params})
  },
  // 免费支付接口
  orderAndFreePay(params) {
    return axios.post('/order/orderAndFreePay', qs.stringify(params))
  },
  //非免费支付接口
  orderAndPay(params) {
    return axios.post('/order/orderAndPay', qs.stringify(params))
  },
  // 拼课分享海报 
  getSharePoster(params) {
    return axios.get('/order/getSharePoster', {params})
  },
  // 获取是否支付成功
  queryOrderPayedStatus(params) {
    return axios.get('/order/queryOrderPayedStatus', {params})
  }
}

export default order
