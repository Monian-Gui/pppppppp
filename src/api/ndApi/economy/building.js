// import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
// const functionalId = 'E17'
const baseurl='http://jzjrj.test.cu-bigdata.com/jzjrj/'

const api = {
    data: {
        getBuildingInfos() {
            return axios.get(`${baseurl}buildingEconomy/getBuildingInfos?size=100`)
        },
        getBuildingBaseInfo(name) {
            return axios.get(`${baseurl}buildingEconomy/getBuildingBaseInfo/${name}`)
        },
        getBuildingPortrait(name) {
            return axios.get(`${baseurl}buildingEconomy/getBuildingPortrait/${name}`)
        },
        getBuildingRankingInfos(name) {
            return axios.get(`${baseurl}buildingEconomy/getBuildingRankingInfos/${name}`)
        },
        getEnterpriseInfluence(name) {
            return axios.get(`${baseurl}buildingEconomy/getEnterpriseInfluence/${name}`)
        },
        getIndustrySituation(name) {
            return axios.get(`${baseurl}buildingEconomy/getIndustrySituation/${name}`)
        },
        getIndustryStructrue(name) {
            return axios.get(`${baseurl}buildingEconomy/getIndustryStructrue/${name}`)
        },
        getOperation(name) {
            return axios.get(`${baseurl}buildingEconomy/getOperation/${name}`)
        },
        getSupportingConditions(name) {
            return axios.get(`${baseurl}buildingEconomy/getSupportingConditions/${name}`)
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
// /buildingEconomy/getBuildingBaseInfo/{name}
// 基础情况
// GET
// /buildingEconomy/getBuildingInfos
// 获取楼宇列表-用于切换楼宇
// GET
// /buildingEconomy/getBuildingPortrait/{name}
// 楼宇画像
// GET
// /buildingEconomy/getBuildingRankingInfos/{name}
// 区内楼宇经济指标排名
// GET
// /buildingEconomy/getEnterpriseInfluence/{name}
// 企业影响
// GET
// /buildingEconomy/getIndustrySituation/{name}
// 产业情况
// GET
// /buildingEconomy/getIndustryStructrue/{name}
// 产业结构
// GET
// /buildingEconomy/getOperation/{name}
// 经营情况
// GET
// /buildingEconomy/getSupportingConditions/{name}
// 配套情况