import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locations: [],
  },
  mutations: {
    addLocation(state, payload) {
      state.locations.push(payload);
    }
  },
  actions: {
  },
  modules: {
  }
})
