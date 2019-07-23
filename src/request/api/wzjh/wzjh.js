import axios from '../../http'
import qs from 'qs'

const wzjh = {
  // 奖品相关
  prizeList(param) {
    return axios.get('/sp/prize/adminList', {params: param})
  },
  prizeDetail() {
    return axios.get('/sp/prize/details')
  },
  editPrize(param) {
    return axios.post('/sp/prize/saveOrderUpdate', qs.stringify(param))
  },
  prizeDel(param) {
    return axios.post('/sp/prize/delete', qs.stringify(param))
  },
  getAdminConvertOrder(param) {
    return axios.get('/sp/prize/getAdminConvertOrder',  {params: param})
  },
  prizeSend(param) {
    return axios.post('/sp/prize/send', qs.stringify(param))
  },

  // 关键词
  listByHotKeyword(param) {
    return axios.get('/sp/useroperate/listByHotKeyword')
  },
  updateHotKeyword(param) {
    return axios.post('/sp/useroperate/updateHotKeyword', qs.stringify(param))
  },
  // 渠道管理
  listByChannel(param) {
    return axios.get('/sp/channel/listByChannel', {params: param})
  },
  addChannel(param) {
    return axios.post('/sp/channel/addChannel', qs.stringify(param))
  },
  updateChannel(param) {
    return axios.post('/sp/channel/updateChannel', qs.stringify(param))
  },
  listByChannelDetails(param) {
    return axios.get('/sp/channel/listByChannelDetails', {params: param})
  },

  //栏目列表
  columnList(param) {
    return axios.get('/sp/category/columnList', {params: param})
  },
  articleList(param) {
    return axios.get('/sp/category/articleList', {params: param})
  },
  articleCategorySave(param) {
    return axios.post('/sp/category/articleCategorySave', qs.stringify(param))
  },
  articleCategoryDelete(param) {
    return axios.post('/sp/category/articleCategoryDelete', qs.stringify(param))
  },
  articleDelete(param) {
    return axios.post('/sp/category/articleDelete', qs.stringify(param))
  },
  articleSave(param) {
    return axios.post('/sp/category/articleSave', qs.stringify(param))
  },
  articleDetails(param) {
    return axios.get('/sp/category/articleDetails', {params: param})
  },
  teachingList(params) {
    return axios.get('/sp/category/teachingMaterialList', {params})
  },
  teachingVersion(params) {
    return axios.get('/sp/category/teachingEditionList', {params})
  },
  teachingMaterialDelete(params) {
    return axios.post('/sp/category/teachingMaterialDelete', qs.stringify(params))
  },
  teachingMaterialSave(params) {
    return axios.post('/sp/category/teachingMaterialSave', qs.stringify(params))
  },

  //反馈
  feedbackList(param) {
    return axios.get('/sp/feedback/listByPage', {params: param})
  },
  addReply(param) {
    return axios.post('/sp/feedback/addReply', qs.stringify(param))
  },
  //订单
  adminOrderList(params) {
    return axios.get(`/sp/order/adminOrderList`, {params})
  },
  // 留存率
  listRetentionRate(params) {
    return axios.get(`/sp/statistics/listRetentionRate`, {params})
  },
  getUserAccessStat(params) {
    return axios.get(`/sp/statistics/getUserAccessStat`, {params})
  },


  //用户
  getUserList(params) {
    return axios.get("/sp/user/queryUserPage", {params: params});
  },

  //banner
  bannerList(params) {
    return axios.get(`/sp/banner/listBypage`, {params})
  },
  saveBanner(param) {
    return axios.post('/sp/banner/save', param)
  },
  updateBanner(param) {
    return axios.post('/sp/banner/update', param)
  },
  updateSortNumBanner(param) {
    return axios.post('/sp/banner/updateSortNum', qs.stringify(param))
  },
  delBanner(param) {
    return axios.post(`/sp/banner/remove/${param.id}`)
  },

  // 学列表
  getSubjectList(params) {
    return axios.get('/sp/operation/subject/list', {params: params})
  },
  updateSubject(params) {
    return axios.post('/sp/operation/subject/update',  qs.stringify(params))
  },
  //文章数据
  getArtcileRank(params) {
    return axios.get('/sp/statistics/artcile/rank', {params})
  },
  getSubjectColumn(params) {
    return axios.get(`/sp/category/subject`, {params})
  },
  getColumnsList(params) {
    return axios.get(`/sp/statistics/cate/total/${params}`)
  },
  getCateRank(params) {
    return axios.get('/sp/statistics/cate/rank', {params})
  },
}

export default wzjh
