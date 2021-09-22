// import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
// const functionalId = 'E17'

const baseurl='http://jzjrj.test.cu-bigdata.com/jzjrj/'
const api = {
    data: {
        getBusinessDistrictAnalysis() {
            return axios.get(`${baseurl}economicalOperation/getBusinessDistrictAnalysis`)
        },
        getIndustrialCarriersOverView() {
            return axios.get(`${baseurl}economicalOperation/getIndustrialCarriersOverView`)
        },
        getIndustryAnalysis() {
            return axios.get(`${baseurl}economicalOperation/getIndustryAnalysis`)
        },
        getTDAnalysis(analysisType) {
            return axios.get(`${baseurl}economicalOperation/getTDAnalysis/${analysisType}`)
        },
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
// /economicalOperation/getBusinessDistrictAnalysis
// 商圈分布
// GET
// /economicalOperation/getIndustrialCarriersOverView
// 产业载体总览
// GET
// /economicalOperation/getIndustryAnalysis
// 产业指标
// GET
// /economicalOperation/getTDAnalysis/{analysisType}
// 楼宇分布-热力图分析 1->就业，2->税收，3->产业集中度