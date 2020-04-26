import axios from '../../http'
import qs from 'qs'

const tbzwDistribution = {
  // 获取banner列表（朗读）
  getCourseDistribution(params) {
    return axios.get('/compositionv3/distribution/getCourseDistribution', {params: params})
  },
  listCourse(params) {
    return axios.get('/compositionv3/distribution/listCourse', {params: params})
  },
  updateCourseDistribution(params) {
    return axios.post('/compositionv3/distribution/updateCourseDistribution', qs.stringify(params))
  },
  enableCourse(params) {
    return axios.post('/compositionv3/distribution/enableCourse', qs.stringify(params))
  },
  monthDistributionCount(params) {
    return axios.get('/compositionv3/distribution/monthDistributionCount', {params: params})
  },
  monthEarningsCount(params) {
    return axios.get('/compositionv3/distribution/monthEarningsCount', {params: params})
  },
  todayDistributionCount(params) {
    return axios.get('/compositionv3/distribution/todayDistributionCount', {params: params})
  },
  todayEarningsCount(params) {
    return axios.get('/compositionv3/distribution/todayEarningsCount', {params: params})
  },
  totalEarnings(params) {
    return axios.get('/compositionv3/distribution/totalEarnings', {params: params})
  },
  allDistributionCount(params) {
    return axios.get('/compositionv3/distribution/allDistributionCount', {params: params})
  },
}

export default tbzwDistribution
