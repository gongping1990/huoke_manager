import axios from "../../http";
import qs from "qs";

const tbzwCourse = {
  courseQueryPage(params) {
    return axios.get('/compositionv2/course/queryPage', {params: params})
  },
  getById(params) {
    return axios.get(`/compositionv2/course/getById/${params}`)
  },
  // 新增课程信息
  tbzwCourseAdd(params) {
    return axios.post('/compositionv2/course/save', qs.stringify(params))
  },

  // 修改课程信息
  tbzwCourseUpdate(params) {
    return axios.post('/compositionv2/course/update', qs.stringify(params))
  },
  listByMyCourseHasgift(params) {
    return axios.get('/compositionv2/course/listByMyCourseHasgift', {params: params})
  },
};

export default tbzwCourse;
