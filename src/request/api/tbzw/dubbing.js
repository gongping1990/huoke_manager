import axios from '../../http'
import qs from 'qs'

const tbzwDubbing = {
  // 获取banner列表（朗读）
  listByDubbing(params) {
    return axios.get('/compositionv3/dubbing/listByDubbingCategory', {params: params})
  },
  removeDubbingById(params) {
    return axios.get('/compositionv3/dubbing/removeDubbingById', {params: params})
  },
  editDubbing(params) {
    return axios.post('/compositionv3/dubbing/editDubbing', qs.stringify(params))
  },
}

export default tbzwDubbing
