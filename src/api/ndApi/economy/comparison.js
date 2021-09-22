/**
 * article模块接口列表
 */
import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
const functionalId = 'E17'
const api = {
  map: {
    grid({ id = functionalId, toFunctionId = 'E19' }) {
      return axios.get(`${base.url_cl}/api/v1/domain/${id}/hinterlandCompete/${toFunctionId}/grid`)
    }
  },
  chart: {
    index({ id = functionalId, toFunctionId = 'E19' }) {
      return axios.get(`${base.url_cl}/api/v1/domain/${id}/compete/${toFunctionId}/region`)
    },
    pie({ id = functionalId, toFunctionId = 'E19' }) {
      return axios.get(`${base.url_cl}/api/v1/domain/${id}/flowPenetrationCompete/${toFunctionId}/liveToWork`)
    }
  }
}
export default api
