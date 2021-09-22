/* eslint-disable */
import store from '@/store'
import { getBorderByType } from 'localData'
import config from '@/assets/config/mapbox.json'
const mapOutParam = {
  center: [store.state.map.center, [104.2, 30.6]], // ?地图默认位置
  zoom: [store.state.map.zoom, 9.5], // ?地图zoom
  // mapbox弹框
  popup: {
    popup_div: undefined,
    popip_timeout: undefined,
    grid_click_popup: undefined
  },
  textfont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
  generalId: [
    // 点图层
    'circle_layer_ripple',
    'circle_layer_symbol',
    'circle_layer',
    // 线图层
    'line_layer',
    // 面图层
    'fill_layer_symbol',
    'fill_layer_border',
    'fill_layer',
    // 3D格网图层
    'grid_layer',
    'highlight_grid_layer',
    // 聚类点图层
    'cluster_point',
    'cluster_count',
    'cluster_label',
    'cluster',
    // 热力图
    'heatmap_layer',
    // 默认单击图层
    'click_layer_border',
    'click_layer_symbol',
    'click_layer'
  ] // ? 通用图层 id 组
}

// ================================== 地图加载函数 START =======================================
//  初始化地图
const initMap = async ({ mapID }) => {
  const mapContainer = document.getElementById(mapID)
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hhdW5jeTk1MjciLCJhIjoiY2s5NHl3ZnhzMGlmcTNqbnRmOHg0eHRrcCJ9.10z8GnL2GYwa7Na-tCl7LQ'
  window[mapID] = new mapboxgl.Map({
    container: mapContainer,
    style: {
      //设置版本号，一定要设置
      version: 8,
      //添加来源
      sources: {},
      layers: [],
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
    },
    center: mapID == 'leftMap' ? mapOutParam.center[0] : mapOutParam.center[1],
    zoom: mapID == 'leftMap' ? mapOutParam.zoom[0] : mapOutParam.zoom[1], //越大越近
    pitch: 30, //角度
    bearing: 0, //初始方向，值是北的逆时针度数，默认是0，即是正北
    antialias: false //抗锯齿，通过false关闭提升性能
  })
  window[mapID].scrollZoom.setWheelZoomRate(2 / 450) // 设置滚动尺度 默认 1/450
  window[mapID].addControl(
    new MapboxLanguage({
      defaultLanguage: 'zh'
    })
  )

  return new Promise(resolve => {
    window[mapID].on('load', function() {
      config.basemaps.forEach((item, index) => {
        window[mapID].addSource(item.id, {
          type: 'raster',
          tiles: [item.url],
          tileSize: 256,
          style: item.style
        })
        window[mapID].addLayer({
          id: item.id,
          type: 'raster',
          source: item.id
        })

        if (index != 0) {
          window[mapID].setLayoutProperty(item.id, 'visibility', 'none')
        }
      })
      // window[mapID].getLayer('esriBlueMap').paint._properties.defaultPossiblyEvaluatedValues['raster-hue-rotate'] = 0
      // // window[mapID].getLayer('esriBlueMap').paint._properties.defaultPossiblyEvaluatedValues['raster-contrast'] = 0.1
      // window[mapID].getLayer('esriBlueMap').paint._properties.defaultPossiblyEvaluatedValues['raster-saturation'] = -1

      setTimeout(function() {
        if (mapID == 'leftMap') {
          addBaseBorder(mapID, mapOutParam.borderList)
        } else {
          getBorderByType('functional').then(border => {
            const filterList = [
              '春熙路时尚活力区',
              '天府总部商务区',
              '双流航空经济区',
              '成都国际商贸城功能区',
              '武侯电商产业功能区',
              '西部电商物流产业功能区'
            ]
            addFillLayer({
              mapID,
              data: border,
              id: 'functional_border',
              color: '#2681b6',
              boder: { opacity: 0.8, width: 1, color: '#ffffff' },
              filter: ['in', 'name', ...filterList]
            })
          })
          getBorderByType('district').then(border => {
            window[mapID].addSource('district_border', {
              type: 'geojson',
              data: border
            })
            // 主边界
            window[mapID].addLayer({
              id: 'district_border',
              type: 'line',
              source: 'district_border',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-opacity': 0.8,
                'line-width': 1.2,
                'line-color': '#007CFF'
              }
            })
          })
        }

        window[mapID].on('mouseenter', 'grid_layer', function() {
          window[mapID].getCanvas().style.cursor = 'pointer'
        })
        window[mapID].on('mouseleave', 'grid_layer', function() {
          window[mapID].getCanvas().style.cursor = ''
        })

        window[mapID].on('mouseenter', 'functional_border', function() {
          window[mapID].getCanvas().style.cursor = 'pointer'
        })
        window[mapID].on('mouseleave', 'functional_border', function() {
          window[mapID].getCanvas().style.cursor = ''
        })

        window[mapID].on('mouseenter', 'circle_layer', function() {
          window[mapID].getCanvas().style.cursor = 'pointer'
        })
        window[mapID].on('mouseleave', 'circle_layer_symbol', function() {
          window[mapID].getCanvas().style.cursor = ''
        })

        window[mapID].on('mousedown', () => {
          removeLayerById(mapID, 'highlight_grid_layer')
        })

        resolve(true)
      }, 0)
    })
  })
}

