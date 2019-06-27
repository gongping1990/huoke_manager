import axios from '../../http'
import qs from 'qs'

const graduategiftpack = {
  getGraduateGiftPack(params) {
    return axios.get('/sch/graduategiftpack/getGraduateGiftPack', {params: params})
  },
  editGraduateGiftPack(params) {
    return axios.get('/sch/graduategiftpack/editGraduateGiftPack', {params: params})
  },
  getPreSaleRecommend(params) {
    return axios.get('/sch/graduategiftpack/getPreSaleRecommend', {params: params})
  },
  editPreSale(params) {
    return axios.get('/sch/graduategiftpack/editPreSale', {params: params})
  }
}

export default graduategiftpack
