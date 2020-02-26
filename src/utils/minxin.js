var myMinxin = {
  data() {
    return {
      tab: {
        page: 1,
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      uploadOption: {
        tipText: '只能上传jpg/png文件，且不超过500kb',
        size: 500
      },
    }
  }
}

export default myMinxin
