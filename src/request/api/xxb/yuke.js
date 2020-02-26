import axios from '../../http'
import qs from 'qs'


const xxbYuke = {
  getAllTeachEdtions(params) {
    return axios.get(`/xxb/yuke/getAllTeachEdtions`, {params})
  },
  getAdminContent(params) {
    return axios.get(`/xxb/yuke/getAdminContent`, {params})
  }
}

export default xxbYuke
