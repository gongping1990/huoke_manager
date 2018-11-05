import axios from '../http'

const goods = {
  listGoodsCourseByPage(data) {
    return axios.get('/goods/listGoodsCourseByPage', {params: data})
  },

  // 获取课程详情
  courseInfo(data) {
    return axios.get('/goods/getCourseGoods', {params: data})
  }
}

export default goods
