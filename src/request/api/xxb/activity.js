import axios from '../../http'
import qs from 'qs'


const activity = {
  getActivityData(params) {
    return axios.get(`/xxb/activity/getActivityData`, {params})
  },
  pageByActivityLog(params) {
    return axios.get(`/xxb/activity/pageByActivityLog`, {params})
  },
  getActivityById(params) {
    return axios.get(`/xxb/activity/getActivityById`, {params})
  },
  getActivityByTbookId(params) {
    return axios.get(`/xxb/activity/getActivityByTbookId`, {params})
  },
  saveActivity(params) {
    return axios.post(`/xxb/activity/saveActivity`, qs.stringify(params))
  },
  uptActivity(params) {
    return axios.post(`/xxb/activity/uptActivity`, qs.stringify(params))
  },
  saveNewActivit(params) {
    return axios.post(`/xxb/activity/saveNewActivit`, qs.stringify(params))
  },
  uptNewActivity(params) {
    return axios.post(`/xxb/activity/uptNewActivity`, qs.stringify(params))
  }
}

export default activity
