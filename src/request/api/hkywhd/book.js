import axios from '../../http'
import qs from 'qs'

const book = {
  // 新增教材
  addTeaching(params) {
    return axios.post('/fissionprep/book/add', qs.stringify(params))
  },
  // 修改学科
  updateTeaching(params) {
    return axios.post('/fissionprep/book/update', qs.stringify(params))
  },
  // 删除学科
  delTeaching(params) {
    return axios.post('/fissionprep/book/remove', qs.stringify(params))
  },
  //教材列表
  teachingList(params) {
    return axios.get('/fissionprep/book/listByQuery', {params})
  },
  //教材单元下全部课时
  chapterLessonList(params) {
    return axios.get('/book/listByChapterId', {params})
  },
  //教材下全部单元
  bookChapterList(params) {
    return axios.get('/book/chapter/listByBookId', {params})
  },
  //章节树列表
  treeList(params) {
    return axios.get('/fissionprep/book/listTreeNodeVO', {params})
  },
  //章节树单元节点新增
  addChapter(params) {
    return axios.post('/fissionprep/book/chapter/add', qs.stringify(params))
  },
  //章节树单元节点修改
  updateChapter(params) {
    return axios.post('/fissionprep/book/chapter/update', qs.stringify(params))
  },
  //章节树单元节点删除
  delChapter(params) {
    return axios.post('/fissionprep/book/chapter/remove', qs.stringify(params))
  },
  //章节树单元节点新增课时
  addLesson(params) {
    return axios.post('/fissionprep/book/lesson/add', qs.stringify(params))
  },
  //章节树单元课时节点修改
  updateLesson(params) {
    return axios.post('/fissionprep/book/lesson/update', qs.stringify(params))
  },
  //章节树单元课时节点删除
  delLesson(params) {
    return axios.post('/fissionprep/book/lesson/remove', qs.stringify(params))
  },
  //获取学习目标
  getLessonTarget(params) {
    return axios.get('/fissionprep/book/lesson/get', {params})
  },
  //修改学习目标
  updateTarget(params) {
    return axios.post('/fissionprep/book/lesson/updateTarget', qs.stringify(params))
  },
  //更新封面
  updateCover(params) {
    return axios.post('/fissionprep/book/lesson/cover', qs.stringify(params))
  },
  //禁用、启用
  changeStatus(params) {
    return axios.post('/fissionprep/book/lesson/enabled', qs.stringify(params))
  },
  //音频
  readaudio(params) {
    return axios.post('/fissionprep/book/lesson/readaudio', qs.stringify(params))
  },//音频
  listen(params) {
    return axios.get('/fissionprep/book/lesson/listen',  {params})
  },//音频
  listAll(params) {
    return axios.get('/fissionprep/book/listAll', {params})
  },//音频
  getAllBookData(params) {
    return axios.get('/fissionprep/book/getAllBookData', {params})
  },//音频
  getBookDataDetails(params) {
    return axios.get('/fissionprep/book/getBookDataDetails', {params})
  },

}

export default book
