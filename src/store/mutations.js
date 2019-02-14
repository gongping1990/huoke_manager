const mutations = {
  userStorageList (state,payload) {
    state.userStorageList = payload
  },
  changeBaseUrl (state,payload) {
    state.isChangeBaseUrl = !state.isChangeBaseUrl
  },
  changeSystem (state,payload) {
    state.nowAdminType = payload
  }
}

export default mutations
