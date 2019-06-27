import axios from '../../http'
import qs from 'qs'

const packages = {
  coursePackagePage(params) {
    return axios.get('/sch/package/coursePackagePage', {params: params})
  },
  delCoursePackage(params) {
    return axios.post('/sch/package/deleteCoursePackage', params)
  },
  deletePackageRecommend(params) {
    return axios.post('/sch/package/deletePackageRecommend', params)
  },
  endPackageRecommend(params) {
    return axios.post('/sch/package/endPackageRecommend', params)
  },
  packageRecommendPage(params) {
    return axios.get('/sch/package/packageRecommendPage', {params: params})
  },
  saveOrUpdateCoursePackage(params) {
    return axios.post('/sch/package/saveOrUpdateCoursePackage', params)
  },
  saveOrUpdatePackageRecommend(params) {
    return axios.post('/sch/package/saveOrUpdatePackageRecommend', params)
  },
  putawayCoursePackage(params) {
    return axios.post('/sch/package/putawayCoursePackage', params)
  },
  getCoursePackageDetais(params) {
    return axios.get('/sch/package/getCoursePackageDetais', {params: params})
  }
}

export default packages
