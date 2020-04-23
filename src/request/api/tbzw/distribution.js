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
}

export default tbzwDistribution
