import axios from "../../http";
import qs from "qs";

const gswReservat = {
  auditBatch(params) {
    return axios.post("/poem-xym/reservat/auditBatch", params);
  },
  saveExperienceConfig(params) {
    return axios.post("/poem-xym/experience/saveExperienceConfig", params);
  }
};

export default gswReservat;
