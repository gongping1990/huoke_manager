import axios from '../../http'
import qs from 'querystring'


const xxbUserMember = {
  //订单 huokeyuwen
  getUserMemberData(params) {
    return axios.get(`/xxb/userMember/getUserMemberData`, {params})
  },
  getUserMemberList(params) {
    return axios.get(`/xxb/userMember/getUserMemberList`, {params})
  },
  getUserInvitedList(params) {
    return axios.get(`/xxb/userMember/getUserInvitedList`, {params})
  },
  getDelay(params) {
    return axios.get(`/xxb/userMember/getDelay`, {params})
  },
  updateDelay(params) {
    return axios.get(`/xxb/userMember/updateDelay`, {params})
  }
}

export default xxbUserMember
