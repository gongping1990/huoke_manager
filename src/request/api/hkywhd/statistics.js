import axios from '../../http'
import qs from 'querystring'


const hkywhdStatistics = {
  //订单 huokeyuwen
  getUserLearnStatistics(params) {
    return axios.get(`/fissionprep/statistics/getUserLearnStatistics`, {params})
  }
}

export default hkywhdStatistics
