import axios from '../../http'
import qs from 'qs'

const jsdKfteacher = {
  add(params) {
    return axios.post(`/homework/kfteacher/add`, qs.stringify(params))
  },
  edit(params) {
    return axios.post(`/homework/kfteacher/edit`, qs.stringify(params))
  },
  disabled(params) {
    return axios.post(`/homework/kfteacher/disable`, qs.stringify(params))
  },
  enable(params) {
    return axios.post(`/homework/kfteacher/enable`, qs.stringify(params))
  },
  remove(params) {
    return axios.post(`/homework/kfteacher/remove`, qs.stringify(params))
  },
  moveToTeacher(params) {
    return axios.post(`/homework/kfteacher/moveToTeacher`, qs.stringify(params))
  },
  list(params) {
    return axios.get("/homework/kfteacher/list", {params: params});
  },
  selectTeacher(params) {
    return axios.get("/homework/kfteacher/selectTeacher", {params: params});
  },
  bindUser(params) {
    return axios.post("/homework/kfteacher/bindUser", qs.stringify(params));
  }
}

export default jsdKfteacher
