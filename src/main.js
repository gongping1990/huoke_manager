import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios";
import store from "./store";
import api from "@/request/api";
import iView from 'iview'
import './assets/styles/iview.css'
import './assets/style/globalStyle.css'

Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
