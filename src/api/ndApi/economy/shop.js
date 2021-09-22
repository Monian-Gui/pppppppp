/**
 * article模块接口列表
 */
import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
const functionalId = 'E17'
const api = {
  map: {
    shopPoint({ functionId = functionalId, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/shop/loc/${year}`)
    },
    areaCount({ functionId = functionalId, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/shop/hotspot/loc/${year}`)
    },
    // type = increase/decrease
    areaRatio({ functionId = functionalId, type = 'increase' }) {
      return axios.get(`${base.gan}${functionId}/shop/${type}/loc`)
    }
  },
  chart: {
    index({ functionId = functionalId, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/shop/status/${year}`)
    },
    category({ functionId = functionalId, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/shop/categoryrate/${year}`)
    }
  }
}
export default api
