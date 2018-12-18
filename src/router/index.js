import Vue from 'vue'
import Router from 'vue-router'
import {routers} from './router'
import {Message} from 'iview'

Vue.use(Router)

const RouterConfig = new Router({
  // mode: 'history',
  routes: routers
});

RouterConfig.beforeEach((to, from, next) => {

  if (!localStorage.isLoginSuccess && to.path != '/login') {
    Message.info('登录失效，请重新登录')
    next({
      path: '/login'
    })
  } else {
    next()
  }
});

export default RouterConfig
