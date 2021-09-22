/* eslint-disable */
import store from '@/store'
import { getBorderByType } from 'localData'
import { Message } from 'element-ui'
import config from '../config/mapbox.json'
const mapOutParam = {
  center: store.state.map.center, // ?地图默认位置
  zoom: store.state.map.zoom, // ?地图zoom
  echartslayer: '', // ? echarts 图层
  drawControl: '', // ? 自定义区域挂载
  marker: '', // ? 定位点存储位置
  // mapbox弹框
  popup: {
    popup_div: undefined,
    popip_timeout: undefined,
    grid_click_popup: undefined
  },
  textfont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
  //  飞到中心点
  flyCenter: () => {
    map.flyTo({
      center: mapOutParam.center,
      // center: [107 + 57 / 60.0 + 41 / 3600.0, 21 + 39 / 60.0 + 18 / 3600.0], //test
      zoom: mapOutParam.zoom,
      pitch: 30
    })
  },
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
const initMap = async ({ mapContainer }) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hhdW5jeTk1MjciLCJhIjoiY2s5NHl3ZnhzMGlmcTNqbnRmOHg0eHRrcCJ9.10z8GnL2GYwa7Na-tCl7LQ'
  window.map = new mapboxgl.Map({
    container: mapContainer,
    style: {
      //设置版本号，一定要设置
      version: 8,
      //添加来源
      sources: {},
      layers: [],
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
    },
    center: mapOutParam.center,
    zoom: mapOutParam.zoom, //越大越近
    pitch: 30, //角度
    bearing: 0, //初始方向，值是北的逆时针度数，默认是0，即是正北
    antialias: false //抗锯齿，通过false关闭提升性能
  })
  map.scrollZoom.setWheelZoomRate(2 / 450) // 设置滚动尺度 默认 1/450
  map.addControl(
    new MapboxLanguage({
      defaultLanguage: 'zh'
    })
  )

  return new Promise(resolve => {
    map.on('load', function () {
      config.basemaps.forEach((item, index) => {
        window.map.addSource(item.id, {
          type: 'raster',
          tiles: [item.url],
          tileSize: 256,
          style: item.style
        })
        window.map.addLayer({
          id: item.id,
          type: 'raster',
          source: item.id
        })

        if (index != 0) {
          window.map.setLayoutProperty(item.id, 'visibility', 'none')
        }
      })
      // console.log(window.map.getLayer('esriBlueMap'))
      // window.map.getLayer('esriBlueMap').paint._properties.defaultPossiblyEvaluatedValues['raster-hue-rotate'] = 0
      // // window.map.getLayer('esriBlueMap').paint._properties.defaultPossiblyEvaluatedValues['raster-contrast'] = 0.1
      // window.map.getLayer('esriBlueMap').paint._properties.defaultPossiblyEvaluatedValues['raster-saturation'] = -1

      setTimeout(function () {
        addBaseBorder(mapOutParam.borderList)

        map.on('mouseenter', 'grid_layer', function () {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'grid_layer', function () {
          map.getCanvas().style.cursor = ''
        })

        map.on('mouseenter', 'circle_layer', function () {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'circle_layer_symbol', function () {
          map.getCanvas().style.cursor = ''
        })

        map.on('click', () => {
          removeLayerById('highlight_grid_layer')
        })

        // 自定义绘图
        let modes = MapboxDraw.modes
        modes.draw_rectangle = DrawRectangle.default
        const drawControl = new MapboxDraw({
          displayControlsDefault: false,
          modes: Object.assign(
            {
              circle_mode: CircleMode,
              polygon_mode: PolygonMode,
              polyline_mode: PolylineMode,

              segment_mode: SegmentMode
            },
            MapboxDraw.modes
          ),
          controls: {
            simple_select: false,
            line_string: true,
            polygon: true,
            trash: true
          }
        })
        map.addControl(drawControl, 'top-right')
        mapOutParam.drawControl = drawControl //挂载

        resolve(true)
      }, 0)
    })
  })
}

// 添加底图边界
const addBaseBorder = (
  opacity = [0.8, 0.6], // ?边界透明度
  width = [7, 2], // ?边界宽度
  color = ['#06c3cd ', '#007CFF'] // ? 边界颜色
) => {
  // 主边界
  getBorderByType('jiaozi').then(border => {
    map.addSource('jiaozi_border', {
      type: 'geojson',
      data: border
    })
    // 主边界
    map.addLayer({
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
    window.map.addLayer({
      id: 'jiaozi_border2',
      type: 'line',
      source: 'jiaozi_border',
      minzoom: 5,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-opacity': 0.8,
        'line-width': 1,
        'line-color': '#fff'
      }
    })
  })

  getBorderByType('district').then(border => {
    map.addSource('district_border', {
      type: 'geojson',
      data: border
    })
    // 主边界
    map.addLayer(
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
    window.map.addLayer({
      id: 'district_border2',
      type: 'line',
      source: 'district_border',
      minzoom: 5,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-opacity': 0.5,
        'line-width': 0.5,
        'line-color': '#fff'
      }
    })
  })
}
// ================================== 地图加载函数 END =======================================

// ================================== 绘制函数 START =======================================
// 绘制区域事件
const drawHandle = () => {
  //选区面积计算
  let areaCalculate = feaure => {
    return (turf.area(feaure) / 1000 / 1000).toFixed(2)
  }

  if (!map.getSource('mapbox-gl-draw-cold')) {
    return
  }
  const drawedFeatures = map.getSource('mapbox-gl-draw-cold')._data

  if (drawedFeatures.features.length > 0) {
    const area = areaCalculate(drawedFeatures)
    let length = drawedFeatures.features[0].geometry.coordinates[0].length
    if (area > 100) {
      Message({
        message: '绘制区域需小于100平方千米，请重新绘制！',
        duration: 2000,
        type: 'warning'
      })
      return false
    } else if (length != 2) {
      addAreaLayer(drawedFeatures) //绘制区域图层
      let drawedF = drawedFeatures.features[0].geometry.coordinates[0]
      let arr = []
      let geomtext = ''
      if (typeof drawedF === 'object') {
        for (let key in drawedF) {
          arr.push(drawedF[key])
        }
      } else {
        arr = drawedF
      }
      for (let i = 0; i < arr.length; i++) {
        const coodString =
          i === 0
            ? arr[i][0].toFixed(7) + ' ' + arr[i][1].toFixed(7)
            : ',' + arr[i][0].toFixed(7) + ' ' + arr[i][1].toFixed(7)

        geomtext += coodString
      }
      const center = turf.center(drawedFeatures.features[0]).geometry.coordinates
      return { geom: geomtext, center }
    } //线
  } else {
    Message({
      message: '请先绘制区域',
      duration: 2000,
      type: 'warning'
    })
    return false
  }
}

// 添加绘制区域图层
const addAreaLayer = data => {
  if (!map.getSource('area_border_layer')) {
    map.addSource('area_border_layer', {
      type: 'geojson',
      data: data
    })
    map.addLayer({
      id: 'area_border_layer',
      type: 'line',
      source: 'area_border_layer',
      layout: {},
      paint: {
        // "line-color": "#007CFF",
        'line-color': '#40FFBC',
        'line-width': 2,
        'line-opacity': 0.8
      }
    })
  } else {
    map.getSource('area_border_layer').setData(data)
  }
  // mapOutParam.drawControl.deleteAll()
}

// 添加点图层
const addCircleLayer = ({
  data,
  color = '#fff',
  color_type = 'interval',
  value = 4,
  value_type = 'interval',
  opacity = 0.8,
  zoom = [8, 24],
  symbol = { size: 12, color: 'rgba(255,255,255,0.8)', zoom: [8, 24] },
  filter = ['!=', 'value', ''],
  id = 'circle_layer',
  rippleShow = false,
  ripple = { size: 50, color: '255,200,200' },
  value_of_zoom = null,
  text_allow_overlap = false,
  aboveId = null,
  beforeId = '',
  isBuilding = false,
  entType = null
}) => {
  removeLayerById([id + '_ripple', id + '_symbol', id])
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
  map.addSource(id, {
    type: 'geojson',
    data: data
  })

  if (rippleShow) {
    map.hasImage(id + '_ripple_image') ? map.removeImage(id + '_ripple_image') : ''
    const size = ripple.size
    var rippleImage = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        var canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
      },

      render: function () {
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
        map.triggerRepaint()

        // return `true` to let the map know that the image was updated
        return true
      }
    }

    map.addImage(id + '_ripple_image', rippleImage, { pixelRatio: 2 })

    map.addLayer({
      id: id + '_ripple',
      type: 'symbol',
      source: id,
      minzoom: zoom[0],
      maxzoom: zoom[1],
      layout: {
        'icon-image': id + '_ripple_image',
        'icon-allow-overlap': true
      },
      filter
    })
  }
  console.log(aboveId)
  // 添加点图层
  map.addLayer(
    {
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
    },
    beforeId
  )
  // 根据是否有name 添加名字图层
  if (data.features[0].properties.name) {
    map.addLayer(
      {
        id: id + '_symbol',
        type: 'symbol',
        source: id,
        minzoom: symbol.zoom[0],
        maxzoom: symbol.zoom[1],
        layout: {
          'text-field': '{name}',
          'text-font': mapOutParam.textfont,
          'text-size': symbol.size,
          'text-allow-overlap': text_allow_overlap,
          'text-offset': [0, 1.2]
        },
        paint: {
          'text-color': symbol.color,
          'text-halo-color': '#00192e',
          'text-halo-width': 1
        },
        filter
      },
      beforeId
    )
  }
  if (entType != null) {
    let imgPath;
    switch (entType) {
      case 0:
        imgPath = require("../img/sq-icon.png")
        break;
      case 1:
        imgPath = require("../img/ly-icon.png")
        break;
      default:
        break;
    }
    map.loadImage(
      imgPath,
      function (error, image) {
        if (error) {
          console.log(error);
        } else {
          map.hasImage('custom-marker' + entType) ? map.removeImage('custom-marker' + entType) : ''
          map.addImage('custom-marker' + entType, image);
          map.addLayer({
            id: id + '_label',
            type: 'symbol',
            source: id,
            layout: {
              'icon-image': 'custom-marker' + entType,
              'text-field': '{name}',
              'text-font': mapOutParam.textfont,
              'text-size': 12,
              'text-allow-overlap': false,
              'text-offset': [0, 1.6],
              'text-anchor': 'top'
            },
            paint: {
              'text-color': '#FFF'
            }
          })
        }
      })
    if (isBuilding) {
      map.on('click', id + '_label', function (e) {
        let features = map.queryRenderedFeatures(e.point, { layers: [id + '_label'] })
        console.log(features);
        store.commit('setName', features[0].properties.name)
      })
    }
  }
}

// 添加聚类点图层
const addClusterLayer = ({
  data,
  id = 'cluster',
  color = ['#51bbd6', 50, '#f1f075', 300, '#f28cb1'],
  radius = [20, 50, 30, 300, 40],
  labelShow = false,
  entType = null,
  label = { size: 12, color: 'rgba(255,255,255,0.8)' }
}) => {
  removeLayerById([id + '_point', id + '_count', id + '_label', id])

  map.addSource(id, {
    type: 'geojson',
    data: data,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  })

  map.addLayer({
    id: id,
    type: 'circle',
    source: id,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], ...color],
      'circle-radius': ['step', ['get', 'point_count'], ...radius]
    }
  })

  map.addLayer({
    id: id + '_count',
    type: 'symbol',
    source: id,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': mapOutParam.textfont,
      'text-size': 12
    }
  })

  map.addLayer({
    id: id + '_point',
    type: 'circle',
    source: id,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': color[0],
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  })

  if (data.features[0].properties.name && labelShow) {
    map.addLayer({
      id: id + '_label',
      type: 'symbol',
      source: id,
      filter: ['!', ['has', 'point_count']],
      layout: {
        'text-field': '{name}',
        'text-font': mapOutParam.textfont,
        'text-size': label.size,
        'text-allow-overlap': false,
        'text-offset': [0, 1.2]
      },
      paint: {
        'text-color': label.color
      }
    })
  }

  // 显示企业marker
  if (data.features[0].properties.name && entType != null) {
    let imgPath;
    switch (entType) {
      case 0:
        imgPath = require("../img/qy.png")
        break;
      case 1:
        imgPath = require("../img/gaoqi.png")
        break;
      case 2:
        imgPath = require("../img/guishang.png")
        break;
      default:
        break;
    }
    map.loadImage(
      imgPath,
      function (error, image) {
        if (error) {

        } else {
          map.hasImage('custom-marker' + entType) ? map.removeImage('custom-marker' + entType) : ''
          map.addImage('custom-marker' + entType, image);
          map.addLayer({
            id: id + '_label',
            type: 'symbol',
            source: id,
            filter: ['!', ['has', 'point_count']],
            layout: {
              'icon-image': 'custom-marker' + entType,
              'text-field': '{name}',
              'text-font': mapOutParam.textfont,
              'text-size': label.size,
              'text-allow-overlap': false,
              'text-offset': [0, 1.6],
              'text-anchor': 'top'
            },
            paint: {
              'text-color': label.color
            }
          })
        }
      })

    map.on('click', id + '_label', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: [id + '_label'] })
      store.commit('setName', features[0].properties.name)
    })
  }

  // inspect a cluster on click
  map.on('click', id, function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [id] })
    var clusterId = features[0].properties.cluster_id
    map.getSource(id).getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err) return

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      })
    })
  })

  map.off('mouseenter', id, clusterMouseenter)
  map.off('mouseleave', id, clusterMouseleave)

  setTimeout(() => {
    map.on('mouseenter', id, clusterMouseenter)
    map.on('mouseleave', id, clusterMouseleave)
  }, 0)
}
// 聚类点事件
const clusterMouseenter = () => {
  map.getCanvas().style.cursor = 'pointer'
}
const clusterMouseleave = () => {
  map.getCanvas().style.cursor = ''
}

