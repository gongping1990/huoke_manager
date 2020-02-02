import axios from '../../http'
import qs from 'qs'

const hkywhdBanner = {
  // 获取banner列表（朗读）
  pageBanner(params) {
    return axios.get('/fissionprep/banner/pageBanner', {params: params})
  },
  listBannerStatistics(params) {
    return axios.get('/fissionprep/banner/listBannerStatistics', {params: params})
  },
  // 修改排序值 (朗读)
  saveBanner(params) {
    return axios.post('/fissionprep/banner/saveBanner', qs.stringify(params))
  },
  // 删除banner(朗读)
  removeBanner(params) {
    return axios.get('/fissionprep/banner/removeBanner', {params: params})
  },
}

export default hkywhdBanner
