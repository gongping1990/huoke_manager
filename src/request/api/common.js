import axios from '../http'

const common = {
  // 上传图片公有
  uploadPublic(param) {
    return axios.post('/common/uploadPublicFile', param)
  },
  // 上传视频私有
  uploadPrivate(param) {
    return axios.post('/common/uploadPrivateFile', param)
  }
}

export default common
