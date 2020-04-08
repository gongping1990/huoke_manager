import axios from "../../http";
import qs from "qs";

const tbzwStudent = {
  addStudent(params) {
    return axios.post('/xumg/student/add', qs.stringify(params))
  },
  getStudent(params) {
    return axios.get("/xumg/student/get", {params: params});
  },
  updateStudent(params) {
    return axios.post("/xumg/student/update", qs.stringify(params));
  },
  getUserRoleInfoAndTagVOById(params) {
    return axios.get("/xumg/userRoleInfo/getUserRoleInfoAndTagVOById", {params: params});
  }
};

export default tbzwStudent;
