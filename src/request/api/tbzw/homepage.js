import axios from "../../http";
import qs from "qs";

const tbzwHomepage = {
  pageHomePageCourse(params) {
    return axios.get('/compositionv3/homepage/pageHomePageCourse', {params: params})
  },
  editHomePageCourse(params) {
    return axios.post("/compositionv3/homepage/editHomePageCourse", qs.stringify(params));
  }
};

export default tbzwHomepage;
