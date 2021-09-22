// import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
// const functionId = 'E17'

const baseurl='http://jzjrj.test.cu-bigdata.com/jzjrj/'
const api = {
    data: {
        getParcelInfomations() {
            return axios.get(`${baseurl}faOverview/getParcelInfomationGeojsons`)
        },
        getCategoryOfLand() {
            return axios.get(`${baseurl}landResource/getCategoryOfLand?count=6`)
        },
        getCategoryOfLandList() {
            return axios.get(`${baseurl}landResource/getCategoryOfLandList`)
        },
        getDevelopmentSituation() {
            return axios.get(`${baseurl}landResource/getDevelopmentSituation`)
        },
        getLandDetailInfoWithName(name="") {
            return axios.get(`${baseurl}landResource/getLandDetailInfoWithName/${name}`)
        },
        getLandAreaWithCode(params) {
            return axios.get(`${baseurl}landResource/getLandAreaWithCode`,{params})
        },
        getLandResourceLists() {
            return axios.get(`${baseurl}landResource/getLandResourceLists`)
        },
        // getLandDetailInfoWithName(name) {
        //     return axios.get(`${baseurl}landResource/getLandDetailInfoWithName/${name}`)
        // },
        getTotalAreaOfLand() {
            return axios.get(`${baseurl}landResource/getTotalAreaOfLand`)
        }
    },
    chart: {
        // index(functionId = functionalId, year = 2021) {
        //     return axios.get(`${base.gan}${functionId}/shop/status/${year}`)
        // },
        // category(functionId = functionalId, year = 2021) {
        //     return axios.get(`${base.gan}${functionId}/shop/categoryrate/${year}`)
        // }
    }
}
export default api

// GET
// /faOverview/getParcelInfomations
// 获取所有地块信息
// GET
// /landResource/getCategoryOfLand
// 土地类别统计
// GET
// /landResource/getCategoryOfLandList
// 土地类别列表
// GET
// /landResource/getDevelopmentSituation
// 土地开发情况
// GET
// /landResource/getTotalAreaOfLand
// 土地总面积
