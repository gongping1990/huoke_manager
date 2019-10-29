import axios from '../../http'
import qs from 'qs'


const hkywhdCourse = {
  teachSubjectList(params) {
    return axios.get(`/fissionprep/course/list`, {params})
  },
  editionList(params) {
    return axios.get(`/fissionprep/course/listAllEdition`, {params})
  }
}

export default hkywhdCourse
