import axios from '../../http'
import qs from 'querystring'


const userCardStatics = {
  //课程营 gsw
  getUserCaardStaticsDay(params) {
    return axios.get(`/poem/userCardStatics/getUserCaardStaticsDay`, {params})
  },
  getUserCardStaticsLesson(params) {
    return axios.get('/poem/userCardStatics/getUserCardStaticsLesson', {params})
  }
}

export default userCardStatics
