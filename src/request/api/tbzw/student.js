import axios from "../../http";
import qs from "qs";

const tbzwStudent = {
  addStudent(params) {
    return axios.post('/umg/student/add', qs.stringify(params))
  },
  getStudent(params) {
    return axios.get("/umg/student/get", {params: params});
  },
  updateStudent(params) {
    return axios.post("/umg/student/update", qs.stringify(params));
  }
};

export default tbzwStudent;
