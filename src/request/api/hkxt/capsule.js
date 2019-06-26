import axios from '../../http'
import qs from 'qs'

const capsule = {
  listByHCapsule(params) {
    return axios.post('/sch/capsule/listByHCapsule', qs.stringify(params))
  },
  updateHCapsule(params) {
    return axios.post('/sch/capsule/updateHCapsule', params)
  },
  delCapsule(params) {
    return axios.get('/sch/capsule/removeHCapsule', {params: params})
  },
  saveHCapsule(params) {
    return axios.post('/sch/capsule/saveHCapsule', params)
  },
  getHCapsuleDetails(params) {
    return axios.get('/sch/capsule/getHCapsuleDetails', {params: params})
  },
  listByCapsuleCount(params) {
    return axios.get('/sch/capsule/listByCapsuleCount', {params: params})
  },
  listByGoods(params) {
    return axios.get('/sch/capsule/listByGoods', {params: params})
  }
}

export default capsule
