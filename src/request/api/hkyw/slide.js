import axios from '../../http'
import qs from "qs";

const slide = {
  // 新增内容
  addContent(params) {
    return axios.post('/prep/slide/add', qs.stringify(params))
  },
  // 获取类型下的页面
  getListType(params) {
    return axios.get('/prep/slide/listByType', {params})
  },
  // 删除页面
  delCheckpoint(params) {
    return axios.post('/prep/slide/remove', qs.stringify(params))
  },
  //修改内容
  updateCheckpoint(params) {
    return axios.post('/prep/slide/update', qs.stringify(params))
  },
  //调整页面顺序
  updateChapter(params) {
    return axios.post('/prep/slide/updatePageNo', params)
  }
}

export default slide
