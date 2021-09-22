<template>
  <div class="module-contianer">
    <Panel>
      <div class="panel-btn">
        <div v-for="item in typeList" @click="typeActive = item.value" :key="item.name">
          <GradualBtn
            size="mini"
            fontSize="12px"
            :shadow="typeActive == item.value"
            :color="typeActive == item.value ? '#38a7d1' : '#235783'"
          >
            {{ item.label }}
          </GradualBtn>
        </div>
      </div>
      <div class="gl-panel-item" style="margin-bottom: 0px;">
        <Title>客流总量分析</Title>
        <div class="gl-chart-box" style="height:186px">
          <PoloChart
            id="polo"
            name="客流量"
            radius="65"
            :count="indexList.value"
            :unit="indexList.unit"
            :deep="indexList.deep"
          ></PoloChart>
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>客流辐射距离</Title>
        <Title level="level2">随距离客流变化</Title>
        <div class="page-chart-box2">
          <SupperChart
            id="area"
            type="line"
            smooth
            :areaOpacity="0.5"
            :chartData="chartData.bar"
            dataZoom
            grid="15,5,10,0"
          />
        </div>
        <Title level="level2">随覆盖客流距离变化</Title>
        <div class="page-chart-box2">
          <SupperChart id="area2" type="bar" smooth :areaOpacity="0.5" :chartData="chartData.bar2" />
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>区客流来源排行</Title>
        <div class="page-chart-box">
          <BarHorizChart id="right-polo" :chartData="chartData.district"></BarHorizChart>
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>街道客流来源Top50</Title>
        <div class="page-chart-box">
          <BarHorizChart id="right-pie" :chartData="chartData.street" :fontLongest="8" />
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
          style="width: 120px;"
        >
          {{ item }}
        </GradualBtn>
      </div>
    </div>

    <div class="legend-box" v-if="btnActive == '客流来源' || btnActive == '客流辐射范围'">
      <Legend :stops="stops" :label="btnActive == '客流来源' ? '>=' : '<='" type="area"></Legend>
    </div>

    <LayerControl style="right:563px" />
  </div>
</template>

<script>
import api from '@/api/ndApi/economy/flow'
import {
  removeGeneralLayer,
  geomDataFormat,
  add3DGrid,
  getEquivalentStops,
  addOdLayer,
  mapOutParam,
  removeLayerById,
  addLineLayer,
  addCircleLayer
} from 'mapfunc'
import { getBorderByType } from 'localData'

