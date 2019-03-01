import axios from '../http'
import qs from 'qs'

const materia = {
  // 获取年级列表
  gradeList(params) {
    return axios.get('/material/material/grade/list',{params: params})
  },
  // 获取栏目列表（资料库）
  columnList(params) {
    return axios.get('/material/material/catalog/list',{params: params})
  },
  // 资料列表（资料库）
  materialList(params) {
    return axios.get('/material/material/listWithCount',{params: params})
  },
  // 获取学科列表（资料库）
  subjectList(params) {
    return axios.get('/material/material/subject/list',{params: params})
  },
  // 新增栏目（资料库）
  addColumn(params) {
    return axios.post('/material/material/catalog/add',qs.stringify(params))
  },

  // 编辑栏目
  updateColumn(params) {
    return axios.post('/material/material/catalog/edit', qs.stringify(params))
  },

  // 创建资料
  addMaterial(params) {
    return axios.post('/material/material/add', params)
  },
  // 修改资料
  updateMaterial(params) {
    return axios.post('/material/material/edit', params)
  },
  // 删除资料
  delMaterial(params) {
    return axios.post('/material/material/remove', qs.stringify(params))
  },
  // 删除资料
  delColumn(params) {
    return axios.post('/material/material/catalog/remove', qs.stringify(params))
  },
  // 改变栏目状态
  changeColumn(params) {
    return axios.post('/material/material/catalog/enable', qs.stringify(params))
  },
  // 改变栏目状态
  updateSortNum(params) {
    return axios.post('/material/material/updateSortNum', qs.stringify(params))
  }
}

export default materia
