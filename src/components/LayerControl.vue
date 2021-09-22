<template>
  <div class="layerToggle-box">
    <div class="title">图层控制</div>
    <div class="layer-content">
      <el-tree
        :data="treeList"
        :props="defaultTreeProps"
        @check-change="handleCheckChange"
        :check-strictly="true"
        default-expand-all
        show-checkbox
        node-key="id"
        ref="tree"
      ></el-tree>
    </div>

    <div class="legend-box" v-show="legendVisible && stops && stops.length > 0">
      <Legend :stops="stops" label="" title="地块图例"></Legend>
    </div>
  </div>
</template>

<script>
import { addFillLayer, removeLayerById } from 'mapfunc'
export default {
  props: {
    showLayer: {
      type: Array,
      default() {
        return [] //开启的图层的id：['build','trips'，'businessArea']
      }
    }
  },
  data() {
    return {
      defaultTreeProps: {
        label: 'label'
      },

      treeList: [
        {
          id: 'build',
          label: '建筑图层'
        },
        {
          id: 'trips',
          label: '流动轨迹图层'
        },
        {
          id: 'plot',
          label: '地块图层'
        },
        {
          id: 'businessArea',
          label: '金融城总部商务区'
        }
      ],

      legendVisible: false,
      stops: [
        ['行政办公用地兼容商业用地', '#FE0040'],
        ['商业待确定', 'rgb(254,46,96)'],
        ['科研用地', '#DE6EA6'],
        ['教育文化中心等', 'rgb(253,159,125)'],
        ['商业用地', '#FE0000'],
        ['西南设计院', 'rgb(255,63,0)'],
        ['行政办公用地', '#FF00FF'],
        ['变电站', 'rgb(0,138,184)'],
        ['特殊用地', '#B9B85C'],
        ['环球中心', 'rgb(160,160,160)'], //停车场
        ['二类住宅用地', '#FEFF7F'],
        ['商业用地兼容住宅用地', '#FF0080'],
        ['公园绿地', '#00FF01']
      ]
    }
  },
  computed: {},
  watch: {
    showLayer: {
      handler() {
        // console.log('showLayer', val)
        this.initLayer()
      }
    }
  },
  mounted() {
    this.initLayer()
  },
  methods: {
    //初始化图层
    initLayer() {
      this.$refs.tree.setCheckedKeys(this.showLayer) //设置选中状态
      this.treeList.forEach(item => {
        if (this.showLayer.includes(item.id)) {
          this.handleCheckChange(item, true)
        } else {
          this.handleCheckChange(item, false)
        }
      })
    },

    //处理树事件
    handleCheckChange(data, checked) {
      let layerId = data.id
      //添加逻辑
      if (checked) {
        this.addLayerHandle(layerId)
      }
      //清除逻辑
      else {
        //trips无Source
        if (layerId == 'trips') {
          if (window.map.getLayer(layerId)) {
            window.map.removeLayer(layerId)
          }
        }
        //其他的走清除函数
        else {
          let idArr = []
          layerId == 'build' && idArr.push(layerId + '2')
          layerId == 'businessArea' && idArr.push(layerId + '_symbol')
          layerId == 'plot' && (this.legendVisible = false)

          idArr.push(layerId)
          removeLayerById(idArr)
        }
      }
    },

    // 添加图层入口
    addLayerHandle(layerId) {
      switch (layerId) {
        case 'build':
          this.addBuildLayer(layerId)
          break
        case 'trips':
          this.addTripsLayer(layerId)
          break
        case 'plot':
          this.legendVisible = true
          this.addPlotLayer(layerId)
          break
        case 'businessArea':
          this.addBusinessAreaLayer(layerId)
          break
      }
    },

    /**-------图层函数------- */
    // 建筑
    addBuildLayer(layerId) {
      removeLayerById([layerId + '2', layerId])
      window.map.addSource(layerId, {
        type: 'vector',
        tiles: ['http://81.68.104.27:5080/maps/jiaozi_buildings/{z}/{x}/{y}.vector.pbf']
      })
      //交子内建筑
      window.map.addLayer({
        id: layerId,
        type: 'fill-extrusion',
        source: layerId,
        'source-layer': 'jiaozi_buildings',
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['exponential', 0.99],
            ['get', 'height'],
            0,
            '#ecffff',
            500,
            '#00FFFF'
          ],
          'fill-extrusion-opacity': 0.8,
          'fill-extrusion-height': ['interpolate', ['linear'], ['get', 'height'], 0, 1, 1, 1.2, 1000, 1200],
          'fill-extrusion-vertical-gradient': true
        },
        filter: ['==', 'function', 'E17']
      })
      //交子外建筑
      window.map.addLayer({
        id: layerId + '2',
        type: 'fill-extrusion',
        source: layerId,
        'source-layer': 'jiaozi_buildings',
        paint: {
          'fill-extrusion-color': 'rgb(173,173,173)',
          'fill-extrusion-opacity': 0.2,
          'fill-extrusion-height': ['interpolate', ['linear'], ['get', 'height'], 0, 1, 1, 1.2, 1000, 1200],
          'fill-extrusion-vertical-gradient': true
        },

        filter: ['!=', 'function', 'E17']
      })
    },

    // 流动
    async addTripsLayer(layerId) {
      /* eslint-disable */
      // const geojsonData = require('static/data/layer/trips.json')
      const url = `static/data/layer/trips.json`
      const geojsonData = await fetch(url).then(response => response.json())
      // console.log('geojsonData', geojsonData)

      let layerData = []
      geojsonData.forEach(item => {
        let one = { timestamps: [], path: [] }
        item.steps.forEach(oneItem => {
          one.timestamps.push(oneItem.time)
          one.path.push(oneItem.coordinate)
        })
        layerData.push(one)
      })

      const { MapboxLayer, TripsLayer } = deck
      var time = 100
      const myDeckLayer = new MapboxLayer({
        id: layerId,
        //设置图层类型为轨迹图
        type: TripsLayer,
        //使用trip数据
        data: layerData,
        //获得数据中的路线和时间数据
        getPath: d => {
          return d.path
        },

        getTimestamps: d => d.timestamps,
        //设置轨迹颜色、透明度、长度等信息
        // getColor: d => {
        //   return d.color
        // },
        // getColor: [23, 184, 190],
        getColor: [0, 255, 252],
        // getColor: [255, 0, 0],
        opacity: 0.8,
        widthMinPixels: 0.8,
        rounded: true,
        trailLength: 10, //300
        //使用time变量，之后变化time的值实现动态效果
        currentTime: time,
        shadowEnabled: true //false
      })

      //mapbox-gl添加图层
      if (window.map.getLayer(layerId)) {
        window.map.removeLayer(layerId)
      }
      window.map.addLayer(myDeckLayer)
      //循环修改时间，实现轨迹的动态效果
      function animate() {
        time = (time + 2) % 1000 //6  1800
        // time = (time + 0.3) % 1600
        myDeckLayer.setProps({ currentTime: time })
        requestAnimationFrame(animate)
      }
      animate()
    },
    // 交子地块图层
    async addPlotLayer(layerId) {
      const url = `static/data/layer/plot.json`
      const geojsonData = await fetch(url).then(response => response.json())
      // console.log('geojsonData', geojsonData)

      // const geojsonData = require('static/data/layer/plot.json')
      //{ "gid": 1, "objectid": 1.0,  "name": "银泰中心", "type": "商业待确定" }
      let params = {
        id: layerId,
        data: geojsonData,
        fillColor: {
          property: 'type',
          type: 'categorical',
          stops: [
            ['行政办公用地兼容商业用地', '#FE0040'],
            ['商业待确定', 'rgb(254,46,96)'],
            ['科研用地', '#DE6EA6'],
            ['教育文化中心等', 'rgb(253,159,125)'],
            ['商业用地', '#FE0000'],
            ['西南设计院', 'rgb(255,63,0)'],
            ['行政办公用地', '#FF00FF'],
            ['变电站', 'rgb(0,138,184)'],
            ['特殊用地', '#B9B85C'],
            ['环球中心', 'rgb(160,160,160)'], //停车场
            ['二类住宅用地', '#FEFF7F'],
            ['商业用地兼容住宅用地', '#FF0080'],
            ['公园绿地', '#00FF01']
          ]
        },
        opacity: 0.6,
        symbolShow: false,
        borderShow: false
      }
      addFillLayer(params)
    },
    // 三期商务区
    async addBusinessAreaLayer(layerId) {
      const url = `static/data/layer/businessArea.json`
      const geojsonData = await fetch(url).then(response => response.json())
      // console.log('geojsonData', geojsonData)
      // const geojsonData = require('static/data/layer/businessArea.json')

      let params = {
        id: layerId,
        data: geojsonData,
        fillColor: {
          property: 'name',
          type: 'categorical',
          stops: [
            ['一期', '#FF3B74'],
            ['二期', '#1CFF83'],
            ['三期', '#43E0FF']
          ]
        },
        opacity: 0.4,
        borderShow: false,
        symbolValueShow: false
      }
      addFillLayer(params)
    }
  },

  beforeDestroy() {
    // 清除图层
    this.treeList.forEach(item => {
      this.handleCheckChange(item, false)
    })
  }
}
</script>

