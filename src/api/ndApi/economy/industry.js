// import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
// const functionalId = 'E17'

const baseurl='http://jzjrj.test.cu-bigdata.com/jzjrj/'
const api = {
    data: {
        getBarELIJRAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getBarELIJRAnalysis`)
        },
        getBarELISMAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getBarELISMAnalysis`)
        },
        getEconomicOfLIJRAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getEconomicOfLIJRAnalysis`)
        },
        getEconomicOfLISMAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getEconomicOfLISMAnalysis`)
        },
        getIndustrialTaxAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getIndustrialTaxAnalysis`)
        },
        getJobs() {
            return axios.get(`${baseurl}industrialDevelopment/getJobs`)
        },
        getLeadingIndustriesAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getLeadingIndustriesAnalysis`)
        },
        getTalentAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getTalentAnalysis`)
        },
        getTalentDemandAnalysis() {
            return axios.get(`${baseurl}industrialDevelopment/getTalentDemandAnalysis`)
        },
        getCompareIndustrialEconomic() {
            return axios.get(`${baseurl}industrialDevelopment/getCompareIndustrialEconomic`)
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
// /industrialDevelopment/getBarELIJRAnalysis
// 金融产业经济分析
// GET
// /industrialDevelopment/getBarELISMAnalysis
// 商贸产业经济分析
// GET
// /industrialDevelopment/getEconomicOfLIJRAnalysis
// 主导产业经济分析-金融产业
// GET
// /industrialDevelopment/getEconomicOfLISMAnalysis
// 主导产业经济分析-商贸服务产业
// GET
// /industrialDevelopment/getIndustrialTaxAnalysis
// 产业税收贡献度分析
// GET
// /industrialDevelopment/getLeadingIndustriesAnalysis
// 主导产业集中度分析
// GET
// /industrialDevelopment/getCompareIndustrialEconomic
// 产业经济对标

// GET
// /industrialDevelopment/getJobs
// 获取更多热门岗位
// GET
// /industrialDevelopment/getTalentAnalysis
// 人才分析
// GET
// /industrialDevelopment/getTalentDemandAnalysis
// 人才需求学历分析