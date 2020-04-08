import axios from "../../http";
import qs from "qs";

const gswHomepage = {
  pageHomePageCourse(params) {
    return axios.get('/poem-xym/homepage/pageHomePageCourse', {params: params})
  },
  editHomePageCourse(params) {
    return axios.post("/poem-xym/homepage/editHomePageCourse", qs.stringify(params));
  }
};

export default gswHomepage;
