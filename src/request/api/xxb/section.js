import axios from '../../http'
import qs from 'qs'

const xxbSection = {
  // 获取banner列表（朗读）
  getSectionPage(params) {
    return axios.get('/xxb/section/getSectionPage', {params: params})
  },
  delete(params) {
    return axios.post('/xxb/section/delete', qs.stringify(params))
  },
  saveSxbSection(params) {
    return axios.post('/xxb/section/saveSxbSection', qs.stringify(params))
  }
}

export default xxbSection
