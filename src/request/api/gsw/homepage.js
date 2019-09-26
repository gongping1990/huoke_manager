import axios from "../../http";
import qs from "qs";

const gswHomepage = {
  pageHomePageCourse(params) {
    return axios.get('/poem/homepage/pageHomePageCourse', {params: params})
  },
  editHomePageCourse(params) {
    return axios.post("/poem/homepage/editHomePageCourse", qs.stringify(params));
  }
};

export default gswHomepage;
