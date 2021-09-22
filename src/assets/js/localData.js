import api from '@/api/ndApi/general'

const stationMapData = {
  geoCoordMap: {}
}
// 联级选择器备份
const districtList = {}

const borderList = {
  city: null,
  district: null,
  street: null,
  jiaozi: null,
  functional: null
}

const functionalTable = {
  E19: '春熙路时尚活力区',
  J44: '天府总部商务区',
  K52: '双流航空经济区',
  D15: '成都国际商贸城功能区',
  D16: '武侯电商产业功能区',
  C14: '西部电商物流产业功能区'
}

async function getBorderByType(type) {
  if (borderList[type]) {
    return borderList[type]
  } else {
    return new Promise(resolve => {
      api.getBorder(type).then(res => {
        const data = res.data
        borderList[type] = data
        resolve(borderList[type])
      })
    })
  }
}

export { stationMapData, districtList, getBorderByType, functionalTable }
