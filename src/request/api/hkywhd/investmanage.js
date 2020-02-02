import axios from '../../http'
import qs from 'qs'

const hkywhdInvestmanage = {
  // 获取banner列表（朗读）
  pageInvestManage(params) {
    return axios.get('/fissionprep/investmanage/pageInvestManage', {params: params})
  },
  finishInvest(params) {
    return axios.get('/fissionprep/investmanage/finishInvest', {params: params})
  },
  getInvestManageById(params) {
    return axios.get('/fissionprep/investmanage/getInvestManageById', {params: params})
  },
  pageWxSubscribeKfMsgData(params) {
    return axios.get('/fissionprep/investmanage/pageWxSubscribeKfMsgData', {params: params})
  },
  // 修改排序值 (朗读)
  addInvestManage(params) {
    return axios.post('/fissionprep/investmanage/addInvestManage', params)
  },
  updateInvestManage(params) {
    return axios.post('/fissionprep/investmanage/updateInvestManage', params)
  },
  listBizSystem(params) {
    return axios.post('/fissionprep/investmanage/listBizSystem', qs.stringify(params))
  },
}

export default hkywhdInvestmanage
