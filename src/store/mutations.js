import mutationTypes from './mutationTypes'

export default {
  // 修改用户信息和token
  [mutationTypes.LOGIN](state, payload) {
    state.userInfo = payload.userInfo
    state.token = payload.token
  },
  // 登出mutation
  [mutationTypes.LOGOUT](state, payload) {
    state.userInfo = {}
    state.token = ''
    window.sessionStorage.removeItem('userInfo')
    window.sessionStorage.removeItem('token')
  }
}