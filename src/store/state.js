const store = {
  breadCrumbList: [],
  tagNavList: [],
  homeRoute: {},
  // local: localRead('local'),
  errorList: [],
  hasReadErrorPage: false,
  userStorageList:[],
  isChangeBaseUrl: false,
  nowAdminType: localStorage.nowSystem || '1',
  articeStorage: [],
  userInfo: ''
}

export default store
