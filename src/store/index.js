import { createStore } from 'vuex'
import userModule from './modules/user'

const store = createStore({
  state () {
    return {
      count: 2,
    }
  },
  mutations: {
    increment (state) {
      state.count
    },
  },
  modules: {
    user: userModule,
  },
})

export default store
