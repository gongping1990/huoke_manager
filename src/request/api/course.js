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
    return axios.post('/course/category/setStatus', qs.stringify(params))
  },
  // 课程类别列表禁用启用
  updateCourseType(params) {
    return axios.post('/course/category/update', qs.stringify(params))
  },
  // 删除
  delCourseType(params) {
    return axios.post('/course/category/removeById', qs.stringify(params))
  },
  // 课程排序值
  changeCourseSort(params) {
    return axios.post('/course/updateSortNum', qs.stringify(params))
  },
  // 删除课程
  delCourse(params) {
    return axios.post('/course/removeById', qs.stringify(params))
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
  },
  // 课时排序修改
  updateSortClassHour(params) {
    return axios.post(`/course/lesson/updateSequence`, qs.stringify(params))
  },
  // 是否视听
  changeTryOut(params) {
    return axios.post(`/course/lesson/updateStatus`, qs.stringify(params))
  },
  // 是否禁用
  changeDisabled(params) {
    return axios.post(`/course/lesson/updateDisabled`, qs.stringify(params))
  },
  // 删除课时
  delClassHour(params) {
    return axios.post(`/course/lesson/removeById`, qs.stringify(params))
  },
  // 获取课时列表
  classHourList(params) {
    return axios.get(`/course/lesson/queryPage`, {params: params})
  },
  // 获取课时详情
  classHourInfo(params) {
    return axios.get(`/course/lesson/getById`, {params: params})
  },
  // 新增
  addClassHour(params) {
    return axios.post(`/course/lesson/save`, qs.stringify(params))
  },
  // 修改
  updateClassHour(params) {
    return axios.post(`/course/lesson/update`, qs.stringify(params))
  },
   // 朗读-教材列表
  ldCourseList(params) {
    return axios.get(`/declaim/course/queryPage`, {params: params})
  },
  // 朗读-禁用
  ldChangeStatus(params) {
    return axios.post(`/declaim/course/disabled`, qs.stringify(params))
  },
  // 朗读-新增
  ldAddCourse(params) {
    return axios.post(`/declaim/course/save`, qs.stringify(params))
  },
  // 朗读-修改
  ldUpdateList(params) {
    return axios.post(`/declaim/course/update`, qs.stringify(params))
  },
  // 朗读-修改
  ldUpdateSortNum(params) {
    return axios.post(`/declaim/course/updateSortNum`, qs.stringify(params))
  },
  // 朗读-修改-课程内容
  ldUpdateContentCourse(params) {
    return axios.post(`/declaim/course/updateContentCourse`, qs.stringify(params))
  },
  // 朗读-修改-音频地址
  ldUpdateAudioCourse(params) {
    return axios.post(`/declaim/course/updateAudioCourse`, qs.stringify(params))
  },
  // 朗读-修改-图片地址
  ldUpdateAchievementCourse(params) {
    return axios.post(`/declaim/course/updateAchievementCourse`, qs.stringify(params))
  }
}

export default course
