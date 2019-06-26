import axios from '../../http'
import qs from 'qs'

const giftpack = {
 
  //新用户礼包信息
  giftPackInfo () {
    return axios.get('/sch/giftpack/viewNewUserGiftPack')
  },

  //修改获取用户礼包信息
  updateGiftPackInfo (params) {
    return axios.post('/sch/giftpack/edit',params)
  },

  //新增获取用户礼包信息
  addGiftPackInfo (params) {
    return axios.post('/sch/giftpack/create',params)
  }
}

export default giftpack
