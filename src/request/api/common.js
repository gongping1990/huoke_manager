import axios from '../http'

const common = {
  // 发送验证码
  sendCode(data) {
    return axios.get('/common/sendCode', {params: data})
  },
  // 上传图片
  uploadPublicFile() {
    return axios.post('/common/uploadPublicFile', data)
  }
}

export default common