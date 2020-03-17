import axios from '../../http'
import qs from 'qs'

const xxbProvinceCity = {
  // 获取banner列表（朗读）
  getProvinceCityPage(params) {
    return axios.get('/xxb/provinceCity/getProvinceCityPage', {params: params})
  },
  getAllProvinceCity(params) {
    return axios.get('/xxb/provinceCity/getAllProvinceCity', {params: params})
  },
  saveProvinceCity(params) {
    return axios.post('/xxb/provinceCity/saveProvinceCity', qs.stringify(params))
  },
  setOrCancelDisplay(params) {
    return axios.post('/xxb/provinceCity/setOrCancelDisplay', qs.stringify(params))
  },
  setOrCancelHot(params) {
    return axios.post('/xxb/provinceCity/setOrCancelHot', qs.stringify(params))
  }
}

export default xxbProvinceCity
