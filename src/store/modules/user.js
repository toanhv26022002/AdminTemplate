const userModule = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      console.log(state.user,1111)
    },
  },
  getters: {
    getUser: (state) => state.user,
  },
};

export default userModule;
