import axios from '../../http'
import qs from 'qs'

const dataCenter = {
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
