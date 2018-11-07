import axios from '../http'

const goods = {
  courseGoodsList(data) {
    return axios.get('/goods/listPage', {params: data})
  },

  // 获取课程详情
  courseInfo(data) {
    return axios.get('/goods/getCourseGoods', {params: data})
  }
}

export default goods
