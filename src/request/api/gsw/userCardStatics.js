import axios from '../../http'
import qs from 'querystring'


const userCardStatics = {
  //课程营 gsw
  getUserCaardStaticsDay(params) {
    return axios.get(`/poem/userCardStatics/getUserCardStaticsDay`, {params})
  },
  getUserCardStaticsLesson(params) {
    return axios.get('/poem/userCardStatics/getUserCardStaticsLesson', {params})
  }
}

export default userCardStatics
