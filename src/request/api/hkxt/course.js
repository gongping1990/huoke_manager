import axios from '../../http'
import qs from 'querystring'

const course = {
  courseList(params) {
    return axios.get('/sch/course/list', {params: params})
  },
  // 新增学科
  addSubject(params) {
    return axios.post('/sch/course/add', qs.stringify(params))
  },
  // 修改学科
  updateSubject(params) {
    return axios.post('/sch/course/update', qs.stringify(params))
  },
  // 删除学科
  delSubject(params) {
    return axios.post('/sch/course/remove', qs.stringify(params))
  },
  //学科列表
  subjectList() {
    return axios.get('/sch/course/get')
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
    return axios.get('/sch/course/category/queryPage')
  },
  // 课程类别列表创建
  addCourseType(params) {
    return axios.post('/sch/course/category/save', qs.stringify(params))
  },
  // 课程类别列表禁用启用
  changeCourseTypeStatus(params) {
    return axios.post('/sch/course/category/setStatus', qs.stringify(params))
  },
  // 课程类别列表禁用启用
  updateCourseType(params) {
    return axios.post('/sch/course/category/update', qs.stringify(params))
  },
  // 删除
  delCourseType(params) {
    return axios.post('/sch/course/category/removeById', qs.stringify(params))
  },
  // 课程排序值
  changeCourseSort(params) {
    return axios.post('/sch/course/updateSortNum', qs.stringify(params))
  },
  // 删除课程
  delCourse(params) {
    return axios.post('/sch/course/removeById', qs.stringify(params))
  },
  // 更新课程
  updateCourse(params) {
    return axios.post('/sch/course/updateBaseCourse', params)
  },
  // 新增课程
  addCourse(params) {
    return axios.post('/sch/course/saveBaseCourse', params)
  },
  // 课程详情
  courseInfo(params) {
    return axios.get(`/sch/course/getBaseCourse/?id=${params}`)
  },
  // 课时排序修改
  updateSortClassHour(params) {
    return axios.post(`/sch/course/lesson/updateSequence`, qs.stringify(params))
  },
  // 是否视听
  changeTryOut(params) {
    return axios.post(`/sch/course/lesson/updateStatus`, qs.stringify(params))
  },
  // 是否禁用
  changeDisabled(params) {
    return axios.post(`/sch/course/lesson/updateDisabled`, qs.stringify(params))
  },
  // 删除课时
  delClassHour(params) {
    return axios.post(`/sch/course/lesson/removeById`, qs.stringify(params))
  },
  // 获取课时列表
  classHourList(params) {
    return axios.get(`/sch/course/lesson/queryPage`, {params: params})
  },
  // 获取课时详情
  classHourInfo(params) {
    return axios.get(`/sch/course/lesson/getById`, {params: params})
  },
  // 新增
  addClassHour(params) {
    return axios.post(`/sch/course/lesson/save`, qs.stringify(params))
  },
  // 修改
  updateClassHour(params) {
    return axios.post(`/sch/course/lesson/update`, qs.stringify(params))
  }
}

export default course
