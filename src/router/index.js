import Vue from 'vue'
import Router from 'vue-router'
import {routers} from './router'

Vue.use(Router)

const RouterConfig = new Router({
  // mode: 'history',
  routes: routers
});

RouterConfig.beforeEach((to, from, next) => {

  if (!localStorage.isLoginSuccess && to.path != '/login') {
    next({
      path: '/login'
    })
  } else {
    next()
  }
});

export default RouterConfig
