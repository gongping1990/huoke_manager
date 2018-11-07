import axios from '../http'
import qs from 'querystring'

const course = {
    // 获取首页banner
    listAllOn () {
        return axios.get('/course/category/listAllOn')
    },

    //课程列表
    courseList () {
      return axios.get('/course/list')
    },
    // 获取课程学习进度
    getComplete(params) {
        return axios.get('/course/getComplete',{params})
    },
    //  获取用户最后一次学习的课时id
    getLastStudy(params) {
        return axios.get('/course/getLastStudy',{params})
    },
    // 课程模块 - 查看一个课程的信息 
    getBaseCourse(params) {
        return axios.get('/course/getBaseCourse',{params})
    },
    // 更新用户课程状态
    updateStatus(params) {
        return axios.post('/course/user/updateStatus', qs.stringify(params))
    }
}

export default course
