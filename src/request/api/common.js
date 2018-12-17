import axios from '../http'
import qs from 'querystring'

const common = {
  // 上传图片公有
  uploadPublic(param) {
    return axios.post('/common/uploadPublicFile', param)
  },
  // 获取音视频播放地址
  getAVUrl(params) {
    return axios.post('/common/getPresignedUrl', qs.stringify(params))
  },
  // 上传视频私有
  uploadPrivate(param) {
    return axios.post('/common/uploadPrivateFile', param)
  },
  // 获取客服信息
  getService(param) {
    return axios.post('/common/sysConfig', param)
  }
}

export default common
