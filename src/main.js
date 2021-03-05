import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vuex from 'vuex'
import VueSession from 'vue-session'
import axios from 'axios'
import router from './router'
import { store } from './store/index'

Vue.prototype.$http = axios
Vue.config.productionTip = false

// 캐싱 방지
axios.defaults.headers.get['Cache-Control'] = 'no-cache';
axios.defaults.headers.get['Pragma'] = 'no-cache';

var sessionOptions = {
  persist: true
}

Vue.use(Vuex, VueSession, sessionOptions, vuetify)

new Vue({
  vuetify,
  router,
  store, // store를 전역으로 등록
  render: h => h(App),
}).$mount('#app')
