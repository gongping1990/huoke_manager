import axios from '../../http'
import qs from 'qs'

const xxbTextlesson = {
  pageTextLessonDetail(params) {
    return axios.get('/xxb/textlesson/pageTextLessonDetail', {params: params})
  },
  updatelisten(params) {
    return axios.get('/xxb/textlesson/updatelisten', {params: params})
  },
  removeTextLesson(params) {
    return axios.get('/xxb/textlesson/removeTextLesson', {params: params})
  },
  addTextLesson(params) {
    return axios.post('/xxb/textlesson/addTextLesson', qs.stringify(params))
  },
  updateTextLesson(params) {
    return axios.post('/xxb/textlesson/updateTextLesson', qs.stringify(params))
  }
}

export default xxbTextlesson
