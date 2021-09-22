/**
 * article模块接口列表
 */
import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
const functionalId = 'E17'
const api = {
  map: {
    grid({ id = functionalId, dayType = 'average' }) {
      return axios.get(`${base.fan}${id}/commercialFlow/source/${dayType}`)
    },
    od({ id = functionalId, dayType = 'average', spatialScale = 'district' }) {
      return axios.get(`${base.fan}${id}/commercialFlow/OD/${dayType}/${spatialScale}`)
    },
    scope({ id = functionalId, dayType = 'average' }) {
      return axios.get(`${base.fan}${id}/commercialFlow/range/${dayType}`)
    }
  },
  chart: {
    index({ id = functionalId }) {
      return axios.get(`${base.fan}${id}/commercialFlow/index`)
    },
    bar({ id = functionalId, dayType = 'average' }) {
      return axios.get(`${base.fan}${id}/commercialFlow/distance/${dayType}`)
    },
    circle({ id = functionalId, dayType = 'average' }) {
      return axios.get(`${base.fan}${id}/commercialFlow/rangeRadius/${dayType}`)
    }
  }
}
export default api
