import axios from '../http'
import qs from 'querystring'

const course = {
  courseList(params) {
    return axios.get('/course/list', {params: params})
  },
  // 新增学科
  addSubject(params) {
    return axios.post('/course/add', qs.stringify(params))
  },
  // 修改学科
  updateSubject(params) {
    return axios.post('/course/update', qs.stringify(params))
  },
  // 删除学科
  delSubject(params) {
    return axios.post('/course/remove', qs.stringify(params))
  },
  //学科列表
  subjectList() {
    return axios.get('/course/get')
  },
  //添加教材时的学科列表
  teachSubjectList(params) {
    return axios.get('/prep/course/list', {params: params})
  },
  //教材版本列表
  editionList() {
    return axios.get('/prep/course/listAllEdition')
  }
}

export default course
