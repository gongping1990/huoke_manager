import axios from '../../http'
import qs from 'qs'

const xxbHomePage = {

  listByLessonStudyData(params) {
    return axios.get('/xxb/homepage/listByLessonStudyData', {params: params})
  },
}

export default xxbHomePage
