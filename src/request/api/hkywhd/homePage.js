import axios from '../../http'
import qs from 'qs'

const hkywhdHomePage = {

  listByLessonStudyData(params) {
    return axios.get('/fissionprep/homepage/listByLessonStudyData', {params: params})
  },
}

export default hkywhdHomePage
