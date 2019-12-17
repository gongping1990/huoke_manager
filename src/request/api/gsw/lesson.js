import axios from "../../http";
import qs from "qs";

const gswLesson = {

  getLessonDraft(params) {
    return axios.get("/poem/lesson/getLessonDraft", {params: params});
  },

  editLessonDraft(params) {
    return axios.post("/poem/lesson/editLessonDraft", qs.stringify(params));
  },
};

export default gswLesson;
