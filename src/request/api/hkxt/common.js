import axios from '../../http'
import qs from 'querystring'

const common = {
  // 上传图片公有
  uploadPublic(param) {
    return axios.post('/sch/common/uploadPublicFile', param)
  },
  // 获取音视频播放地址
  getAVUrl(params) {
    return axios.post('/sch/common/getPresignedUrl', qs.stringify(params))
  },
  // 上传视频私有
  uploadPrivate(param) {
    return axios.post('/sch/common/uploadPrivateFile', param)
  },
  // 获取客服信息
  getService(param) {
    return axios.get('/sch/common/sysConfig', param)
  },
  //  获取按钮状态
  getPriceBtn(param) {
    return axios.get('/sch/common/showprice')
  },
  // 更改按钮状态
  updatePriceBtn(param) {
    return axios.post('/sch/common/optShowMaPrice')
  }
}

export default common
