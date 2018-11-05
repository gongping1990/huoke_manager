import axios from '../http'
import qs from 'querystring'

const giftpack = {
  // 检测是否为新人
  checkNewPeople () {
    return axios.post('/giftpack/checkNewUser')
  },
  //新用户礼包信息
  giftPackInfo () {
    return axios.get('/giftpack/getNewUserGiftPack')
  },

  //新用户已领取礼包信息
  alreadyGiftPackInfo () {
    return axios.get('/giftpack/getMyNewUserGiftPack')
  },

  //点击获取用户礼包信息
  receiveGiftPackInfo (data) {
    return axios.post('/giftpack/receiveNewUserGift',qs.stringify(data))
  }
}

export default giftpack
