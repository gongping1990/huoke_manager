import axios from "../../http";
import qs from "qs";

const tbzwCourse = {
  courseQueryPage(params) {
    return axios.get('/composition/course/queryPage', {params: params})
  },
  getById(params) {
    return axios.get(`/composition/course/getById/${params}`)
  },
  // 新增课程信息
  tbzwCourseAdd(params) {
    return axios.post('/composition/course/save', qs.stringify(params))
  },

  // 修改课程信息
  tbzwCourseUpdate(params) {
    return axios.post('/composition/course/update', qs.stringify(params))
  },
};

export default tbzwCourse;
