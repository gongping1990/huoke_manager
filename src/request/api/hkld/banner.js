import axios from '../../http'
import qs from 'qs'

const banner = {
  // 获取banner列表（朗读）
  ldBannerList(params) {
    return axios.get('/declaim/banner/queryPage', {params: params})
  },
  // 修改排序值 (朗读)
  ldUpdateSortNum(params) {
    return axios.post('/declaim/banner/updateSortNum', qs.stringify(params))
  },
  // 创建朗读
  ldAddBanner(params) {
    return axios.post('/declaim/banner/save', qs.stringify(params))
  },

  // 修改(朗读)
  ldUpdateBanner(params) {
    return axios.post('/declaim/banner/update', qs.stringify(params))
  },

  // 删除banner(朗读)
  ldDelBanner(params) {
    return axios.post('/declaim/banner/removeById', qs.stringify(params))
  }
}

export default banner
