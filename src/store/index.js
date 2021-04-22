import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
  token: window.sessionStorage.getItem('token')
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
  }
})
