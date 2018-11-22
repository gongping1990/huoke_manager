import axios from 'axios'
import router from '../router'
import store from '@/store/index'
import {Message} from 'iview'
import {getBaseUrl, oldBaseUrl} from '@/libs/index'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
  Message.warning(msg)
}

/**
 * 显示登录页
 * 清楚用户本地缓存信息，并显示登录弹框
 */
const toLogin = () => {
  // store.commit('CLEAR_USER_INFO')
  // if (router.history.current.name != 'user' && !isWeiXin()) {
  //   store.commit('CHANGE_LOGIN_STATUS')
  // }
  router.push('/login')
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, err) => {
  // 状态码判断
  switch (status) {
    case 200:
      break;
    // 401: 未登录状态，跳转登录页
    case 401:
    case 402:
    case 403:
      toLogin();
      break;
    // 404请求不存在
    case 404:
      tip('请求的资源不存在');
      break;
    case 500:
      tip('网络连接异常')
    default:
      tip(err)
    // console.log(other);
  }
}


// 创建axios实例

var instance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 10000
});

// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    let otherUrl = ['/goods/listPage', '/boss/coupon', '/user/queryUser']
    let isPass = otherUrl.some(item => {
      return config.url.indexOf(item) != -1
    })
    if (isPass) {
      config.baseURL = oldBaseUrl()
    }
    return config;
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    // store.commit('SET_LOADING', false)
    // 服务器请求成功，自定义code异常处理
    errorHandle(res.data.code, res.data.msg)
    return res.data.code === 200 ? Promise.resolve(res) : Promise.reject(res.data.msg)
  },
  // 请求失败
  error => {
    // store.commit('SET_LOADING', false)
    const {response} = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', true);
    }
  });

export default instance