// 添加底图边界
const addBaseBorder = (
  mapID,
  opacity = [0.8, 0.8], // ?边界透明度
  width = [7, 1.2], // ?边界宽度
  color = ['#007CFF', '#007CFF'] // ? 边界颜色
) => {
  // 主边界
  getBorderByType('jiaozi').then(border => {
    window[mapID].addSource('jiaozi_border', {
      type: 'geojson',
      data: border
    })
    // 主边界
    window[mapID].addLayer({
      id: 'jiaozi_border',
      type: 'line',
      source: 'jiaozi_border',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-opacity': opacity[0],
        'line-width': width[0],
        'line-color': color[0]
      }
    })
    window[mapID].addLayer({
      id: 'jiaozi_border2',
      type: 'line',
      source: 'jiaozi_border',
      minzoom: 5,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-opacity': 1,
        'line-width': 1,
        'line-color': '#fff'
      }
    })
  })
  getBorderByType('district').then(border => {
    window[mapID].addSource('district_border', {
      type: 'geojson',
      data: border
    })
    // 主边界
    window[mapID].addLayer(
      {
        id: 'district_border',
        type: 'line',
        source: 'district_border',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-opacity': opacity[1],
          'line-width': width[1],
          'line-color': color[1]
        }
      },
      'jiaozi_border'
    )
  })
}
// ================================== 地图加载函数 END =======================================

// ================================== 绘制函数 START =======================================