<style lang="scss" scoped>
.layerToggle-box {
  pointer-events: auto;
  position: absolute;
  right: 20px;
  top: 10px;
  background: rgba(43, 53, 57, 60%);
  border: 1px solid #ffffff80;
  border-radius: 5px;
  padding: 0px 8px 6px 0;
  color: #fff;
  font-size: 20px;
  .title {
    margin: 0 0 0 10px;
    padding-left: 10px;
    border-bottom: 1px solid rgba(32, 160, 255, 0.3);
    background-color: rgba(2, 5, 19, 0.1);
    height: 28px;
    line-height: 30px;
    color: #ffffff;
    font-size: 16px;
  }
  .legend-box {
    position: absolute;
    right: 0px;
    top: 150px;
    width: 216px;
  }
}
</style>

<style lang="scss">
.layerToggle-box {
  // p {
  //   padding: 10px 0;
  //   font-weight: bold;
  //   font-size: 20px;
  //   color: #fff;
  // }

  //el-tree
  //基本
  .el-tree {
    background: #ffffff00;
    color: #ffffff;
  }
  .el-tree-node__content {
    cursor: default;
  }
  //移入
  .el-tree-node__content:hover {
    background-color: #ffffff00;
    // color: #00e2ff;
  }
  //三角
  .el-tree-node__expand-icon {
    // color: #ffffff;
  }
  //文字
  .el-tree-node__label {
    font-size: 14px;
    padding: 0 4px 0 6px;
    &:hover {
      background: rgba(221, 221, 221, 0.3);
    }
  }
  //复选框
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-focus .el-checkbox__inner,
  .el-checkbox__inner {
    background-color: #009cff00;
    border-color: #96bdd0;
    &:hover {
      background-color: #e1ecf2;
      border-color: #96bdd0;
    }
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #a7a7a7;
    border-color: #96bdd0;
  }
  .el-checkbox__inner::after {
    border: 2px solid #4dffff;
    border-left: 0;
    border-top: 0;
    height: 6px;
    left: 3px;
    top: 1px;
  }
  .el-tree-node__content > label.el-checkbox {
    margin-right: 4px;
  }

  .el-checkbox__inner:hover::after {
    border: 2px solid #003040;
    border-left: 0;
    border-top: 0;
    height: 6px;
    left: 3px;
    top: 1px;
  }
  //聚焦
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #ffffff00;
  }
  //高亮
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #ffffff00;
    color: #00e2ff;
  }
}
</style>
