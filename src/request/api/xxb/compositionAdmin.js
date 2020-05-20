import axios from '../../http'
import qs from 'qs'

const xxbCompositionAdmin = {
  getLink(params) {
    return axios.get('/content/compositionAdmin/getLink', {params: params})
  },
  getList(params) {
    return axios.get('/content/compositionAdmin/list', {params: params})
  },
  updateLink(params) {
    return axios.post('/content/compositionAdmin/updateLink', qs.stringify(params))
  },
}

export default xxbCompositionAdmin
