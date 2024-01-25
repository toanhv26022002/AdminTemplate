import { createStore } from 'vuex'
import dataCollection from './modules/dataCollection'
import map from './modules/map'
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
    map,
    dataCollection
  },
})

export default store
