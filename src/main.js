import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios";
import store from "./store";
import api from "@/request/api";
import { uploadFile } from "@/libs/upload";
import iView from 'iview'
import 'iview/dist/styles/iview.css'


Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$cos = uploadFile;




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
