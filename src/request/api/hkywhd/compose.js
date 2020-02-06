import axios from '../../http'
import qs from 'qs'


const hkywhdCompose = {
  teachSubjectList(params) {
    return axios.get(`/fissionprep/compose/list`, {params})
  },
  editionList(params) {
    return axios.get(`/fissionprep/compose/listAllEdition`, {params})
  },
  pageCompose(params) {
    return axios.get(`/fissionprep/compose/pageCompose`,  {params})
  },
  listBookInfoByCompose(params) {
    return axios.get(`/fissionprep/compose/listBookInfoByCompose`,  {params})
  },
  removeCompose(params) {
    return axios.post(`/fissionprep/compose/removeCompose`, qs.stringify(params))
  },
  saveLinkBook(params) {
    return axios.post(`/fissionprep/compose/saveLinkBook`, qs.stringify(params))
  },
  saveComposeService(params) {
    return axios.post(`/fissionprep/compose/saveComposeService`, qs.stringify(params))
  },
  display(params) {
    return axios.post(`/fissionprep/compose/display`, qs.stringify(params))
  }
}

export default hkywhdCompose
