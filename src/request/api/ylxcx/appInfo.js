import axios from '../../http'

const appInfo = {
  // 获取列表
  schoolList(params) {
    return axios.post('/search/appInfo/list', params)
  },
  // 删除
  delSchool(params) {
    return axios.post(`/search/appInfo/remove/${params.id}`)
  },
  // 新增
  addSchool(params) {
    return axios.post(`/search/appInfo/save`, params)
  },
  // 更新
  updateSchool(params) {
    return axios.post(`/search/appInfo/update`, params)
  }
}

export default appInfo
