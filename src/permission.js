import router from './router'
import { removeGeneralLayer, mapOutParam } from 'mapfunc'

window._axiosPromiseArr = [] // ? axios 请求队列，用于路由切换取消请求

router.beforeEach(function(to, from, next) {
  //  删除通用图层 以及执行飞事件
  if (window.map) {
    removeGeneralLayer()
    mapOutParam.flyCenter()
  }

  //  取消 axios 请求
  if (window._axiosPromiseArr.length > 0) {
    window._axiosPromiseArr.forEach(item => {
      item.cancelToken()
    })
    window._axiosPromiseArr = []
  }

  next()
})
router.afterEach()
