import axios from "../../http";
import qs from "qs";

const tbzwLesson = {
  getLearnContent(params) {
    return axios.get("/compositionv3/lesson/getLearnContent", {
      params: params
    });
  },
  editLearnContent(params) {
    return axios.post("/compositionv3/lesson/editLearnContent", params);
  },
  editQuestion(params) {
    return axios.post("/compositionv3/lesson/editQuestion", params);
  },
  sortByLessonQuestion(params) {
    return axios.post("/compositionv3/lesson/sortByLessonQuestion", params);
  },
  listCheckPoint(params) {
    return axios.get("/compositionv3/lesson/listCheckPoint", {
      params: params
    });
  },
  removeCheckPointById(params) {
    return axios.get("/compositionv3/lesson/removeCheckPointById", {
      params: params
    });
  },
  saveCheckPoint(params) {
    return axios.post(
      "/compositionv3/lesson/saveCheckPoint",
      qs.stringify(params)
    );
  },
  sortByIds(params) {
    return axios.post("/compositionv3/lesson/sortByIds", params);
  },
  listIllustrationBook(params) {
    return axios.get("/compositionv3/lesson/listIllustrationBook", {
      params: params
    });
  },
  removeIllustrationBookById(params) {
    return axios.get("/compositionv3/lesson/removeIllustrationBookById", {
      params: params
    });
  },
  saveIllustrationBook(params) {
    return axios.post(
      "/compositionv3/lesson/saveIllustrationBook",
      qs.stringify(params)
    );
  },
  saveCheckPointVideo(params) {
    return axios.post(
      "/compositionv3/lesson/saveCheckPointVideo",
      qs.stringify(params)
    );
  },
  listProblem(params) {
    return axios.get("/compositionv3/lesson/listProblem", { params: params });
  },
  removeProblemById(params) {
    return axios.get("/compositionv3/lesson/removeProblemById", {
      params: params
    });
  },
  getPresetIcon(params) {
    return axios.get("/compositionv3/lesson/getPresetIcon", { params: params });
  },
  saveProblem(params) {
    return axios.post("/compositionv3/lesson/saveProblem", params);
  },
  saveLessonVideo(params) {
    return axios.post(
      "/compositionv3/lesson/saveLessonVideo",
      qs.stringify(params)
    );
  },
  saveStrokeImgById(params) {
    return axios.post(
      "/compositionv3/lesson/saveStrokeImgById",
      qs.stringify(params)
    );
  },
  saveCorrectTemplateById(params) {
    return axios.post(
      "/compositionv3/lesson/saveCorrectTemplateById",
      qs.stringify(params)
    );
  },
  listAudioTmpl(params) {
    return axios.get("/compositionv3/lesson/listAudioTmpl", { params });
  },
  removeAudioTmpl(params) {
    return axios.post(
      "/compositionv3/lesson/removeAudioTmpl",
      qs.stringify(params)
    );
  },
  editAudioTmpl(params) {
    return axios.post("/compositionv3/lesson/editAudioTmpl", params, {
      headers: { "Content-Type": "application/json" }
    });
  }
};

export default tbzwLesson;
