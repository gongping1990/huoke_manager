import axios from '../../http'
import qs from 'qs'

const graduategiftpack = {
  getGraduateGiftPack(params) {
    return axios.get('/sch/graduategiftpack/getGraduateGiftPack', {params: params})
  },
  editGraduateGiftPack(params) {
    return axios.post('/sch/graduategiftpack/editGraduateGiftPack', params)
  },
  getPreSaleRecommend(params) {
    return axios.get('/sch/graduategiftpack/getPreSaleRecommend', {params: params})
  },
  editPreSale(params) {
    return axios.post('/sch/graduategiftpack/editPreSale', params)
  }
}

export default graduategiftpack
