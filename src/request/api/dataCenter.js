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

  // 获取统计列表
  getPrepStatisticsData(params) {
    return axios.get('/prep/statistics/today', {params: params})
  },
  // 获取产品数据
  getPrepProductList(params) {
    return axios.get('/prep/statistics/lesson/report', {params: params})
  },
  // 获取产品数据详情
  getPrepProductDetail(params) {
    return axios.get('/prep/statistics/lesson/reportList', {params: params})
  }
}

export default dataCenter
