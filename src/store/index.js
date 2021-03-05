import Vue from 'vue'
import Vuex from 'vuex'
 
Vue.use(Vuex)
 
/* 스낵바 설정 */
export const SET_SNACKBAR = 'SET_SNACKBAR'
export const SET_ACCOUNT = 'SET_ACCOUNT'

export const store = new Vuex.Store({
  state: { 
    sb: {
      show: false,
      msg: '',
      color: '',
    },
    account: {
      id: '',
      token: '',
      role:'',
    },
    
  },
  getters: {
    isLogin(state) {
      return state.account.token!=''
    },
    currentToken(state) {
      return state.account.token
    },
    currentUser(state) {
      return state.account.id
    }
  },
  mutations: { 
    [SET_SNACKBAR](state, sb) {
      state.sb = sb
    },
    [SET_ACCOUNT](state, account) {
      state.account = account
    },
  },
  actions: {},

  modules: {},

})