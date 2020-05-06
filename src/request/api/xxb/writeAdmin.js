import axios from '../../http'
import qs from 'qs'

const xxbWriteAdmin = {
  getAllTeachingMaterial(params) {
    return axios.get('/content/writeAdmin/getAllTeachingMaterial', {params: params})
  },
  getListByTeachingMaterialId(params) {
    return axios.get('/content/writeAdmin/getListByTeachingMaterialId', {params: params})
  }
}

export default xxbWriteAdmin
