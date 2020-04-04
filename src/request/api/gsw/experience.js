import axios from "../../http";
import qs from "qs";

const gswExperience = {
  getExperienceConfigList(params) {
    return axios.post("/poem-xym/experience/getExperienceConfigList", qs.stringify(params));
  },
  saveExperienceConfig(params) {
    return axios.post("/poem-xym/experience/saveExperienceConfig", params);
  }
};

export default gswExperience;
