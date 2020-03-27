import axios from '../../http'
import qs from 'querystring'


const xxbSxbStatistics = {

  getSectionStatistics(params) {
    return axios.get(`/xxb/sxbStatistics/getSectionStatistics`, {params})
  },
  getProvinceCityStatistics(params) {
    return axios.get(`/xxb/sxbStatistics/getProvinceCityStatistics`, {params})
  }
}

export default xxbSxbStatistics
