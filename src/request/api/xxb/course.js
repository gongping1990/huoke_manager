import axios from '../../http'
import qs from 'qs'


const xxbCourse = {
  teachSubjectList(params) {
    return axios.get(`/xxb/course/list`, {params})
  },
  editionList(params) {
    return axios.get(`/xxb/course/listAllEdition`, {params})
  },
  queryPage(params) {
    return axios.get(`/xxb/course/category/queryPage`,  {params})
  },
  listAllOn(params) {
    return axios.get(`/xxb/course/category/listAllOn`,  {params})
  },
  removeById(params) {
    return axios.post(`/xxb/course/category/removeById`, qs.stringify(params))
  },
  save(params) {
    return axios.post(`/xxb/course/category/save`, qs.stringify(params))
  },
  update(params) {
    return axios.post(`/xxb/course/category/update`, qs.stringify(params))
  },
  setStatus(params) {
    return axios.post(`/xxb/course/category/setStatus`, qs.stringify(params))
  }
}

export default xxbCourse
