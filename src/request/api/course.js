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
  },
  // 课程类别列表
  courseTypeList() {
    return axios.get('/course/category/queryPage')
  },
  // 课程类别列表创建
  addCourseType(params) {
    return axios.post('/course/category/save', qs.stringify(params))
  },
  // 课程类别列表禁用启用
  changeCourseTypeStatus(params) {
    return axios.post('/course/category/setStatus',  qs.stringify(params))
  },
  // 课程类别列表禁用启用
  updateCourseType(params) {
    return axios.post('/course/category/update',  qs.stringify(params))
  },
  // 删除
  delCourseType(params) {
    return axios.post('/course/category/removeById',  qs.stringify(params))
  },
  // 课程排序值
  changeCourseSort(params) {
    return axios.post('/course/updateSortNum',  qs.stringify(params))
  },
  // 删除课程
  delCourse(params) {
    return axios.post('/course/removeById',  qs.stringify(params))
  },
  // 更新课程
  updateCourse(params) {
      return axios.post('/course/updateBaseCourse', params)
  },
  // 新增课程
  addCourse(params) {
      return axios.post('/course/saveBaseCourse', params)
  },
  // 课程详情
  courseInfo(params) {
      return axios.get(`/course/getBaseCourse/?id=${params}`)
  }
}

export default course
