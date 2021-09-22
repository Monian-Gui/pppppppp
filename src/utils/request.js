// 在http.js中引入axios
import axios from 'axios' // 引入axios
import { Message, Loading } from 'element-ui'
// import store from '@/store/index'
import _ from 'lodash'

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 100 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let loading = null
let needLoadingRequestCount = 0

const showTextTabel = {
  undefined: '分析加载中...',
  nextLevel: '请求行政区划中',
  cityBorder: '请求城市图层中',
  districtBorder: '请求行政区图层中',
  streetBorder: '请求街道图层中'
}

//显示loading
function showLoading(target, text) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: showTextTabel[text],
      background: 'rgba(0, 0, 0, 0.5)',
      target: target || 'body'
    })
  }
  needLoadingRequestCount++
}

//隐藏loading
function hideLoading() {
  needLoadingRequestCount--
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) //做个保护
  if (needLoadingRequestCount === 0) {
    //关闭loading
    toHideLoading()
  }
}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(() => {
  loading && loading.close ? loading.close() : null
  loading = null
}, 300)
/**
 * 提示函数
 * 显示一秒后关闭
 */
const tip = msg => {
  Message({
    message: msg,
    duration: 4000,
    type: 'error'
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */

const httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时'
}

const errorHandle = (status, other) => {
  if (httpCode[status]) {
    tip(httpCode[status])
  } else {
    tip(status)
  }
  console.log(other)
}

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = store.state.token
    // token && (config.headers.Authorization = token)

    // 判断当前请求是否设置了不显示Loading
    if (config.headers.showLoading !== false) {
      showLoading(config.headers.loadingTarget, config.headers.loadingText)
    }

    //  保存请求信息，在切换路由时删除请求
    config.cancelToken = new axios.CancelToken(cancel => {
      window._axiosPromiseArr.push({
        cancelToken: cancel
      })
    })
    return config
  },
  error => {
    //判断当前请求是否设置了不显示Loading
    if (error.headers.showLoading !== false) {
      hideLoading()
    }
    Message.error('系统响应时长过慢，请稍后重试！')
    // 若不是超时,则返回未错误信息
    return Promise.error(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (res.config.headers.showLoading !== false) {
      hideLoading()
    }
    return res
  },
  error => {
    console.error(error)

    const { response } = error
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (error.config.headers.showLoading !== false) {
      hideLoading()
    }
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)

      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        // store.commit('changeNetwork', false)
      } else {
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1 && needLoadingRequestCount == 0) {
          // 如果请求超时
          // tip('请求超时！！')
          tip('系统响应时长过慢，请稍后重试！')
        }

        return Promise.reject(error)
      }
    }
  }
)

export default instance
