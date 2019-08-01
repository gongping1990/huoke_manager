import axios from "../../http";
import qs from "qs";

const gswExperience = {
  getExperienceConfigList(params) {
    return axios.post("/poem/experience/getExperienceConfigList", qs.stringify(params));
  },
  saveExperienceConfig(params) {
    return axios.post("/poem/experience/saveExperienceConfig", params);
  }
};

export default gswExperience;
