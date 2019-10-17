import axios from '../../http'
import qs from 'qs'


const activity = {
  pageByActivityLog(params) {
    return axios.get(`/fissionprep/activity/pageByActivityLog`, {params})
  },
  getActivityById(params) {
    return axios.get(`/fissionprep/activity/getActivityById`, {params})
  },
  saveActivity(params) {
    return axios.post(`/fissionprep/activity/saveActivity`, qs.stringify(params))
  },
  uptActivity(params) {
    return axios.post(`/fissionprep/activity/uptActivity`, qs.stringify(params))
  }
}

export default activity