export default {
  data() {
    return {
      typeActive: 'average',
      typeList: [
        {
          label: '日均',
          value: 'average'
        },
        {
          label: '工作日白天',
          value: 'workdayDay'
        },
        {
          label: '工作日夜间',
          value: 'workdayNight'
        },
        {
          label: '周末白天',
          value: 'weekendDay'
        },
        {
          label: '周末夜间',
          value: 'weekendNight'
        }
      ],
      btnActive: '客流来源',
      btnList: ['客流来源', '区县客流OD', '街道客流OD', '客流辐射范围'],
      indexList: {
        value: 0,
        unit: '人',
        deep: [0.8, 0.85]
      },
      stops: [],
      chartData: {
        bar: {},
        bar2: {},
        district: {},
        street: {}
      },
      count: 0,
      circleData: null
    }
  },
  watch: {
    typeActive: {
      handler() {
        this.getMapData()
        this.getChartData()
      }
    },
    btnActive: {
      handler() {
        this.getMapData()
      },
      immediate: true
    }
  },
  mounted() {
    this.getChartData()
  },
  beforeDestroy() {
    removeLayerById([
      'street_border_symbol',
      'street_border',
      'radiate_circle',
      'radiate_line',
      'radiate_point_symbol',
      'radiate_point',
      'district_fill_symbol',
      'district_fill'
    ])
  },
  methods: {
    getMapData() {
      removeLayerById([
        'street_border_symbol',
        'street_border',
        'radiate_circle',
        'radiate_line',
        'radiate_point_symbol',
        'radiate_point',
        'district_fill_symbol',
        'district_fill'
      ])
      let zoom = 9
      removeGeneralLayer()
      switch (this.btnActive) {
        case '客流来源':
          this.getGridLayer()
          break
        case '区县客流OD':
          this.addDistrictBorder()
          this.getODLayer('district')
          break
        case '街道客流OD':
          this.addStreetBorder()
          this.getODLayer('street')
          zoom = 10.5
          break
        case '客流辐射范围':
          this.getScope()
          zoom = 10.5
          break
        default:
          break
      }
      setTimeout(() => {
        window.map.flyTo({
          center: [104.0750625, 30.5744565],
          zoom
        })
      }, 0)
    },
    getChartData() {
      api.chart.index({}).then(res => {
        const data = res.data.data
        if (this.typeActive == 'average') {
          this.indexList.value = parseInt(data.workday + data.weekend)
        } else {
          if (this.typeActive.indexOf('work') != -1) {
            this.indexList.value = parseInt(data.workday)
          } else {
            this.indexList.value = parseInt(data.weekend)
          }

          if (this.typeActive.indexOf('Day') != -1) {
            this.indexList.value = parseInt(data.workdayDay + data.weekendDay)
          } else {
            this.indexList.value = parseInt(data.workdayNight + data.weekendNight)
          }
        }
      })
      api.map.od({ dayType: this.typeActive, spatialScale: 'district' }).then(res => {
        const data = res.data.data
        console.log(data)
        let district = {
          name: '客流量',
          unit: '人',
          value: [],
          yAxis: []
        }
        data.sort((a, b) => {
          return b.pop - a.pop
        })
        data.forEach(item => {
          if (item.pop > 0) {
            district.value.push(item.pop)
            district.yAxis.push(item.scale_name)
          }
        })
        this.chartData.district = district
      })
      api.map.od({ dayType: this.typeActive, spatialScale: 'street' }).then(res => {
        const data = res.data.data
        let street = {
          name: '客流量',
          unit: '人',
          value: [],
          yAxis: []
        }
        data.sort((a, b) => {
          return b.pop - a.pop
        })
        data.forEach((item, index) => {
          if (item.pop > 0 && index <= 50) {
            street.value.push(item.pop)
            street.yAxis.push(item.scale_name)
          }
        })
        this.chartData.street = street
      })
      api.chart.bar({ dayType: this.typeActive }).then(res => {
        const data = res.data.data
        let bar = {
          name: '客流量',
          unit: '人',
          value: [
            {
              name: '累加',
              data: []
            },
            {
              name: '分段',
              data: []
            }
          ],
          xAxis: []
        }
        let count = 0
        for (let key in data) {
          count += data[key]
          const array = key.split('_')
          const xAxis = array[1] ? `${array[1]}km` : '>=10km'
          if (array[1]) {
            bar.xAxis.push(xAxis)
            bar.value[0].data.push(count)
            bar.value[1].data.push(data[key])
          }
        }
        this.chartData.bar = bar
      })
      api.chart.circle({ dayType: this.typeActive }).then(res => {
        const data = res.data.data
        console.log(data)
        this.circleData = data
        let bar2 = {
          name: '距交子距离',
          unit: 'm',
          data: [],
          xAxis: []
        }
        for (let key in data) {
          const array = key.split('_')
          bar2.xAxis.push(`${array[1]}0%`)
          bar2.data.push(data[key])
        }
        this.chartData.bar2 = bar2
      })
    },
    getGridLayer() {
      console.log('添加格网图层')
      api.map.grid({ dayType: this.typeActive }).then(res => {
        const data = res.data.data
        const resData = geomDataFormat({ data, value: 'pop', color: 'pop' })

        let valueList = []
        let count = 0
        data.forEach(item => {
          count += item.pop
          valueList.push(item.pop)
        })
        console.log('!!!!!!!!总量', count)
        this.stops = getEquivalentStops({ array: valueList })
        add3DGrid({ data: resData, color: this.stops })
        console.log(data)
      })
    },
    getODLayer(spatialScale) {
      console.log('添加OD图层')
      api.map.od({ dayType: this.typeActive, spatialScale }).then(res => {
        const data = res.data.data
        let forList = [['客流来源', [], 'in']],
          table = {}
        table['交子'] = [104.0750625, 30.5744565]
        data.sort((a, b) => {
          return b.pop - a.pop
        })
        data.forEach((item, index) => {
          if (index <= 50) {
            table[item.scale_name] = [item.scale_lon, item.scale_lat]
            forList[0][1].push({ name: item.scale_name, count: item.pop })
          }
        })

        addOdLayer({ forList, table, startName: '交子', unit: '人次' })
      })
    },
    addStreetBorder() {
      getBorderByType('street').then(border => {
        window.map.addSource('street_border', {
          type: 'geojson',
          data: border
        })
        // 主边界
        window.map.addLayer({
          id: 'street_border',
          type: 'line',
          source: 'street_border',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-opacity': 1,
            'line-width': 0.6,
            'line-color': '#319dc7'
          }
        })

        window.map.addLayer({
          id: 'street_border_symbol',
          type: 'symbol',
          source: 'street_border',
          minzoom: 11,
          maxzoom: 24,
          layout: {
            'text-field': '{prevname}',
            'text-font': mapOutParam.textfont,
            'text-size': 12,
            'text-allow-overlap': false,
            'text-offset': [0, 1.2]
          },
          paint: {
            'text-color': '#fff',
            'text-halo-color': '#00192e',
            'text-halo-width': 1
          }
        })
      })
    },
    addDistrictBorder() {
      getBorderByType('district').then(border => {
        window.map.addSource('district_fill', {
          type: 'geojson',
          data: border
        })

        window.map.addLayer({
          id: 'district_fill_symbol',
          type: 'symbol',
          source: 'district_fill',
          layout: {
            'text-field': '{Name}',
            'text-font': mapOutParam.textfont,
            'text-size': 12,
            'text-allow-overlap': false,
            'text-offset': [0, 1.2]
          },
          paint: {
            'text-color': '#fff',
            'text-halo-color': '#00192e',
            'text-halo-width': 1
          }
        })
      })
    },
    getScope() {
      api.map.scope({ dayType: this.typeActive }).then(res => {
        const data = res.data.data
        console.log('获取辐射数据', data)
        const resData = geomDataFormat({ data: data, value: 'pop', color: 'proportion' })
        this.stops = [
          ['10%', 'rgba(131, 230, 255,1)'],
          ['20%', 'rgba(154, 245, 146,1)'],
          ['30%', 'rgba(197, 248, 0,1)'],
          ['40%', 'rgba(255, 255, 0,1)'],
          ['50%', 'rgba(252, 225, 72,1)'],
          ['60%', 'rgba(250, 170, 66,1)'],
          ['70%', 'rgba(255, 113, 47,1)'],
          ['80%', 'rgba(250, 49, 49,1)']
        ]
        add3DGrid({
          data: resData,
          color: [
            [0.1, 'rgba(131, 230, 255,1)'],
            [0.2, 'rgba(154, 245, 146,1)'],
            [0.3, 'rgba(197, 248, 0,1)'],
            [0.4, 'rgba(255, 255, 0,1)'],
            [0.5, 'rgba(252, 225, 72,1)'],
            [0.6, 'rgba(250, 170, 66,1)'],
            [0.7, 'rgba(255, 113, 47,1)'],
            [0.8, 'rgba(250, 49, 49,1)']
          ]
        })
        this.addCircle()
      })
    },
    addCircle() {
      const center = [104.074848, 30.574479]
      // this.addMarker(center)

      let resData = {
          type: 'FeatureCollection',
          features: []
        },
        lineData = {
          type: 'FeatureCollection',
          features: []
        },
        circleData = {
          type: 'FeatureCollection',
          features: []
        }

      for (let key in this.circleData) {
        const array = key.split('_')
        const i = array[1]

        const distance = (this.circleData[key] / 1000).toFixed(2)

        const radius = parseFloat(distance) + 2
        // eslint-disable-next-line
        const circle_1 = turf.circle(center, radius, { steps: 200, units: 'kilometers' })
        const coords = circle_1.geometry.coordinates[0]
        const end = coords[parseInt((coords.length / 8.001) * i)]
        // eslint-disable-next-line
        const line = turf.lineString([center, end], { name: 'line 1' })
        resData.features.push(circle_1)
        lineData.features.push(line)
        circleData.features.push({
          type: 'properties',
          properties: {
            name: `${i}0%-${distance}km`
          },
          geometry: { type: 'Point', coordinates: end }
        })
      }

      setTimeout(() => {
        addLineLayer({
          data: resData,
          id: 'radiate_circle',
          symbolNameShow: false,
          width: 2,
          color: 'rgba(255,255,255,1)',
          opacity: 1
        })
        addLineLayer({ data: lineData, color: '#fff', id: 'radiate_line' })
        addCircleLayer({
          data: circleData,
          id: 'radiate_point',
          opacity: 1,
          symbol: {
            size: 14,
            color: '#ffffff',
            zoom: [8, 24]
          },
          text_allow_overlap: true
        })
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
}
.panel-btn {
  display: flex;
  justify-content: space-around;
}
.btn-box {
  position: relative;
  left: 460px;
  top: 10px;
  width: 120px;
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  align-items: center;
  pointer-events: auto;
}
.count-label {
  font-size: 22px;
  color: #01fefe;
  font-weight: bold;
  padding-top: 10px;
  padding-left: 10px;
  span {
    font-size: 14px;
    color: #fff;
  }
}
.legend-box {
  position: fixed;
  right: 420px;
  top: 90px;
}
.page-chart-box {
  height: calc((100vh - 221px) / 2);
}
.page-chart-box2 {
  height: calc((100vh - 498px) / 2);
  padding-bottom: 10px;
}
</style>
