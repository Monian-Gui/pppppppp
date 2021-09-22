import base from '../base' // 导入接口域名列表
import axios from '@/utils/request' // 导入request中创建的axios实例
const functionId = 'E17'

const baseurl='http://jzjrj.test.cu-bigdata.com/jzjrj/'
const api = {
    data: {
        getAttractInvestment() {
            return axios.get(`${baseurl}faOverview/getAttractInvestment`)
        },
        getBusinessDistricts() {
            return axios.get(`${baseurl}faOverview/getAttractInvestment`)
        },
        getEnterpriseProfile() {
            return axios.get(`${baseurl}faOverview/getEnterpriseProfile`)
        },
        getFacilitiesOverview() {
            return axios.get(`${baseurl}faOverview/getFacilitiesOverview`)
        },
        getGeography() {
            return axios.get(`${baseurl}faOverview/getGeography`)
        },
        getIndustrialStructure() {
            return axios.get(`${baseurl}faOverview/getIndustrialStructure`)
        },
        getParcelInfomations() {
            return axios.get(`${baseurl}faOverview/getParcelInfomations`)
        },
        getPassengerVolume() {
            return axios.get(`${baseurl}faOverview/getPassengerVolume`)
        },
        getPopulation() {
            return axios.get(`${baseurl}faOverview/getPopulation`)
        },
        getPublicServiceSupporting() {
            return axios.get(`${baseurl}faOverview/getPublicServiceSupporting`)
        },
        getTaxRevenue() {
            return axios.get(`${baseurl}faOverview/getTaxRevenue`)
        },
        getTypicalCarrier() {
            return axios.get(`${baseurl}faOverview/getTypicalCarrier`)
        },
        // 工作日客流、周末客流
        getCommercialFlow() {
            return axios.get(`${base.gan}${functionId}/commercialFlow/index`)
        },
        // 居住、就业人口
        getWorkToResidence() {
            return axios.get(`${base.gan}${functionId}/population/workToResidence/num`)
        },
        // 店铺结构
        getShopCategoryrate(year = 2021) {
            return axios.get(`${base.gan}${functionId}/shop/categoryrate/${year}`)
        },
        // 商业项目签约业态
        getContract(year = 2021) {
            return axios.get(`${base.gan}${functionId}/project/function/contract/type/${year}`)
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
// /faOverview/getAttractInvestment
// 招商引资
// GET
// /faOverview/getBusinessDistricts
// 商业发展(----方舆按照这个输出提供服务接口----)
// GET
// /faOverview/getEnterpriseProfile
// 企业概况
// GET
// /faOverview/getFacilitiesOverview
// 设施总览
// GET
// /faOverview/getGeography
// 地理概况
// GET
// /faOverview/getIndustrialStructure
// 产业结构
// GET
// /faOverview/getParcelInfomations
// 获取所有地块信息
// GET
// /faOverview/getPassengerVolume
// 客流活力(----方舆按照这个输出提供服务接口----)
// GET
// /faOverview/getPopulation
// 职住人口(----方舆按照这个输出提供服务接口----)
// GET
// /faOverview/getPublicServiceSupporting
// 公服配套优势
// GET
// /faOverview/getTaxRevenue
// 税收
// GET
// /faOverview/getTypicalCarrier
// 典型载体