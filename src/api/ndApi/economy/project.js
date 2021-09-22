/**
 * article模块接口列表
 */
import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
const functionalId = 'E17'
const api = {
  map: {
    point(functionId = functionalId, year = 2021) {
      return axios.get(`${base.gan}${functionId}/project/loc/${year}`)
    },
    countByArea({ functionId = functionalId, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/project/hotspot/loc/${year}`)
    },
    ratioByArea({ functionId = functionalId, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/project/{increase/decrease}/loc/${year}`)
    }
  },
  chart: {
    index(functionId = functionalId, year = 2021) {
      return axios.get(`${base.gan}${functionId}/project/status/${year}`)
    },
    mallIndex(functionId = functionalId, year = 2021) {
      return axios.get(`${base.gan}${functionId}/project/shopcenterstatus/${year}`)
    },
    category(functionId = functionalId, year = 2021) {
      return axios.get(`${base.gan}${functionId}/project/categoryrate/${year}`)
    },
    type(functionId = functionalId, year = 2021) {
      return axios.get(`${base.gan}${functionId}/project/function/contract/type/${year}`)
    },
    brand(functionId = functionalId, year = 2021) {
      return axios.get(`${base.gan}${functionId}/project/function/contract/brand/${year}`)
    },
    add(functionId = functionalId) {
      return axios.get(`${base.gan}${functionId}/project/chart`)
    },
    contractType({ functionId = functionalId, projectid, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/project/${year}/${projectid}/contract/type`)
    },
    contractBrand({ functionId = functionalId, projectid, year = 2021 }) {
      return axios.get(`${base.gan}${functionId}/project/${year}/${projectid}/contract/brand`)
    }
  }
}
export default api
