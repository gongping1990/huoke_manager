import axios from '../../http'
import qs from 'qs'

const statistics = {
  // 获取列表
  listTodayDayReport(params) {
    return axios.get('/sch/statistics/listTodayDayReport', {params: params})
  },
  listSumDayReport(params) {
    return axios.get('/sch/statistics/listSumDayReport', {params: params})
  },
  listDayReportByUser(params) {
    return axios.get('/sch/statistics/listDayReportByUser', {params: params})
  },
  listDayReportChartByBiz(params) {
    return axios.get('/sch/statistics/listDayReportChartByBiz', {params: params})
  }
}

export default statistics
