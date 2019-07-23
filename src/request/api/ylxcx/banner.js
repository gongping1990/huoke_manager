import axios from '../../http'

const banner = {
  // 获取首页banner
  bannerList(params) {
    return axios.get('/search/banner/page', params)
  },
  addBanner(params) {
    return axios.post('/search/banner/save', params)
  },
  updateBanner(params) {
    return axios.post('/search/banner/update', params)
  },
  delBanner(params) {
    return axios.post(`/search/banner/remove/${params}`)
  },
  sortBanner(params) {
    return axios.post(`/search/banner/updateSortNum`, params)
  },
  //省
  provincesList(params) {
    return axios.get(`/search/banner/provinces/list`, params)
  },
  //市
  cityList(params) {
    return axios.get(`/search/banner/cities/list`, {params: params})
  },
  //区（县）
  areasList(params) {
    return axios.get(`/search/banner/areas/list`, {params: params})
  },

}

export default banner
