import axios from '../../http'
import qs from 'qs'


const xxbCompose = {
  teachSubjectList(params) {
    return axios.get(`/xxb/compose/list`, {params})
  },
  editionList(params) {
    return axios.get(`/xxb/compose/listAllEdition`, {params})
  },
  pageCompose(params) {
    return axios.get(`/xxb/compose/pageCompose`,  {params})
  },
  listBookInfoByCompose(params) {
    return axios.get(`/xxb/compose/listBookInfoByCompose`,  {params})
  },
  removeCompose(params) {
    return axios.post(`/xxb/compose/removeCompose`, qs.stringify(params))
  },
  saveLinkBook(params) {
    return axios.post(`/xxb/compose/saveLinkBook`, qs.stringify(params))
  },
  saveComposeService(params) {
    return axios.post(`/xxb/compose/saveComposeService`, qs.stringify(params))
  },
  display(params) {
    return axios.post(`/xxb/compose/display`, qs.stringify(params))
  }
}

export default xxbCompose
