import axios from '../http'

const common = {
  // 发送验证码
  sendCode(param) {
    return axios.get('/common/sendCode', {params: param})
  },
  // 上传签名
  uploadSign(param) {
    return axios.post('/common/getTencentCosSign', param)
  }
}

export default common
