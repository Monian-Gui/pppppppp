/**
 * article模块接口列表
 */
import base from './base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例

const api = {
  getBorder(type) {
    return axios.get(`${base.border}${type}_border.json`)
  }
}
export default api
