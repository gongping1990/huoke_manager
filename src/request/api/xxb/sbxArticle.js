import axios from '../../http'
import qs from 'qs'

const xxbSbxArticle = {
  // 获取banner列表（朗读）
  getArticlePage(params) {
    return axios.get('/xxb/sbxArticle/getArticlePage', {params: params})
  },
  delete(params) {
    return axios.post('/xxb/sbxArticle/delete', qs.stringify(params))
  },
  saveSbxArticle(params) {
    return axios.post('/xxb/sbxArticle/saveSbxArticle', qs.stringify(params))
  }
}

export default xxbSbxArticle
