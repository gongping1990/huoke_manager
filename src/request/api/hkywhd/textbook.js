import axios from '../../http'
import qs from 'qs'

const hkywhdTextbook = {
  pageStepsTextBookByQuery(params) {
    return axios.get('/fissionprep/textbook/pageStepsTextBookByQuery', {params: params})
  },
  pageTextBookByQuery(params) {
    return axios.get('/fissionprep/textbook/pageTextBookByQuery', {params: params})
  },
  listAll(params) {
    return axios.get('/fissionprep/textbook/listAll', {params: params})
  },
  listSuggestedBook(params) {
    return axios.get('/fissionprep/textbook/listSuggestedBook', {params: params})
  },
  addTextBook(params) {
    return axios.post('/fissionprep/textbook/addTextBook', qs.stringify(params))
  },
  removeTextBook(params) {
    return axios.post('/fissionprep/textbook/removeTextBook', qs.stringify(params))
  },
  saveStepsTextBook(params) {
    return axios.post('/fissionprep/textbook/saveStepsTextBook', qs.stringify(params))
  },
  updateStepsTextBook(params) {
    return axios.post('/fissionprep/textbook/updateStepsTextBook', qs.stringify(params))
  },
  updateTextBook(params) {
    return axios.post('/fissionprep/textbook/updateTextBook', qs.stringify(params))
  },
  editSuggestedBook(params) {
    return axios.post('/fissionprep/textbook/editSuggestedBook', params)
  }
}

export default hkywhdTextbook
