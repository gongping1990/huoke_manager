import axios from '../../http'
import qs from 'qs'


const hkywhdCourse = {
  teachSubjectList(params) {
    return axios.get(`/fissionprep/course/list`, {params})
  },
  editionList(params) {
    return axios.get(`/fissionprep/course/listAllEdition`, {params})
  },
  queryPage(params) {
    return axios.get(`/fissionprep/course/category/queryPage`,  {params})
  },
  listAllOn(params) {
    return axios.get(`/fissionprep/course/category/listAllOn`,  {params})
  },
  removeById(params) {
    return axios.post(`/fissionprep/course/category/removeById`, qs.stringify(params))
  },
  save(params) {
    return axios.post(`/fissionprep/course/category/save`, qs.stringify(params))
  },
  update(params) {
    return axios.post(`/fissionprep/course/category/update`, qs.stringify(params))
  },
  setStatus(params) {
    return axios.post(`/fissionprep/course/category/setStatus`, qs.stringify(params))
  }
}

export default hkywhdCourse
