import axios from '../../http'
import qs from 'querystring'


const hkywhdUserMember = {
  //订单 huokeyuwen
  getUserMemberData(params) {
    return axios.get(`/fissionprep/userMember/getUserMemberData`, {params})
  },
  getUserMemberList(params) {
    return axios.get(`/fissionprep/userMember/getUserMemberList`, {params})
  },
  getUserInvitedList(params) {
    return axios.get(`/fissionprep/userMember/getUserInvitedList`, {params})
  },
  getDelay(params) {
    return axios.get(`/fissionprep/userMember/getDelay`, {params})
  },
  updateDelay(params) {
    return axios.get(`/fissionprep/userMember/updateDelay`, {params})
  }
}

export default hkywhdUserMember
