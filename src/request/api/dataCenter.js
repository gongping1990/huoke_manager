import axios from '../http'
import qs from 'qs'

const dataCenter = {
  // 获取商品数据列表
  getGoodsList(params) {
    return axios.get('/dataCenter/goodsData', {params: params})
  },

  // 获取某个商品数据列表
  getGoodsItem(params) {
    return axios.get('/dataCenter/getHistoryGoodsDataById', {params: params})
  },

  // 用户数据交易数据
  getData(params) {
    return axios.get('/dataCenter/todayData', {params: params})
  },
}

export default dataCenter
