import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios";
import store from "./store";
import api from "@/request/api";
import iView from 'iview'
import './assets/styles/iview.css'
import './assets/style/globalStyle.css'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import pluginDom from '@/utils/plugin'

Vue.use(preview)
Vue.use(iView)
Vue.use(pluginDom)
Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;


Vue.directive('viewmore', {
  bind: (el, binding) => {
    el.addEventListener('scroll', () => {
      if (el.scrollTop + el.offsetHeight >= el.scrollHeight) {
        binding.value();
      }
    }, false)
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
