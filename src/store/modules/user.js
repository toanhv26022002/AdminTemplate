const userModule = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
  },
  getters: {
    getUser: state => state.user,
  },
}

export default userModule
