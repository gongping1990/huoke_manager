import axios from '../../http'
import qs from 'qs'

const xxbOperationPosition = {
  // 获取banner列表（朗读）
  getOperationPositionPage(params) {
    return axios.get('/xxb/operationPosition/getOperationPositionPage', {params: params})
  },
  // 修改排序值 (朗读)
  delete(params) {
    return axios.post('/xxb/operationPosition/delete', qs.stringify(params))
  },
  saveOperationPosition(params) {
    return axios.post('/xxb/operationPosition/saveOperationPosition', qs.stringify(params))
  },
  changeProvinceCityByOperationPositionId(params) {
    return axios.post('/xxb/operationPosition/changeProvinceCityByOperationPositionId', params)
  },
  // 删除banner(朗读)
  getProvinceCityByOperationPositionId(params) {
    return axios.get('/xxb/operationPosition/getProvinceCityByOperationPositionId', {params: params})
  },
}

export default xxbOperationPosition
