import axios from '../http'
import qs from 'querystring'

const book = {
    // 新增教材
    addTeaching (params) {
        return axios.post('/book/add', qs.stringify(params))
    },
    // 修改学科
    updateTeaching (params) {
        return axios.post('/book/update', qs.stringify(params))
    },
    // 删除学科
    delTeaching (params) {
        return axios.post('/book/remove', qs.stringify(params))
    },
    //教材列表
    teachingList (params) {
      return axios.get('/book/listByQuery', {params})
    }
}

export default book
