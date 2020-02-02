import axios from '../../http'
import qs from 'qs'

const hkywhdTextlesson = {
  pageTextLessonDetail(params) {
    return axios.get('/fissionprep/textlesson/pageTextLessonDetail', {params: params})
  },
  updatelisten(params) {
    return axios.get('/fissionprep/textlesson/updatelisten', {params: params})
  },
  removeTextLesson(params) {
    return axios.get('/fissionprep/textlesson/removeTextLesson', {params: params})
  },
  addTextLesson(params) {
    return axios.post('/fissionprep/textlesson/addTextLesson', qs.stringify(params))
  },
  updateTextLesson(params) {
    return axios.post('/fissionprep/textlesson/updateTextLesson', qs.stringify(params))
  }
}

export default hkywhdTextlesson
