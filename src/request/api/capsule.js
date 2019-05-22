import axios from '../http'
import qs from 'qs'

const capsule = {
  listByHCapsule(params) {
    return axios.post('/capsule/listByHCapsule', qs.stringify(params))
  },
  updateHCapsule(params) {
    return axios.post('/capsule/updateHCapsule', params)
  },
  delCapsule(params) {
    return axios.get('/capsule/removeHCapsule', {params: params})
  },
  saveHCapsule(params) {
    return axios.post('/capsule/saveHCapsule', params)
  },
  getHCapsuleDetails(params) {
    return axios.get('/capsule/getHCapsuleDetails', {params: params})
  },
  listByCapsuleCount(params) {
    return axios.get('/capsule/listByCapsuleCount', {params: params})
  },
  listByGoods(params) {
    return axios.get('/capsule/listByGoods', {params: params})
  }
}

export default capsule
