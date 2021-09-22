// import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
// const functionalId = 'E17'

const baseurl = 'http://jzjrj.test.cu-bigdata.com/jzjrj/'
const api = {
    data: {
        getEnterpriseOverview(params) {
            return axios.get(`${baseurl}enterpriseDevelopment/getEnterpriseOverview`,{params})
        },
        getEnterpriseOverviewNew(params) {
            return axios.get(`${baseurl}enterpriseDevelopment/getEnterpriseOverviewNew`,{params})
        },
        getBusinessDistricts() {
            return axios.get(`${baseurl}enterpriseDevelopment/getGaugeAnalysis`)
        },
        getEnterpriseTagLists() {
            return axios.get(`${baseurl}enterpriseDevelopment/getEnterpriseTagLists`)
        },
        getEnterpriseFinanceWithType(type, year,params) {
            return axios.get(`${baseurl}enterpriseDevelopment/getEnterpriseFinanceWithType/${type}/${year}`,{params})
        },
        getEnterpriseProfile() {
            return axios.get(`${baseurl}enterpriseDevelopment/getHighAnalysis`)
        },
        getImportantEnterprises(type = 0) {
            return axios.get(`${baseurl}enterpriseDevelopment/getImportantEnterprises?type=${type}`)
        },
        getEnterpriseDetailInfo(name) {
            return axios.get(`${baseurl}enterprise/getEnterpriseDetailInfo?name=${name}`)
        },
        getEnterpriseDetailInfoApis(data) {
            return axios.post(`${baseurl}serviceApis/enterprise/getEnterpriseDetailInfo`, data)
        },
        getEnterpriseBaseScoreInfos(name) {
            return axios.get(`${baseurl}serviceApis/enterprise/getEnterpriseBaseScoreInfos/${name}`)
        },
        getEnterpriseInfos(name) {
            return axios.get(`${baseurl}enterprise/getEnterpriseInfos?name=${name}`)
        },
        getRevenueOverview(year,tagType) {
            return axios.get(`${baseurl}enterpriseDevelopment/getRevenueOverview?year=${year}&tagType=${tagType}`)
        },
        getRevenueRanking(year,tagType) {
            return axios.get(`${baseurl}enterpriseDevelopment/getRevenueRanking?year=${year}&tagType=${tagType}`)
        }
    }
}
export default api

// GET
// /enterpriseDevelopment/getEnterpriseOverview
// 企业总览
// GET
// /enterpriseDevelopment/getGaugeAnalysis
// 规上企业收入分析
// GET
// /enterpriseDevelopment/getHighAnalysis
// 高企数量分析
// GET
// /enterpriseDevelopment/getImportantEnterprises
// 企业地图展示列表(高企/规上)

// GET
// /enterpriseDevelopment/getRevenueOverview
// 规上企业当季度营收总览
// GET
// /enterpriseDevelopment/getRevenueRanking
// 规上企业营收排名

// GET
// /enterprise/getEnterpriseDetailInfo
// 获取企业基础信息
// GET
// /enterprise/getEnterpriseInfos
// 获取企业信息列表