import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    locations: [],
    currentLocation: {},
    updateOnRestart: false,
    dark: false
  },
  mutations: {
    addLocation(state, payload) {
      if (payload.useGPS) {
        state.locations.unshift(payload);
      } else {
        state.locations.push(payload);
      }
    },
    removeLocation(state, payload) {
      const i = state.locations.indexOf(payload);
      state.locations.splice(i, 1);
    },
    setCurrentLocation(state, payload) {
      state.currentLocation = payload;
    },
    updated(state) {
      state.updateOnRestart = true;
    },
    notUpdated(state) {
      state.updateOnRestart = false;
    },
    toggleDark(state) {
      state.dark = !state.dark;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexLocal.plugin]
})
