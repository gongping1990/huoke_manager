import axios from '../../http'
import qs from 'qs'

const mission = {
  // 生字词
  // 新增
  addWord(params) {
    return axios.post('/prep/mission/word/add', qs.stringify(params))
  },
  // 修改
  updateWord(params) {
    return axios.post('/prep/mission/word/updateLearn', qs.stringify(params))
  },
  // 删除
  delWord(params) {
    return axios.post('/prep/mission/word/remove', qs.stringify(params))
  },
  //列表
  wordList(params) {
    return axios.get('/prep/mission/word/list', {params})
  },
  //顺序
  wordPageNo(params) {
    return axios.post('/prep/mission/word/updatePageNo', params)
  },
  //修改练习
  updateWordQuestion(params) {
    return axios.post('/prep/mission/word/updateQuestion', qs.stringify(params))
  },

  //听读课文

  // 新增
  addRead(params) {
    return axios.post('/prep/mission/read/addLearn', qs.stringify(params))
  },
  // 修改
  updateRead(params) {
    return axios.post('/prep/mission/read/updateLearn', qs.stringify(params))
  },
  // 删除
  delRead(params) {
    return axios.post('/prep/mission/read/remove', qs.stringify(params))
  },
  //列表
  readList(params) {
    return axios.get('/prep/mission/read/list', {params})
  },
  //顺序
  readPageNo(params) {
    return axios.post('/prep/mission/read/updatePageNo', params)
  },

  //课文精读

  // 新增
  addLecture(params) {
    return axios.post('/prep/mission/lecture/add', qs.stringify(params))
  },
  // 修改
  updateLecture(params) {
    return axios.post('/prep/mission/lecture/update', qs.stringify(params))
  },
  // 删除
  delLecture(params) {
    return axios.post('/prep/mission/lecture/remove', qs.stringify(params))
  },
  //列表
  lectureList(params) {
    return axios.get('/prep/mission/lecture/list', {params})
  },
  //顺序
  lecturePageNo(params) {
    return axios.post('/prep/mission/lecture/updatePageNo', params)
  }




}

export default mission
