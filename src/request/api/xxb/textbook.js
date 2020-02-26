import axios from '../../http'
import qs from 'qs'

const xxbTextbook = {
  pageStepsTextBookByQuery(params) {
    return axios.get('/xxb/textbook/pageStepsTextBookByQuery', {params: params})
  },
  pageTextBookByQuery(params) {
    return axios.get('/xxb/textbook/pageTextBookByQuery', {params: params})
  },
  listAll(params) {
    return axios.get('/xxb/textbook/listAll', {params: params})
  },
  listSuggestedBook(params) {
    return axios.get('/xxb/textbook/listSuggestedBook', {params: params})
  },
  addTextBook(params) {
    return axios.post('/xxb/textbook/addTextBook', qs.stringify(params))
  },
  removeTextBook(params) {
    return axios.post('/xxb/textbook/removeTextBook', qs.stringify(params))
  },
  saveStepsTextBook(params) {
    return axios.post('/xxb/textbook/saveStepsTextBook', qs.stringify(params))
  },
  updateStepsTextBook(params) {
    return axios.post('/xxb/textbook/updateStepsTextBook', qs.stringify(params))
  },
  updateTextBook(params) {
    return axios.post('/xxb/textbook/updateTextBook', qs.stringify(params))
  },
  editSuggestedBook(params) {
    return axios.post('/xxb/textbook/editSuggestedBook', params)
  },
  lowerShelfTextBook(params) {
    return axios.get('/xxb/textbook/lowerShelfTextBook', {params: params})
  }
}

export default xxbTextbook
