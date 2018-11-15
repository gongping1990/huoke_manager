const mutations = {
  userStorageList (state,payload) {
    state.userStorageList = payload
  },
  changeBaseUrl (state,payload) {
    state.isChangeBaseUrl = !state.isChangeBaseUrl
  }
}

export default mutations
