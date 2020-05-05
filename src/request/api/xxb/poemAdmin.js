import axios from '../../http'
import qs from 'qs'

const xxbPoemAdmin = {
  getCategoryList(params) {
    return axios.get('/content/poemAdmin/getCategoryList', {params: params})
  },
  getPoemSubCategoryList(params) {
    return axios.get('/content/poemAdmin/getPoemSubCategoryList', {params: params})
  },
  updatePoemCategoryCover(params) {
    return axios.post('/content/poemAdmin/updatePoemCategoryCover', qs.stringify(params))
  },
  getClassContent(params) {
    return axios.get('/content/poemAdmin/getClassContent', {params: params})
  }
}

export default xxbPoemAdmin
