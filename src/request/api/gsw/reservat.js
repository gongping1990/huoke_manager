import axios from "../../http";
import qs from "qs";

const gswReservat = {
  getExperienceConfigList(params) {
    return axios.post("/poemr/eservat/auditBatch", qs.stringify(params));
  },
  saveExperienceConfig(params) {
    return axios.post("/poem/experience/saveExperienceConfig", params);
  }
};

export default gswReservat;
