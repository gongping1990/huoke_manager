import axios from '../../http'
import qs from 'qs'

const xxbInvestmanage = {
  // 获取banner列表（朗读）
  pageInvestManage(params) {
    return axios.get('/xxb/investmanage/pageInvestManage', {params: params})
  },
  finishInvest(params) {
    return axios.get('/xxb/investmanage/finishInvest', {params: params})
  },
  getInvestManageById(params) {
    return axios.get('/xxb/investmanage/getInvestManageById', {params: params})
  },
  pageWxSubscribeKfMsgData(params) {
    return axios.get('/xxb/investmanage/pageWxSubscribeKfMsgData', {params: params})
  },
  // 修改排序值 (朗读)
  addInvestManage(params) {
    return axios.post('/xxb/investmanage/addInvestManage', params)
  },
  updateInvestManage(params) {
    return axios.post('/xxb/investmanage/updateInvestManage', params)
  },
  listBizSystem(params) {
    return axios.post('/xxb/investmanage/listBizSystem', qs.stringify(params))
  },
}

export default xxbInvestmanage
