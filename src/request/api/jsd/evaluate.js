import axios from '../../http'
import qs from 'querystring'


const jsdEvaluate = {


  disabled(params) {
    return axios.post(`/homework/evaluate/disabled`, qs.stringify(params))
  },
  updateWithCourse(params) {
    return axios.post(`/homework/evaluate/updateWithCourse`, params)
  },
  listAllCourse(params) {
    return axios.get("/homework/evaluate/listAllCourse", {params: params});
  },
  listEvaluate(params) {
    return axios.get("/homework/evaluate/listEvaluate", {params: params});
  },
  listByWorkId(params) {
    return axios.get("/homework/evaluate/listByWorkId", {params: params});
  },
  listAllVersion(params) {
    return axios.get("/homework/evaluate/listAllVersion", {params: params});
  },

}

export default jsdEvaluate
