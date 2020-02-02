import axios from '../../http'
import qs from 'qs'


const activity = {
  getActivityData(params) {
    return axios.get(`/fissionprep/activity/getActivityData`, {params})
  },
  pageByActivityLog(params) {
    return axios.get(`/fissionprep/activity/pageByActivityLog`, {params})
  },
  getActivityById(params) {
    return axios.get(`/fissionprep/activity/getActivityById`, {params})
  },
  getActivityByTbookId(params) {
    return axios.get(`/fissionprep/activity/getActivityByTbookId`, {params})
  },
  saveActivity(params) {
    return axios.post(`/fissionprep/activity/saveActivity`, qs.stringify(params))
  },
  uptActivity(params) {
    return axios.post(`/fissionprep/activity/uptActivity`, qs.stringify(params))
  },
  saveNewActivit(params) {
    return axios.post(`/fissionprep/activity/saveNewActivit`, qs.stringify(params))
  },
  uptNewActivity(params) {
    return axios.post(`/fissionprep/activity/uptNewActivity`, qs.stringify(params))
  }
}

export default activity
