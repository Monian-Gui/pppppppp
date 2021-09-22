/**
 * 接口域名的管理
 */
const base = {
  // gan: 'http://179.168.2.126:5002/api/v1/',
  // fan: 'http://179.168.2.9:5002/api/v1/',
  // url_cl: 'http://179.168.2.131:5002',
  gan: 'http://81.68.104.27:5002/api/v1/',
  fan: 'http://81.68.104.27:5002/api/v1/',
  url_cl: 'http://81.68.104.27:5002',

  liantong: 'http://jzjrj.test.cu-bigdata.com/jzjrj',

  border: 'static/data/border/',
  layer: {
    road: 'http://122.51.239.110:7091/maps/tianjing_road/{z}/{x}/{y}.vector.pbf',
    building: 'http://122.51.239.110:7090/maps/tianjing_building_geom/{z}/{x}/{y}.vector.pbf'
  },
  map: {
    esri: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
  }
}
export default base
