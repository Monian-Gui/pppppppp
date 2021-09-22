import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  functionId: 'E17',
  companyName:"",
  map: {
    center: [104.074848, 30.574479],
    zoom: 13.8
  }
}

const mutations = {
  setName(state, name) {
    state.companyName = name
  }
}

export default new Vuex.Store({
  state, mutations
})
