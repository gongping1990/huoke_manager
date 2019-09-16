import axios from "../../http";
import qs from "qs";

const tbzwHomepage = {
  pageHomePageCourse(params) {
    return axios.get('/composition/homepage/pageHomePageCourse', {params: params})
  },
  editHomePageCourse(params) {
    return axios.post("/composition/homepage/editHomePageCourse", qs.stringify(params));
  }
};

export default tbzwHomepage;
