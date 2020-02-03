import axios from '../../http'
import qs from 'querystring'


const xxbStatistics = {
  //订单 huokeyuwen
  getUserLearnStatistics(params) {
    return axios.get(`/xxb/statistics/getUserLearnStatistics`, {params})
  }
}

export default xxbStatistics
