import axios from '../../http'
import qs from 'querystring'


const xxbSxbStatistics = {
  //订单 huokeyuwen
  getSectionStatistics(params) {
    return axios.get(`/xxb/sxbStatistics/getSectionStatistics`, {params})
  }
}

export default xxbSxbStatistics
