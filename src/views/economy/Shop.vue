<template>
  <div class="module-contianer">
    <Panel>
      <div class="gl-panel-item">
        <Title>2021店铺数量</Title>
        <div class="flex-box">
          <div class="gl-chart-box" style="width:33.3%;" v-for="(item, index) in indexList" :key="item.name">
            <PoloChart
              :id="'polo' + index"
              :name="item.name"
              titleShow
              :color="item.color"
              radius="75"
              :count="item.value"
              :unit="item.unit"
              :deep="item.value > 100 ? [0.6, 0.65] : [item.value / 100, item.value / 100]"
            ></PoloChart>
          </div>
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>2021店铺类别</Title>
        <div class="gl-chart-box">
          <PieChart
            :chartData="chartData.pie"
            :radius="['20%', '60%']"
            legendType=""
            name="店铺数量"
            unit="家"
            roseType="radius"
          />
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>2021热点区域排行</Title>
        <div class="gl-chart-box">
          <div style="width:100%;height:100%;padding:8px">
            <dv-scroll-board :config="config" style="width:100%;height:100%" :chartData="chartData.bar1" />
          </div>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>2016-2021店铺增长演变</Title>
        <div class="page-chart-box">
          <BarHorizChart
            id="right-polo"
            color="#ffa24b"
            :chartData="chartData.add"
            :percent="false"
            :fontLongest="8"
          ></BarHorizChart>
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>2016-2021店铺消亡演变</Title>
        <div class="page-chart-box">
          <BarHorizChart id="right-pie" color="#4bffd1" :chartData="chartData.sub" :percent="false" :fontLongest="8" />
        </div>
      </div>
    </Panel>

    <div class="btn-box">
      <div style="margin-bottom:8px" v-for="item in btnList" :key="item" @click="btnActive = item">
        <GradualBtn
          size="mini"
          fontSize="15px"
          :shadow="btnActive == item"
          :color="btnActive == item ? '#38a7d1' : '#235783'"
        >
          {{ item }}
        </GradualBtn>
      </div>
    </div>

    <div class="legend-box" v-show="btnActive.indexOf('店铺分布') != -1 || btnActive.indexOf('热点区域') != -1">
      <Legend
        :stops="stops"
        :type="btnActive.indexOf('热点区域') != -1 ? 'area' : 'circle'"
        :label="btnActive.indexOf('热点区域') != -1 ? '>=' : ''"
      ></Legend>
    </div>

    <LayerControl
      :style="
        btnActive.indexOf('店铺分布') != -1 || btnActive.indexOf('热点区域') != -1 ? 'right:533px' : 'right:453px'
      "
    />
  </div>
</template>

<script>
import api from '@/api/ndApi/economy/shop'
import {
  addCircleLayer,
  addHeatLayer,
  addFillLayer,
  removeGeneralLayer,
  mapOutParam,
  getEquivalentStops
} from 'mapfunc'
import { getColorListByCount } from 'tools'

