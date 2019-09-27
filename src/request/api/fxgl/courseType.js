import axios from '../../http'
import qs from 'querystring'


const jsdCourseType = {

  pageByCourseType(params) {
    return axios.get(`/distribution/coursetype/pageByCourseType`, {params})
  },
  editCourseType(params) {
    return axios.get(`/distribution/coursetype/editCourseType`, {params})
  },
  saveCourseType(params) {
    return axios.get(`/distribution/coursetype/saveCourseType`, {params})
  },
  listByCourseType(params) {
    return axios.get(`/distribution/coursetype/listByCourseType`, {params})
  }
}

export default jsdCourseType
