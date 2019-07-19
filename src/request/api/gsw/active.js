import axios from '../../http'
import qs from 'querystring'


const active = {
  //课程营 gsw
  removeActive(params) {
    return axios.get(`/poem/active/remove`, {params})
  },
  addActiveConfig(params) {
    return axios.post('/poem/active/addActiveConfig', qs.stringify(params))
  },
  listActiveConfig(params) {
    return axios.post('/poem/active/listActiveConfig', qs.stringify(params))
  }
}

export default active