// 添加线图层
const addLineLayer = ({ data, opacity = 0.7, color = '#007CFF', width = 1, id = 'line_layer', beforeId = '' }) => {
  removeLayerById(id)
  let line_color
  // ? 判断是否使用颜色组，不使用则使用单色
  if (color instanceof Array) {
    line_color = {
      property: 'color',
      stops: color
    }
  } else {
    line_color = color
  }
  // 定义数据源
  map.addSource(id, {
    type: 'geojson',
    data
  })
  // 添加线图层
  map.addLayer(
    {
      id: id,
      type: 'line',
      source: id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-opacity': opacity,
        'line-width': width,
        'line-color': line_color
      }
    },
    beforeId
  )
}

// 添加面图层
const addFillLayer = ({
  data,
  color = '#007CFF',
  color_type = 'interval',
  opacity = 0.6,
  borderShow = true,
  boder = { opacity: 0.4, width: 0.6, color: 'rgb(156, 57, 0)' },
  symbolShow = true,
  symbol = { size: 12, color: 'rgb(255,255,255)' },
  symbolNameShow = true,
  symbolValueShow = true,
  filter = ['!=', 'value', ''],
  id = 'fill_layer',
  fillColor = null,
  underLayerId = null //在指定图层id之下
}) => {
  removeLayerById([id + '_border', id + '_symbol', id])

  let fill_color
  if (!fillColor) {
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
  } else {
    fill_color = fillColor
  }

  // 定义数据源
  map.addSource(id, {
    type: 'geojson',
    data
  })
  // 添加面图层
  map.addLayer(
    {
      id: id,
      type: 'fill',
      source: id,
      paint: {
        'fill-color': fill_color,
        'fill-opacity': opacity
      },
      filter
    },
    underLayerId ? underLayerId : ''
  )
  // 添加面边框
  borderShow &&
    map.addLayer({
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

  // 添加symbol
  let text = null
  if (symbolNameShow && symbolValueShow) {
    text = '{name}：{value}'
  } else if (symbolNameShow) {
    text = '{name}'
  } else {
    text = '{value}'
  }
  // console.log(text)
  symbolShow &&
    map.addLayer({
      id: id + '_symbol',
      type: 'symbol',
      source: id,
      layout: {
        'text-field': text,
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


// 添加面图层
const addFillLayer2 = ({
  data,
  color = '#007CFF',
  color_type = 'interval',
  opacity = 0.6,
  borderShow = true,
  boder = { opacity: 0.4, width: 0.6, color: 'rgb(156, 57, 0)' },
  symbolShow = true,
  symbol = { size: 12, color: 'rgb(255,255,255)' },
  symbolNameShow = true,
  symbolValueShow = true,
  filter = ['!=', 'type', ''],
  id = 'fill_layer',
  fillColor = null
}) => {
  removeLayerById([id + '_border', id + '_symbol', id])

  let fill_color
  if (!fillColor) {
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
  } else {
    fill_color = fillColor
  }

  // 定义数据源
  map.addSource(id, {
    type: 'geojson',
    data
  })
  // 添加面图层
  map.addLayer({
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
  borderShow &&
    map.addLayer({
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

  // 添加symbol
  let text = '{name}'
  // console.log(text)
  symbolShow &&
    map.addLayer({
      id: id + '_symbol',
      type: 'symbol',
      source: id,
      layout: {
        'text-field': text,
        'text-font': mapOutParam.textfont,
        'text-size': symbol.size,
        'text-allow-overlap': false,
        'text-offset': [0, 0]
      },
      paint: {
        'text-color': symbol.color
      },
      filter
    })
  map.on('click', id, function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [id] })
    console.log(features[0].properties.name);
    store.commit('setName', features[0].properties.name)
  })
}

// 添加3D格网
const add3DGrid = ({
  data,
  color = '#fff',
  color_type = 'interval',
  opacity = 0.8,
  filter = ['>=', 'value', 0],
  id = 'grid_layer',
  click = true
}) => {
  removeLayerById(id)
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
  map.addSource(id, {
    type: 'geojson',
    data: data
  })
  map.addLayer({
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
    map.off('click', 'grid_layer', clickGridHandle)
    if (mapOutParam.popup.grid_click_popup) {
      //清除弹窗
      mapOutParam.popup.grid_click_popup.remove()
    }
    setTimeout(() => {
      map.on('click', 'grid_layer', clickGridHandle)
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
  multiple = 10
}) => {
  removeLayerById(id)
  if (!weight) {
    const weightList = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1]
    weight = []
    stops.forEach((item, index) => {
      weight.push(item[0] * multiple)
      weight.push(weightList[index])
    })
  }

  window.map.addSource('heatmap_layer', { type: 'geojson', data })
  window.map.addLayer({
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

// 添加OD图层
const addOdLayer = ({ forList, table, startName, unit = '个', stops }) => {
  let color = ['#00EAFF', '#00FFBC', '#003EFF', '#F500FF', '#FFD140', '#FF5021'],
    series = [], // ? 配置项
    legendData = [], // ? 图例数据
    valueList = [] // ? 存储所有数据数组

  forList.forEach((item, index) => {
    // 把名字存储到 图例数据中
    legendData.push(item[0])
    if (!stops) {
      // 没有stops初始值 默认执行等量切割获取 颜色组
      item[1].forEach(item => {
        valueList.push(item.count)
      })
      if (index == forList.length - 1) {
        console.log(valueList)
        stops = getEquivalentStops({ array: valueList, type: 'equivalent' })
      }
    }

    console.log('startName:', startName)
    series.push(
      //轨迹
      {
        name: item[0],
        type: 'lines',
        coordinateSystem: 'GLMap',
        zlevel: 2, //分层 类似于z-index
        effect: {
          show: true,
          period: 10, //箭头指向速度，值越小速度越快
          trailLength: 0.01, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: 'arrow', //箭头图标
          symbolSize: 4 //图标大小
        },
        lineStyle: {
          normal: {
            color: color[index],
            width: 1.2, //尾迹线条宽度
            opacity: 0.3, //尾迹线条透明度
            curveness: 0.3 //尾迹线条曲直度
          }
        },
        data: convertData(item, startName)
      },
      // 点
      {
        //涟漪特效
        name: item[0],
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          period: 3, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 3 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: false,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function (params) {
              //圆环显示文字
              return params.data.label + '：' + params.data.value[2] + unit
            },
            textStyle: {
              fontSize: 12
            }
          },
          emphasis: {
            show: true
          }
        },
        symbolSize: function (val) {
          let size = val[2]
          switch (true) {
            case size < stops[1][0]:
              size = 3
              break
            case size < stops[2][0]:
              size = 4
              break
            case size < stops[3][0]:
              size = 5
              break
            case size < stops[4][0]:
              size = 6
              break
            case size < stops[5][0]:
              size = 8
              break
            case size < stops[6][0]:
              size = 10
              break
            case size >= stops[6][0]:
              size = 12
              break
          }
          return size //圆环大小
        },
        itemStyle: {
          normal: {
            color: color[index]
          }
        },
        data: item[1].map(dataItem => {
          return {
            label: dataItem.name,
            value: table[dataItem.name].concat(dataItem.count)
          }
        })
      },
      //被攻击点
      {
        name: item[0],
        type: 'effectScatter',
        color: 'red',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          //涟漪特效
          period: 6, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 5.5 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: true,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function (params) {
              //圆环显示文字
              return params.data.name
            },
            fontSize: 20,
            color: color[index]
          },
          emphasis: {
            show: true
          }
        },
        symbolSize: function () {
          return 10 //圆环大小
        },
        itemStyle: {
          normal: {
            color: color[index]
          }
        },
        data: [
          {
            name: startName,
            value: table[startName].concat(0)
          }
        ]
        // data: function(params) {
        //   console.log(params)
        //   console.log(startName)
        //   let arr = [
        //     {
        //       name: startName,
        //       value: table[startName].concat(1),
        //     },
        //   ]
        //   return arr
        // },
      }
    )
  })

  const option = {
    GLMap: {
      roam: true
    },
    geo: {
      map: 'GLMap',
      label: {
        emphasis: {
          show: true
        }
      },
      roam: false,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#404a59'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    },
    legend: {
      orient: 'vertical',
      top: '100px',
      left: '50%',
      data: legendData,
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'single'
    },
    visualMap: {
      orient: 'vertical',
      top: '100px',
      right: '450px',
      //图例值控制
      pieces: [
        { max: stops[1][0], color: stops[0][1] },
        { min: stops[1][0], max: stops[2][0], color: stops[1][1] },
        { min: stops[2][0], max: stops[3][0], color: stops[2][1] },
        { min: stops[3][0], max: stops[4][0], color: stops[3][1] },
        { min: stops[4][0], max: stops[5][0], color: stops[4][1] },
        { min: stops[5][0], max: stops[6][0], color: stops[5][1] },
        { min: stops[6][0], color: stops[6][1] }
      ],
      selectedMode: false,
      calculable: false,
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    series: series
  }

  if (mapOutParam.echartslayer._map) {
    mapOutParam.echartslayer.remove()
    window.onresize = ''
  }

  mapOutParam.echartslayer = new EchartsLayer(map)
  mapOutParam.echartslayer.chart.clear()
  mapOutParam.echartslayer.chart.setOption(option)

  function convertData(array, startPointName) {
    let res = []
    const data = array[1]
    if (array[2] == 'in') {
      data.forEach(item => {
        res.push([
          {
            coord: table[item.name]
          },
          {
            coord: table[startPointName],
            value: item.count
          }
        ])
      })
    } else {
      data.forEach(item => {
        if (item.count > 0) {
          console.log(table)
          res.push([
            {
              coord: table[startPointName]
            },
            {
              coord: table[item.name],
              value: item.count
            }
          ])
        }
      })
    }

    return res
  }
}

// 添加单向OD图层
const addOneOdLayer = ({ forList, startName, startCenter, unit = '人', inOut = 'in', stops }) => {
  let color = ['#00EAFF', '#00FFBC', '#003EFF', '#F500FF', '#FFD140', '#FF5021'],
    series = [], // ? 配置项
    legendData = [], // ? 图例数据
    valueList = [] // ? 存储所有数据数组

  console.log('addOneOdLayer-forList', forList)
  forList.forEach((item, index) => {
    // 把名字存储到 图例数据中
    legendData.push(item[0])
    if (!stops) {
      // 没有stops初始值 默认执行等量切割获取 颜色组
      item[1].forEach(item => {
        valueList.push(item.count)
      })
      if (index == forList.length - 1) {
        const colorList = ['#02eafd', '#bcf229', '#fffc17', '#f0b248', '#ff6c27', '#ff0000', '#8e0e0b']
        stops = getEquivalentStops(valueList, 7, colorList)
      }
    }

    console.log('startName:', startName)
    series.push(
      //轨迹
      {
        name: item[0],
        type: 'lines',
        coordinateSystem: 'GLMap',
        zlevel: 2, //分层 类似于z-index
        effect: {
          show: true,
          period: 10, //箭头指向速度，值越小速度越快
          trailLength: 0.01, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: 'arrow', //箭头图标
          symbolSize: 4 //图标大小
        },
        lineStyle: {
          normal: {
            color: color[index],
            width: 1.2, //尾迹线条宽度
            opacity: 0.3, //尾迹线条透明度
            curveness: 0.3 //尾迹线条曲直度
          }
        },
        data: convertData(item, inOut)
      },
      // 点
      {
        //涟漪特效
        name: item[0],
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          period: 3, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 3 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: false,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function (params) {
              //圆环显示文字
              return params.data.label + '：' + params.data.value[2] + unit
            },
            textStyle: {
              fontSize: 12
            }
          },
          emphasis: {
            show: true
          }
        },
        symbolSize: function (val) {
          let size = val[2]
          switch (true) {
            case size < stops[1][0]:
              size = 3
              break
            case size < stops[2][0]:
              size = 4
              break
            case size < stops[3][0]:
              size = 5
              break
            case size < stops[4][0]:
              size = 6
              break
            case size < stops[5][0]:
              size = 8
              break
            case size < stops[6][0]:
              size = 10
              break
            case size >= stops[6][0]:
              size = 12
              break
          }
          return size //圆环大小
        },
        itemStyle: {
          normal: {
            color: color[index]
          }
        },
        data: item[1].map(dataItem => {
          return {
            label: dataItem.name,
            value: dataItem.coord.concat(dataItem.count)
          }
        })
      },
      //被攻击点
      {
        name: item[0],
        type: 'effectScatter',
        color: 'red',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          //涟漪特效
          period: 6, //动画时间，值越小速度越快
          brushType: 'stroke', //波纹绘制方式 stroke, fill
          scale: 5.5 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          normal: {
            show: true,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function (params) {
              //圆环显示文字
              return params.data.name
            },
            fontSize: 20,
            color: color[index]
          },
          emphasis: {
            show: true
          }
        },
        symbolSize: function () {
          return 10 //圆环大小
        },
        itemStyle: {
          normal: {
            color: color[index]
          }
        },
        data: [
          {
            name: startName,
            value: startCenter.concat(0)
          }
        ]
        // data: function(params) {
        //   console.log(params)
        //   console.log(startName)
        //   let arr = [
        //     {
        //       name: startName,
        //       value: startCenter.concat(1),
        //     },
        //   ]
        //   return arr
        // },
      }
    )
  })

  const option = {
    GLMap: {
      roam: true
    },
    geo: {
      map: 'GLMap',
      label: {
        emphasis: {
          show: true
        }
      },
      roam: false,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#404a59'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    },
    legend: {
      orient: 'vertical',
      top: '20px',
      left: '50%',
      data: legendData,
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'single'
    },
    visualMap: {
      //图例值控制
      pieces: [
        { max: stops[1][0], color: stops[0][1] },
        { min: stops[1][0], max: stops[2][0], color: stops[1][1] },
        { min: stops[2][0], max: stops[3][0], color: stops[2][1] },
        { min: stops[3][0], max: stops[4][0], color: stops[3][1] },
        { min: stops[4][0], max: stops[5][0], color: stops[4][1] },
        { min: stops[5][0], max: stops[6][0], color: stops[5][1] },
        { min: stops[6][0], color: stops[6][1] }
      ],
      selectedMode: false,
      calculable: false,
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    series: series
  }

  if (mapOutParam.echartslayer._map) {
    mapOutParam.echartslayer.remove()
    window.onresize = ''
  }

  mapOutParam.echartslayer = new EchartsLayer(map)
  mapOutParam.echartslayer.chart.clear()
  mapOutParam.echartslayer.chart.setOption(option)

  function convertData(array, inOut) {
    let res = []
    const data = array[1]
    console.log(array, inOut)
    if (inOut == 'in') {
      data.forEach(item => {
        res.push([
          {
            coord: item.coord
          },
          {
            coord: startCenter,
            value: item.count
          }
        ])
      })
    } else {
      data.forEach(item => {
        if (item.count > 0) {
          res.push([
            {
              coord: startCenter
            },
            {
              coord: item.coord,
              value: item.count
            }
          ])
        }
      })
    }

    return res
  }
}
// ================================== 绘制函数 END =======================================

// ================================== 通用地图函数 START =======================================
// 根据图层获取中心点
const getCenterByLayer = (layer, flag = false) => {
  const center = turf.center(layer).geometry.coordinates
  if (flag) {
    map.flyTo({
      center
    })
  }

  return center
}

// 根据 id/id数组 删除图层
const removeLayerById = ID => {
  if (typeof ID === 'string') {
    if (map.getLayer(ID)) {
      map.removeLayer(ID)
    }
    if (map.getSource(ID)) {
      map.removeSource(ID)
    }
  } else {
    ID.forEach(val => {
      if (map.getLayer(val)) {
        map.removeLayer(val)
      }
      if (map.getSource(val)) {
        map.removeSource(val)
      }
    })
  }
}

//  删除通用图层
// 传入false：保证第一个对象可不传
// 注意：对象不会被至为false 对象里面的默认值仍然有效
const removeGeneralLayer = ({ draw = true } = false) => {
  if (map) {
    removeLayerById(mapOutParam.generalId)

    map.off('click', 'grid_layer', clickGridHandle)
    if (mapOutParam.popup.grid_click_popup) {
      //清除弹窗
      mapOutParam.popup.grid_click_popup.remove()
    }

    if (mapOutParam.popup.popup_div) {
      //清除弹窗
      mapOutParam.popup.popup_div.remove()
    }

    //  删除 echarts图层（目前只有od）
    if (mapOutParam.echartslayer._map) {
      mapOutParam.echartslayer.remove()
      window.onresize = ''
    }

    if (draw) {
      mapOutParam.drawControl.deleteAll()
      removeLayerById('area_border_layer')
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
      color && (item.color = item[color] ? item[color] : color)
      value && (item.value = item[value])
      name && (item.name = item[name])

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
  // colorList = ['#83e6ff', '#9af592', '#fce148', '#faaa42', '#ff712f', '#fa3131', '#b80e0e']  //蓝红
  colorList = ['#78fa8a', '#adfd52', '#fce148', '#faaa42', '#ff712f', '#fa3131', '#b80e0e'] //青红
}) => {
  // ? array 等量分割的数组  count 分割的条数  colorList 颜色组  ratio 分隔类型（ratio 125等比 equivalent等量  eqCount_Ratio 248等比）
  let stops = []
  array.sort((a, b) => {
    return a - b
  })
  console.log(array)
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

const flyALittle = (param = -0.007) => {
  console.log(mapOutParam.center);
  let center = [mapOutParam.center[0] + param, mapOutParam.center[1]]
  map.flyTo({
    center: center
  });
}

// ================================== 通用格式函数 END =======================================

export {
  mapOutParam,
  initMap, // 初始化地图
  drawHandle,
  flyALittle, // 对于单边栏页面，地图向右平移一点
  addBaseBorder, // 添加底图边界
  addCircleLayer, // 添加点图层
  addClusterLayer, // 添加聚类点图层
  addLineLayer, // 添加线图层
  addFillLayer, // 添加面图层
  addFillLayer2, // 添加面图层-服务能力-土地资源
  add3DGrid, // 添加3D格网
  addHeatLayer, // 添加热力图层
  addOdLayer, // 添加OD图层
  addOneOdLayer, // 添加OD图层2
  getCenterByLayer, // 获取图层中心点
  geomDataFormat, // 格式化函数
  removeLayerById, // 根据id删除图层
  getEquivalentStops, // 获取等量分割图例
  removeGeneralLayer
}
