import axios from "../../http";
import qs from "qs";

const gswReservat = {
  auditBatch(params) {
    return axios.post("/poem/reservat/auditBatch", params);
  },
  saveExperienceConfig(params) {
    return axios.post("/poem/experience/saveExperienceConfig", params);
  }
};

export default gswReservat;
