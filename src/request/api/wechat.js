import axios from '../http'

const wechat = {

  // 获取二维码
  QrCode () {
    return axios.get('/wechat/wxQrCodeUrl')
  },
  // 微信分享
  share(params) {
    return axios.get('/wechat/oauth2/share', {params})
  },
  // 拼课分享邀请 中转
  shareLesson(params) {
    return axios.get('/wechat/group/shareLesson', {params})
  },
  // 获取授权连接url
  getAuthorizeUrl(params) {
    return axios.get('/wechat/oauth2/getAuthorizeUrl', {params})
  }

}

export  default wechat
