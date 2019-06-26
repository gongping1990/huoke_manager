import axios from '../../http'
import qs from 'qs'

const banner = {
  // 获取banner列表（资料库）
  zlkBannerList(params) {
    return axios.get('/material/banner/listByPage', {params: params})
  },

  // 修改排序值（资料库）
  zlkUpdateSortNum(params) {
    return axios.post('/material/banner/updateSortNum', qs.stringify(params))
  },
  // 创建（资料库）
  zlkAddBanner(params) {
    return axios.post('/material/banner/save', qs.stringify(params))
  },

  // 修改（资料库）
  zlkUpdateBanner(params) {
    return axios.post('/material/banner/update', qs.stringify(params))
  },

  // 删除banner（资料库）
  zlkDelBanner(params) {
    return axios.post(`/material/banner/remove/${params.id}`, qs.stringify(params))
  }
}

export default banner