// 添加点图层
const addCircleLayer = ({
  mapID,
  data,
  color = '#fff',
  color_type = 'interval',
  value = 3,
  value_type = 'interval',
  opacity = 0.8,
  zoom = [8, 24],
  symbol = {
    size: 12,
    color: 'rgba(255,255,255,0.8)',
    zoom: [8, 24]
  },
  filter = ['!=', 'value', ''],
  id = 'circle_layer',
  rippleShow = false,
  ripple = { size: 50, color: '255,200,200' },
  value_of_zoom = null
}) => {
  removeLayerById(mapID, [id + '_ripple', id + '_symbol', id])
  let circle_color, circle_radius
  // ? 判断是否使用颜色组，不使用则使用单色
  if (color instanceof Array) {
    circle_color = {
      property: 'color',
      type: color_type,
      stops: color
    }
  } else {
    circle_color = color
  }
  // ? 判断是否使用大小组，不使用则使用相同大小
  if (value_of_zoom) {
    circle_radius = ['interpolate', ['linear'], ['zoom'], ...value_of_zoom]
  } else {
    if (value instanceof Array) {
      circle_radius = {
        property: 'value',
        type: value_type,
        stops: value
      }
    } else {
      circle_radius = value
    }
  }
  // 定义数据源
  window[mapID].addSource(id, {
    type: 'geojson',
    data: data
  })

  if (rippleShow) {
    window[mapID].hasImage(id + 'ripple_image') ? window[mapID].removeImage(id + 'ripple_image') : ''
    const size = ripple.size
    var rippleImage = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function() {
        var canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
      },

      render: function() {
        var duration = 1000
        var t = (performance.now() % duration) / duration

        var radius = (size / 2) * 0.3
        var outerRadius = (size / 2) * 0.7 * t + radius
        var context = this.context

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${ripple.color},${1 - t})`
        context.fill()

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data

        // keep the map repainting
        window[mapID].triggerRepaint()

        // return `true` to let the map know that the image was updated
        return true
      }
    }

    window[mapID].addImage(id + 'ripple_image', rippleImage, { pixelRatio: 2 })

    window[mapID].addLayer({
      id: id + '_ripple',
      type: 'symbol',
      source: id,
      minzoom: zoom[0],
      maxzoom: zoom[1],
      layout: {
        'icon-image': id + 'ripple_image',
        'icon-allow-overlap': true
      },
      filter
    })
  }

  // 添加点图层
  window[mapID].addLayer({
    id,
    type: 'circle',
    source: id,
    minzoom: zoom[0],
    maxzoom: zoom[1],
    paint: {
      'circle-opacity': opacity,
      'circle-color': circle_color,
      'circle-radius': circle_radius
    },
    filter
  })
  // 根据是否有name 添加名字图层
  if (data.features[0].properties.name) {
    window[mapID].addLayer({
      id: id + '_symbol',
      type: 'symbol',
      source: id,
      minzoom: symbol.zoom[0],
      maxzoom: symbol.zoom[1],
      layout: {
        'text-field': '{name}',
        'text-font': mapOutParam.textfont,
        'text-size': symbol.size,
        'text-allow-overlap': false,
        'text-offset': [0, 1.2]
      },
      paint: {
        'text-color': symbol.color
      },
      filter
    })
  }
}

// 添加面图层
const addFillLayer = ({
  mapID,
  data,
  color = '#007CFF',
  color_type = 'interval',
  opacity = 0.6,
  boder = { opacity: 0.4, width: 0.6, color: 'rgb(156, 57, 0)' },
  symbolShow = true,
  symbol = { size: 12, color: 'rgb(255,255,255)' },
  filter = ['!=', 'value', ''],
  id = 'fill_layer'
}) => {
  removeLayerById(mapID, [id + '_border', id + '_symbol', id])
  let fill_color
  // ? 判断是否使用颜色组，不使用则使用单色
  if (color instanceof Array) {
    fill_color = {
      property: 'color',
      type: color_type,
      stops: color
    }
  } else {
    fill_color = color
  }
  // 定义数据源
  window[mapID].addSource(id, {
    type: 'geojson',
    data
  })
  // 添加面图层
  window[mapID].addLayer({
    id: id,
    type: 'fill',
    source: id,
    paint: {
      'fill-color': fill_color,
      'fill-opacity': opacity
    },
    filter
  })
  // 添加面边框
  window[mapID].addLayer({
    id: id + '_border',
    type: 'line',
    source: id,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-opacity': boder.opacity,
      'line-width': boder.width,
      'line-color': boder.color
    },
    filter
  })
  if (symbolShow) {
    // console.log('进入分层设色name绘制');
    window[mapID].addLayer({
      id: id + '_symbol',
      type: 'symbol',
      source: id,
      layout: {
        'text-field':
          data.features[0].properties.name && data.features[0].properties.value
            ? '{name}：{value}'
            : data.features[0].properties.value
            ? '{value}'
            : '{name}',
        'text-font': mapOutParam.textfont,
        'text-size': symbol.size,
        'text-allow-overlap': false,
        'text-offset': [0, 1.2]
      },
      paint: {
        'text-color': symbol.color
      },
      filter
    })
  }
}

// 添加3D格网
const add3DGrid = ({
  mapID,
  data,
  color = '#fff',
  color_type = 'interval',
  opacity = 0.8,
  filter = ['>=', 'value', -1],
  id = 'grid_layer',
  click = true
}) => {
  removeLayerById(mapID, id)
  let fill_color
  // ? 判断是否使用颜色组，不使用则使用单色
  if (color instanceof Array) {
    fill_color = {
      property: 'color',
      type: color_type,
      stops: color
    }
  } else {
    fill_color = color
  }
  const array = data.features.sort((a, b) => {
    return a.properties.value - b.properties.value
  })
  const max = array[array.length - 1].properties.value
  // if (max > 20000) {
  //   data.features.map(item => {
  //     item.properties.value = item.properties.value * (20000 / max)
  //   })
  // }
  window[mapID].addSource(id, {
    type: 'geojson',
    data: data
  })
  window[mapID].addLayer({
    id: id,
    type: 'fill-extrusion',
    source: id,
    paint: {
      'fill-extrusion-color': fill_color,
      'fill-extrusion-opacity': opacity,
      'fill-extrusion-height': ['get', 'value']
    },
    filter
  })
  // 添加点击事件
  if (click) {
    window[mapID].off('click', 'grid_layer', clickGridHandle)
    if (mapOutParam.popup.grid_click_popup) {
      //清除弹窗
      mapOutParam.popup.grid_click_popup.remove()
    }
    setTimeout(() => {
      window[mapID].on('click', 'grid_layer', clickGridHandle)
    }, 0)
  }
}

// 格网图层点击事件 -- 在添加3D格网add3DGrid属性click为true 时调用
const clickGridHandle = e => {
  const center = turf.center(e.features[0]).geometry.coordinates
  let layer = {
    type: 'FeatureCollection',
    features: [e.features[0]]
  }
  add3DGrid({ data: layer, color: '#2ff3fb', opacity: 1, id: 'highlight_grid_layer', click: false })

  let { color } = e.features[0].properties
  let showInfo = `<div class="makerTop"><h4 class="markerHear" style="text-align: center"> 格网人口信息 </h4></div>
                            <div class="markerBody" style="font-size:13px">
                            <p>格网人数：${color} 人</p>
                            </div>`
  if (mapOutParam.popup.grid_click_popup) {
    mapOutParam.popup.grid_click_popup.remove()
  }
  mapOutParam.popup.grid_click_popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    className: 'leftpopup',
    offset: [0, -10],
    maxWidth: '150px'
  })
    .setLngLat(center)
    .setHTML(showInfo)
    .addTo(map)
}

// 添加热力格网
const addHeatLayer = ({
  mapID,
  data,
  stops = [
    [1, null],
    [2, null],
    [4, null],
    [8, null],
    [16, null],
    [32, null],
    [64, null]
  ],
  id = 'heatmap_layer',
  weight,
  intensity = [7, 1, 8, 3, 10, 8, 13, 20],
  radius = [7, 10, 10, 15, 15, 30],
  opacity = [12, 1, 13, 1, 14, 1],
  multiple = 9
}) => {
  removeLayerById(mapID, id)
  if (!weight) {
    const weightList = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1]
    weight = []
    stops.forEach((item, index) => {
      weight.push(item[0] * multiple)
      weight.push(weightList[index])
    })
  }

  window[mapID].addSource('heatmap_layer', { type: 'geojson', data })
  window[mapID].addLayer({
    id: 'heatmap_layer',
    type: 'heatmap',
    source: 'heatmap_layer',
    paint: {
      // 根据频率和属性大小增加热图的权重
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'value'], ...weight],
      // 增加热图的颜色权重
      // 热图强度是热图重量的倍增器 0以上数字 默认为1 表示当前增强系数 用于维持一个好的效果在某层级
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], ...intensity],
      // 根据缩放等级调整热图半径 1-30
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], ...radius],
      // 通过缩放级别从热图过渡到圆形图层 0-1
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], ...opacity]
    }
  })
}

// 根据 id/id数组 删除图层
const removeLayerById = (mapID, ID) => {
  if (typeof ID === 'string') {
    if (window[mapID].getLayer(ID)) {
      window[mapID].removeLayer(ID)
    }
    if (window[mapID].getSource(ID)) {
      window[mapID].removeSource(ID)
    }
  } else {
    ID.forEach(val => {
      if (window[mapID].getLayer(val)) {
        window[mapID].removeLayer(val)
      }
      if (window[mapID].getSource(val)) {
        window[mapID].removeSource(val)
      }
    })
  }
}

const getCenterByLayer = (mapID, layer, flag = false) => {
  const center = turf.center(layer).geometry.coordinates
  if (flag) {
    window[mapID].flyTo({
      center
    })
  }

  return center
}

//  删除通用图层
// 传入false：保证第一个对象可不传
// 注意：对象不会被至为false 对象里面的默认值仍然有效
const removeGeneralLayer = mapID => {
  if (window[mapID]) {
    removeLayerById(mapID, mapOutParam.generalId)

    window[mapID].off('click', 'grid_layer', clickGridHandle)
    if (mapOutParam.popup.grid_click_popup) {
      //清除弹窗
      mapOutParam.popup.grid_click_popup.remove()
    }
  }
}
// ================================== 通用地图函数 END =======================================

// ================================== 通用格式函数 START =======================================
// 格式化函数
const geomDataFormat = ({ data = null, geom = 'geom', color, value, name, grid = false }) => {
  let resData = null
  if (data) {
    let resData = {
      type: 'FeatureCollection',
      features: []
    }
    data.forEach(item => {
      color ? (item.color = item[color]) : ''
      value ? (item.value = item[value]) : ''
      name ? (item.name = item[name]) : ''

      let geometry
      if (grid) {
        let oneGeom = item[geom]
        if (typeof oneGeom == 'string') {
          oneGeom = oneGeom.split(',')
          oneGeom[0] = parseFloat(oneGeom[0])
          oneGeom[1] = parseFloat(oneGeom[1])
        }
        const towGeom = [parseFloat((oneGeom[0] + 0.0025).toFixed(6)), oneGeom[1]],
          threeGeom = [parseFloat((oneGeom[0] + 0.0025).toFixed(6)), parseFloat((oneGeom[1] - 0.0025).toFixed(6))],
          fourGeom = [oneGeom[0], parseFloat((oneGeom[1] - 0.0025).toFixed(6))]
        const geomArr = [[[oneGeom, towGeom, threeGeom, fourGeom, oneGeom]]]
        geometry = { type: 'MultiPolygon', coordinates: geomArr }
      } else {
        geometry = JSON.parse(item[geom])
      }

      const oneFeatures = {
        type: 'Feature',
        properties: item,
        geometry
      }

      delete oneFeatures.properties[geom]

      resData.features.push(oneFeatures)
    })
    console.log('格式化后数据', resData)
    return resData
  } else {
    console.error('格式化函数geomDataFormat()=====属性data未传值')
  }
  return resData
}

// 获取等量分割图例
const getEquivalentStops = ({
  array,
  type = 'ratio',
  count = 7,
  colorList = ['#83e6ff', '#9af592', '#fce148', '#faaa42', '#ff712f', '#fa3131', '#b80e0e']
}) => {
  // ? array 等量分割的数组  count 分割的条数  colorList 颜色组  ratio 分隔类型（ratio 125等比 equivalent等量  eqCount_Ratio 248等比）
  let stops = []
  array.sort((a, b) => {
    return a - b
  })
  const leng = array.length
  const max = array[leng - 1] //TODO 目前固定支持7位，push待迭代处理

  //  248等比 分隔
  if (type == 'eqCount_Ratio') {
    let multiple = 0
    let power = leng >= 5000 ? 3 : 2
    for (let i = 0; i < count; i++) {
      multiple += power ** i
    }
    const minX = leng / multiple
    colorList.forEach((item, index) => {
      if (index == 0) {
        stops.push([array[0], item])
      } else {
        const i = Math.floor(leng - minX * power ** (count - (index + 1)))
        stops.push([Math.floor(array[i]), item])
      }
    })
    return stops
  }

  /* 1、2、5等比分隔法 */

  if (type == 'ratio' && max > 100) {
    // 获取位数 n
    let n = 0
    let num = max
    while (num >= 1) {
      num = num / 10
      n++
    }
    //计算图例
    let item = []
    n = n - 1
    switch (true) {
      case max > 5 * Math.pow(10, n):
        item.push(
          5 * Math.pow(10, n),
          2 * Math.pow(10, n),
          1 * Math.pow(10, n),
          5 * Math.pow(10, n - 1),
          2 * Math.pow(10, n - 1),
          1 * Math.pow(10, n - 1),
          5 * Math.pow(10, n - 2)
        )
        break

      case max > 2 * Math.pow(10, n):
        item.push(
          2 * Math.pow(10, n),
          1 * Math.pow(10, n),
          5 * Math.pow(10, n - 1),
          2 * Math.pow(10, n - 1),
          1 * Math.pow(10, n - 1),
          5 * Math.pow(10, n - 2),
          5 * Math.pow(10, n - 2)
        )
        break
      case max > 1 * Math.pow(10, n):
        item.push(
          1 * Math.pow(10, n),
          5 * Math.pow(10, n - 1),
          2 * Math.pow(10, n - 1),
          1 * Math.pow(10, n - 2),
          5 * Math.pow(10, n - 2),
          2 * Math.pow(10, n - 2),
          1 * Math.pow(10, n - 2)
        )
        break
      case max > 5 * Math.pow(10, n - 1):
        item.push(
          5 * Math.pow(10, n - 1),
          2 * Math.pow(10, n - 1),
          1 * Math.pow(10, n - 1),
          5 * Math.pow(10, n - 2),
          2 * Math.pow(10, n - 2),
          1 * Math.pow(10, n - 2),
          5 * Math.pow(10, n - 3)
        )
        break
      default:
        console.error('等比图例发生未知错误')
        break
    }

    item.sort((a, b) => {
      return a - b
    })

    for (let i = 0; i < 7; i++) {
      let stopsItem = []
      stopsItem.push(item[i], colorList[i])
      stops.push(stopsItem)
    }
    stops[0][0] = 0 //TODO 权宜兼容<=符号,第一位置0
    return stops
  } else if (max > count) {
    /* 等量分隔法 */
    for (let i = 0; i < count; i++) {
      let item = []
      let num = parseInt(array[Math.floor((leng * i) / count)])
      // console.log('初始化num', num);
      if (stops.length > 0 && num <= stops[stops.length - 1][0]) {
        //去重
        num = stops[stops.length - 1][0] + 1
        // console.log('去重后num', num);
      }

      item.push(num, colorList[i])
      stops.push(item)
    }
    return stops
  }

  /* 最小图例 */
  for (let i = 0; i < count; i++) {
    let item = []
    item.push(i, colorList[i])
    stops.push(item)
  }
  return stops
}
// ================================== 通用格式函数 END =======================================

export {
  mapOutParam,
  initMap, // 初始化地图
  addBaseBorder, // 添加底图边界
  addCircleLayer, // 添加点图层
  addFillLayer, // 添加面图层
  add3DGrid, // 添加3D格网
  geomDataFormat, // 格式化函数
  removeLayerById, // 根据id删除图层
  removeGeneralLayer,
  getCenterByLayer,
  getEquivalentStops,
  addHeatLayer
}