export default {
  data() {
    return {
      btnActive: '2016年店铺分布',
      btnList: [
        '2016年店铺分布',
        '2016年店铺热力',
        '2021年店铺分布',
        '2021年店铺热力',
        '店铺分布热点区域',
        '店铺增长热点区域',
        '店铺消亡热点区域'
      ],
      config: {},
      mapLayer: {
        point: {
          2016: null,
          2021: null
        },
        count: null,
        add: null,
        sub: null
      },
      indexList: [
        {
          name: '店铺数量',
          value: 1234,
          color: '#4ADBFF',
          unit: ''
        },
        {
          name: '增长率',
          value: 80,
          color: '#ffa24b',
          unit: '%'
        },
        {
          name: '消亡率',
          value: 80,
          color: '#4bffd1',
          unit: '%'
        }
      ],
      chartData: {
        pie: [],
        add: {},
        sub: {}
      },
      stops: [],
      pointStops: []
    }
  },
  watch: {
    btnActive: {
      handler(val) {
        console.log(val)
        removeGeneralLayer()
        switch (val) {
          case '2016年店铺分布':
            this.getPointLayer(2016, 'point')
            break
          case '2016年店铺热力':
            this.getPointLayer(2016, 'heat')
            break
          case '2021年店铺分布':
            this.getPointLayer(2021, 'point')
            break
          case '2021年店铺热力':
            this.getPointLayer(2021, 'heat')
            break
          case '店铺分布热点区域':
            this.addHierarchyLayer('count')
            break
          case '店铺增长热点区域':
            this.addHierarchyLayer('add')
            break
          case '店铺消亡热点区域':
            this.addHierarchyLayer('sub')
            break
          default:
            break
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getChartData()
    this.getStops()
  },
  beforeDestroy() {
    window.map.off('click', 'circle_layer', this.clickHandle)
    window.map.off('click', 'circle_layer_symbol', this.clickHandle)
  },
  methods: {
    // 获取图例
    getStops() {
      const categoryList = [
        '美食',
        '宠物',
        '家装',
        '景点',
        '结婚',
        'KTV',
        '购物',
        '教育培训',
        '休闲娱乐',
        '电影',
        '酒店',
        '丽人',
        '生活服务',
        '会议宴会',
        '亲子',
        '医疗健康',
        '爱车',
        '运动健身'
      ]
      const colorList = getColorListByCount(categoryList.length)
      let stops = []
      categoryList.forEach((item, index) => {
        stops.push([item, colorList[index]])
      })
      this.pointStops = stops
      this.stops = stops
    },
    // 获取图表数据
    getChartData() {
      api.chart.index({}).then(res => {
        const data = res.data.data
        this.indexList[0].value = parseInt(data.shopnum)
        this.indexList[1].value = parseFloat((data.rate * 100).toFixed(2))
        this.indexList[2].value = parseFloat((data.derate * 100).toFixed(2))
      })
      api.chart.category({}).then(res => {
        const data = res.data.data
        let pie = []
        let elseCount = 0
        data.forEach((item, index) => {
          if (index < 8) {
            pie.push({
              value: item.count,
              name: item.type
            })
          } else {
            elseCount += item.count
          }
        })
        pie.push({
          value: elseCount,
          name: '其他'
        })
        this.chartData.pie = pie
      })
      api.map.areaCount({}).then(res => {
        const data = res.data.data
        console.log(data)
        let config = {
          data: [],
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          header: ['编号', '名称', '数量', '占比'],
          columnWidth: [45, 65, 115, 65, 70],
          headerBGC: '#00BAFF77',
          index: true,
          carousel: 'page',
          waitTime: 5000,
          align: ['center'],
          rowNum: 6
        }
        let resData = {
          type: 'FeatureCollection',
          features: []
        }
        data.forEach(item => {
          if (item.count >= 10) {
            config.data.push([item.id, item.name, item.count, (item.rate * 100).toFixed(2) + '%'])
          }
          const oneFeatures = {
            type: 'Feature',
            properties: {
              value: item.count,
              color: item.count,
              name: item.id + (item.name ? ' ' + item.name : '')
            },
            geometry: JSON.parse(item.geom)
          }
          resData.features.push(oneFeatures)
        })
        this.config = config

        this.mapLayer.count = resData
      })
      api.map.areaRatio({ type: 'increase' }).then(res => {
        const data = res.data.data
        let add = {
          name: '增长量',
          unit: '家',
          yAxis: [],
          value: []
        }
        let resData = {
          type: 'FeatureCollection',
          features: []
        }
        data.forEach(item => {
          if (item.count > 0) {
            add.yAxis.push(item.name)
            add.value.push(item.count)
          }
          const oneFeatures = {
            type: 'Feature',
            properties: {
              value: item.count,
              color: item.count,
              name: item.id + (item.name ? ' ' + item.name : '')
            },
            geometry: JSON.parse(item.geom)
          }
          resData.features.push(oneFeatures)
        })
        this.chartData.add = add
        this.mapLayer.add = resData
      })
      api.map.areaRatio({ type: 'decrease' }).then(res => {
        const data = res.data.data
        let sub = {
          name: '增长量',
          unit: '家',
          yAxis: [],
          value: []
        }
        let resData = {
          type: 'FeatureCollection',
          features: []
        }
        data.forEach(item => {
          if (item.count > 0) {
            sub.yAxis.push(item.name)
            sub.value.push(item.count)
          }
          const oneFeatures = {
            type: 'Feature',
            properties: {
              value: item.count,
              color: item.count,
              name: item.id + (item.name ? ' ' + item.name : '')
            },
            geometry: JSON.parse(item.geom)
          }
          resData.features.push(oneFeatures)
        })
        this.chartData.sub = sub
        this.mapLayer.sub = resData
      })
    },
    // 获取点位分布
    getPointLayer(year, type) {
      console.log('添加点图层', year, type)
      if (this.mapLayer.point[year]) {
        this.addPointLayer(year, type)
      } else {
        api.map.shopPoint({ year }).then(res => {
          const data = res.data.data
          let layer = {
            type: 'FeatureCollection',
            features: []
          }
          data.forEach(item => {
            const oneFeature = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)]
              },
              properties: item
            }
            oneFeature.properties.value = 10
            oneFeature.properties.name = item.shopname
            oneFeature.properties.color = item.type
            layer.features.push(oneFeature)
          })
          this.mapLayer.point[year] = layer
          this.addPointLayer(year, type)
        })
      }
    },
    // 添加点/热力图层
    addPointLayer(year, type) {
      window.map.off('click', 'circle_layer', this.clickHandle)
      window.map.off('click', 'circle_layer_symbol', this.clickHandle)
      this.stops = this.pointStops

      if (type == 'point') {
        addCircleLayer({
          data: this.mapLayer.point[year],
          color: this.stops,
          color_type: 'categorical',
          symbol: { size: 12, color: 'rgba(255,255,255,0.8)', zoom: [15, 24] },
          value_of_zoom: [9, 0.5, 12, 1, 14, 2, 20, 3]
        })
        setTimeout(() => {
          window.map.on('click', 'circle_layer', this.clickHandle)
          window.map.on('click', 'circle_layer_symbol', this.clickHandle)
        })
      } else if (type == 'heat') {
        addHeatLayer({
          data: this.mapLayer.point[year],
          multiple: 9,
          radius: [7, 10, 10, 15, 15, 30],
          intensity: [7, 1, 10, 4, 15, 10]
        })
      }
    },
    // 点位点击事件
    clickHandle(e) {
      // eslint-disable-next-line
      const coordinates = turf.center(e.features[0]).geometry.coordinates
      let { name, type } = e.features[0].properties
      console.log('触发点击事件')
      type = type && type != 'null' ? type : '--'

      let showInfo = `<div class="makerTop"><h4 class="markerHear" style="text-align: center"> 店铺信息 </h4></div>
                            <div class="markerBody" style="font-size:13px">
                            <p>店铺名称：${name} </p>
                            <p>店铺类型：${type} </p>
                            </div>`

      if (mapOutParam.popup.popup_div) {
        mapOutParam.popup.popup_div.remove()
      }
      // eslint-disable-next-line
      mapOutParam.popup.popup_div = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        className: 'leftpopup',
        offset: [0, -10]
      })
        .setLngLat(coordinates)
        .setHTML(showInfo)
        .addTo(window.map)
    },
    // 添加面分层设色图层
    addHierarchyLayer(type) {
      console.log('添加面图层', type)
      let valueList = []
      this.mapLayer[type].features.forEach(item => {
        valueList.push(item.properties.count)
      })
      const stops = getEquivalentStops({ array: [0, 3, 9, 27, 81, 243, 729], type: 'equivalent' })
      this.stops = stops
      addFillLayer({ data: this.mapLayer[type], color: stops })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
}
.btn-box {
  position: relative;
  left: 460px;
  top: 10px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  align-items: center;
  pointer-events: auto;
}
.legend-box {
  position: fixed;
  right: 420px;
  top: 90px;
}
.page-chart-box {
  height: calc((100vh - 221px) / 2);
}
</style>
