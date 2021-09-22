<template>
  <div class="module-contianer">
    <Panel>
      <div class="top-btn-box">
        <div class="top-but" v-for="(item, i) in topBtnList" :key="i" @click="topButClickHandle(item.value)">
          <GradualBtn
            size="mini"
            fontSize="15px"
            style="width: 84px"
            :shadow="topBtnActive == item.value"
            :color="topBtnActive == item.value ? '#38a7d1' : '#235783'"
          >
            {{ item.label }}
          </GradualBtn>
        </div>
      </div>

      <div class="gl-panel-item">
        <Title>公共基础设施概况</Title>
        <div class="general">
          <div class="round-list">
            <div class="round" style="background: #FD8C08">
              <div class="num">
                {{ gengeral.bus }}
                <span>个</span>
              </div>
              <div class="text">公交车站</div>
            </div>
            <div class="round" style="background: #A9D18E">
              <div class="num">
                {{ gengeral.metro }}
                <span>个</span>
              </div>
              <div class="text">地铁站</div>
            </div>
            <div class="round" style="background: #E860B6">
              <div class="num">
                {{ gengeral.hospital }}
                <span>家</span>
              </div>
              <div class="text">综合医院</div>
            </div>
          </div>

          <div class="round-list">
            <div class="round" style="background: #00ACDF">
              <div class="num">
                {{ gengeral.primarySchool }}
                <span>所</span>
              </div>
              <div class="text">小学</div>
            </div>
            <div class="round" style="background: #134DA7">
              <div class="num">
                {{ gengeral.middleSchool }}
                <span>所</span>
              </div>
              <div class="text">中学</div>
            </div>
            <div class="round" style="background: #00B050">
              <div class="num">
                {{ gengeral.park }}
                <span>个</span>
              </div>
              <div class="text">公园</div>
            </div>
          </div>
        </div>

        <Title>空间覆盖能力分析</Title>
        <Title level="level2">300米范围</Title>
        <div class="index-list">
          <div class="item" v-for="item in info300" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>

            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>

        <Title level="level2">500米范围</Title>
        <div class="index-list">
          <div class="item" v-for="item in info500" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>

            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">1000米范围</Title>
        <div class="index-list">
          <div class="item" v-for="item in info1000" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>

            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>

        <Title level="level2">距离覆盖分析</Title>
        <div class="gl-chart-box" style="height:calc(100vh - 746px)">
          <MixBarLineChart :chartData="chart13" :smooth="true" :rotate="30"></MixBarLineChart>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>15分钟步行生活圈覆盖能力分析</Title>
        <Title level="level2">人口覆盖</Title>
        <div class="index-list">
          <div class="item" v-for="item in infoR1" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>
            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">面积覆盖</Title>
        <div class="index-list">
          <div class="item" v-for="item in infoR2" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>
            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">地块覆盖</Title>
        <div class="index-list">
          <div class="item" style="width:50%" v-for="item in infoR3" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>
            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>

        <Title level="level2">时间覆盖分析</Title>
        <div class="gl-chart-box" style="height:calc(100vh - 719px)">
          <MixBarLineChart :chartData="chartR2" :smooth="true" id="R2" :rotate="30"></MixBarLineChart>
        </div>

        <Title>区域15分钟步行生活圈综合评价</Title>
        <Title level="level2">一期</Title>
        <div class="index-list">
          <div class="item" style="width:50%" v-for="item in infoR4" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>
            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">二期</Title>
        <div class="index-list">
          <div class="item" style="width:50%" v-for="item in infoR5" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>
            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">三期</Title>
        <div class="index-list">
          <div class="item" style="width:50%" v-for="item in infoR6" :key="item.name">
            <div class="label">
              <i :class="'iconfont ' + item.icon"></i>
              <span>{{ item.label }}</span>
            </div>
            <div class="count">
              {{ item.value }}
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </Panel>

    <div class="btn-box">
      <div style="margin-bottom:8px" v-for="item in btnList" :key="item.value">
        <GradualBtn
          size="mini"
          fontSize="15px"
          :shadow="btnActive == item.value"
          :color="btnActive == item.value ? '#38a7d1' : '#235783'"
          style="width: 180px"
        >
          {{ item.label }}
        </GradualBtn>
      </div>
    </div>

    <div class="legend-box" v-show="stops && stops.length > 0">
      <Legend :stops="stops" label="<=" type="area" unit="min"></Legend>
    </div>

    <LayerControl style="right:516px" />
  </div>
</template>

<script>
import store from '@/store'

import { addCircleLayer, addFillLayer, mapOutParam, addLineLayer, removeLayerById, removeGeneralLayer } from 'mapfunc'
export default {
  data() {
    return {
      /* reqData */
      gengeral: {
        bus: '-',
        metro: '-',
        hospital: '-',
        primarySchool: '-',
        middleSchool: '-',
        park: '-'
      },
      info300: null,
      info500: null,
      info1000: null,
      chart13: null,

      infoR1: null,
      infoR2: null,
      infoR3: null,
      chartR2: null,
      infoR4: null,
      infoR5: null,
      infoR6: null,

      layerData: null,

      /* staticData */
      topBtnActive: 'bus',
      topBtnList: [
        {
          label: '公交车站',
          value: 'bus'
        },
        {
          label: '地铁站',
          value: 'metro'
        },
        {
          label: '综合医院',
          value: 'hospital'
        },
        {
          label: '小学',
          value: 'pschool'
        },
        {
          label: '中学',
          value: 'sschool'
        },
        {
          label: '公园',
          value: 'park'
        }
      ],

      btnActive: '15分钟生活圈空间覆盖',
      btnList: [
        {
          label: '15分钟生活圈空间覆盖',
          value: '15分钟生活圈空间覆盖'
        }
      ],
      stops: []
    }
  },
  mounted() {
    this.addWalkBufferLine()
    this.getPoiData()
    this.topButClickHandle(this.topBtnActive)
  },
  methods: {
    dataInit() {
      this.info300 = null
      this.info500 = null
      this.info1000 = null
      this.chart13 = null

      this.infoR1 = null
      this.infoR2 = null
      this.infoR3 = null
      this.chartR2 = null
      this.infoR4 = null
      this.infoR5 = null
      this.infoR6 = null

      this.layerData = null

      removeGeneralLayer()
    },

    topButClickHandle(act) {
      this.dataInit()
      this.topBtnActive = act
      window.map.flyTo({
        center: mapOutParam.center,
        zoom: 12.8,
        pitch: 30
      })

      this.getChartData()
      this.get15SpaceLayerData()
    },
    /* 图表 */
    getPoiData() {
      this.http.get(this.url + `/api/v1/${store.state.functionId}/service/poi`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log(data)
        let gengeral = {
          bus: data.公交站,
          metro: data.地铁站,
          hospital: data.医院,
          primarySchool: data.小学,
          middleSchool: data.中学,
          park: data.公园
        }
        this.gengeral = gengeral
      })
    },

    getChartData() {
      //左2
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/covered`, {})
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          // console.log(data)
          let info300 = [
              { label: '覆盖人口', value: data.radius300.covered, unit: '人', icon: 'icon-renjun' },
              { label: '未覆盖人口', value: data.radius300.uncovered, unit: '人', icon: 'icon-mianji' },
              { label: '人口覆盖率', value: data.radius300.rate, unit: '%', icon: 'icon-shuliang' }
            ],
            info500 = [
              { label: '覆盖人口', value: data.radius500.covered, unit: '人', icon: 'icon-renjun' },
              { label: '未覆盖人口', value: data.radius500.uncovered, unit: '人', icon: 'icon-mianji' },
              { label: '人口覆盖率', value: data.radius500.rate, unit: '%', icon: 'icon-shuliang' }
            ],
            info1000 = [
              { label: '覆盖人口', value: data.radius1000.covered, unit: '人', icon: 'icon-renjun' },
              { label: '未覆盖人口', value: data.radius1000.uncovered, unit: '人', icon: 'icon-mianji' },
              { label: '人口覆盖率', value: data.radius1000.rate, unit: '%', icon: 'icon-shuliang' }
            ]
          this.info300 = info300
          this.info500 = info500
          this.info1000 = info1000
        })

      //左3
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/population`, {})
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          // console.log(data)
          // distance: "0"
          // num: 35
          // rate: 0.03

          let chart13 = {
            unit: ['人', '%'],
            value: [
              {
                name: '人口覆盖数',
                data: [],

                type: 'line'
              },

              {
                name: '人口覆盖率',
                data: [],
                type: 'line',
                yAxisIndex: 1
              }
            ],
            xAxis: []
          }
          data.forEach(item => {
            chart13.value[0].data.push(item.num)
            chart13.value[1].data.push(item.rate)
            chart13.xAxis.push(item.distance + 'm')
          })
          this.chart13 = chart13
        })

      //右11
      this.http
        .get(
          this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/lifeCircle/population/cover`,
          {}
        )
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          // console.log(data)

          let infoR1 = [
            { label: '覆盖人口', value: data.covered, unit: '人', icon: 'icon-renjun' },
            { label: '未覆盖人口', value: data.uncovered, unit: '人', icon: 'icon-mianji' },
            { label: '人口覆盖率', value: data.rate, unit: '%', icon: 'icon-shuliang' }
          ]
          this.infoR1 = infoR1
        })
      //右12
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/lifeCircle/area/cover`, {})
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          // console.log(data)
          let infoR2 = [
            { label: '覆盖面积', value: data.covered, unit: '㎡', icon: 'icon-mianji1' },
            { label: '未覆盖面积', value: data.uncovered, unit: '㎡', icon: 'icon-mianji' },
            { label: '空间覆盖率', value: data.rate, unit: '%', icon: 'icon-renjunmianji' }
          ]
          this.infoR2 = infoR2
        })

      //右13
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/lifeCircle/region/cover`, {})
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data[0]
          // console.log(data)
          let infoR3 = [
            { label: '覆盖地块数', value: data.covered, unit: '个', icon: 'icon-mianji1' },
            { label: '未覆盖地块数', value: data.uncovered, unit: '个', icon: 'icon-mianji' }
          ]
          this.infoR3 = infoR3
        })

      //右2

      this.http
        .get(
          this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/lifeCircle/population/order`,
          {}
        )
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          console.log(data)
          // minute: "1"
          // num: 3231
          // rate: 3.05
          let chartR2 = {
            unit: ['人', '%'],
            value: [
              {
                name: '人口覆盖数',
                data: [],

                type: 'line'
              },

              {
                name: '人口覆盖率',
                data: [],
                type: 'line',
                yAxisIndex: 1
              }
            ],
            xAxis: []
          }
          data.forEach(item => {
            chartR2.value[0].data.push(item.num)
            chartR2.value[1].data.push(item.rate)
            chartR2.xAxis.push(item.minute + 'min  ')
          })
          this.chartR2 = chartR2
        })

      //右3
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/service/${this.topBtnActive}/lifeCircle/phase/statistic`, {})
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          console.log(data)
          let infoR4 = [
              { label: '人口覆盖度占比', value: data[0].populationRate, unit: '%', icon: 'icon-renjun' },
              { label: '面积覆盖度占比', value: data[0].areaRate, unit: '%', icon: 'icon-mianji1' }
            ],
            infoR5 = [
              { label: '人口覆盖度占比', value: data[1].populationRate, unit: '%', icon: 'icon-renjun' },
              { label: '面积覆盖度占比', value: data[1].areaRate, unit: '%', icon: 'icon-mianji1' }
            ],
            infoR6 = [
              { label: '人口覆盖度占比', value: data[2].populationRate, unit: '%', icon: 'icon-renjun' },
              { label: '面积覆盖度占比', value: data[2].areaRate, unit: '%', icon: 'icon-mianji1' }
            ]
          this.infoR4 = infoR4
          this.infoR5 = infoR5
          this.infoR6 = infoR6
        })
    },

    /* 地图 */
    //  缓冲区外圈
    async addWalkBufferLine() {
      const url = 'static/data/walk15/walk15Border.json'
      const geojsonData = await fetch(url).then(response => response.json())
      console.log(geojsonData)
      // console.log('geojsonData', geojsonData)
      let params = {
        id: 'walk15Line',
        data: geojsonData,
        width: 2,
        color: '#06c3cd',
        opacity: 1
      }
      addLineLayer(params)
    },
    //15分钟空间覆盖
    get15SpaceLayerData() {
      let layerId = 'fill_layer'
      removeLayerById(layerId)
      window.map.addSource(layerId, {
        type: 'vector',
        tiles: ['http://81.68.104.27:7086/maps/jiaozi_poi/{z}/{x}/{y}.pbf']
      })

      this.stops = [
        [1, 'rgb(52, 176, 0)'],
        [2, 'rgb(108, 219, 31)'],
        [3, 'rgb(129, 185, 82)'],
        [4, 'rgb(139, 167, 23)'],
        [5, 'rgb(167, 183, 28)'],
        [6, 'rgb(254, 203, 0)'],
        [7, 'rgb(211, 167, 10)'],
        [8, 'rgb(219, 149, 41)'],
        [9, 'rgb(219, 126, 39)'],
        [10, 'rgb(222, 80, 3)'],
        [11, 'rgb(203, 36, 0)'],
        [12, 'rgb(223, 1, 0)'],
        [13, 'rgb(170, 5, 0)'],
        [14, 'rgb(124, 3, 0)'],
        [15, 'rgb(90, 3, 0)']
      ]
      let mapStops = [
        [1 * 60, 'rgb(52, 176, 0)'],
        [2 * 60, 'rgb(108, 219, 31)'],
        [3 * 60, 'rgb(129, 185, 82)'],
        [4 * 60, 'rgb(139, 167, 23)'],
        [5 * 60, 'rgb(167, 183, 28)'],
        [6 * 60, 'rgb(254, 203, 0)'],
        [7 * 60, 'rgb(211, 167, 10)'],
        [8 * 60, 'rgb(219, 149, 41)'],
        [9 * 60, 'rgb(219, 126, 39)'],
        [10 * 60, 'rgb(222, 80, 3)'],
        [11 * 60, 'rgb(203, 36, 0)'],
        [12 * 60, 'rgb(223, 1, 0)'],
        [13 * 60, 'rgb(170, 5, 0)'],
        [14 * 60, 'rgb(124, 3, 0)'],
        [15 * 60, 'rgb(90, 3, 0)']
      ]
      let fillColor = {
        property: 'contourmax',
        stops: mapStops
      }

      window.map.addLayer(
        {
          id: layerId,
          type: 'fill',
          source: layerId,
          'source-layer': `tile_${this.topBtnActive}_buffer`,
          paint: {
            'fill-color': fillColor,
            'fill-opacity': 0.8
          }
        },
        'jiaozi_border'
      )
      this.getPoiLayerdata()
    },
    get15SpaceLayerData2() {
      this.http
        .get(`static/data/walk15/${this.topBtnActive}.json`, {})
        .then(res => {
          if (!res) {
            return
          }
          const data = res.data
          console.log(data)
          this.stops = [
            [1, 'rgb(52, 176, 0)'],
            [2, 'rgb(108, 219, 31)'],
            [3, 'rgb(129, 185, 82)'],
            [4, 'rgb(139, 167, 23)'],
            [5, 'rgb(167, 183, 28)'],
            [6, 'rgb(254, 203, 0)'],
            [7, 'rgb(211, 167, 10)'],
            [8, 'rgb(219, 149, 41)'],
            [9, 'rgb(219, 126, 39)'],
            [10, 'rgb(222, 80, 3)'],
            [11, 'rgb(203, 36, 0)'],
            [12, 'rgb(223, 1, 0)'],
            [13, 'rgb(170, 5, 0)'],
            [14, 'rgb(124, 3, 0)'],
            [15, 'rgb(90, 3, 0)']
          ]
          let mapStops = [
            [1 * 60, 'rgb(52, 176, 0)'],
            [2 * 60, 'rgb(108, 219, 31)'],
            [3 * 60, 'rgb(129, 185, 82)'],
            [4 * 60, 'rgb(139, 167, 23)'],
            [5 * 60, 'rgb(167, 183, 28)'],
            [6 * 60, 'rgb(254, 203, 0)'],
            [7 * 60, 'rgb(211, 167, 10)'],
            [8 * 60, 'rgb(219, 149, 41)'],
            [9 * 60, 'rgb(219, 126, 39)'],
            [10 * 60, 'rgb(222, 80, 3)'],
            [11 * 60, 'rgb(203, 36, 0)'],
            [12 * 60, 'rgb(223, 1, 0)'],
            [13 * 60, 'rgb(170, 5, 0)'],
            [14 * 60, 'rgb(124, 3, 0)'],
            [15 * 60, 'rgb(90, 3, 0)']
          ]
          let fillColor = {
            property: 'ContourMax',
            stops: mapStops
          }
          addFillLayer({
            data,
            color: '#03FFA7',
            borderShow: false,
            symbolShow: false,
            fillColor,
            opacity: 0.8,
            underLayerId: 'jiaozi_border'
            // filter: ['==', 'ContourMax', 10 * 60]
          })
          this.getPoiLayerdata()
        })
        .catch(() => {
          this.getPoiLayerdata()
        })
    },
    //poi
    getPoiLayerdata() {
      this.http.get(`static/data/poi/${this.topBtnActive}.json`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data
        console.log(data)
        let params = {
          data,
          color: 'red',
          value: 4,
          aboveId: 'fill_layer'
        }
        addCircleLayer(params)
      })
    }
  },
  beforeDestroy() {
    removeLayerById('walk15Line')
  }
}
</script>

<style lang="scss" scoped>
//left
.top-btn-box {
  margin: 0 0 0px 10px;
  .top-but {
    margin-right: 20px;
    margin-bottom: 10px;
    display: inline-block;
  }
}

.general {
  padding: 0 20px 20px;
  .round-list {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .round {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .num {
        font-size: 20px;
        font-weight: 700;
      }
      span {
        font-size: 12px;
      }
    }
  }
}

.index-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  width: 100%;
  margin: 4px 0;
  .item {
    width: 33.3%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid #ffffff88;
    box-sizing: border-box;
    padding-left: 10px;
    .label {
      margin-bottom: 4px;
      i {
        font-size: 20px;
      }
      span {
        padding-left: 6px;
        font-size: 12px;
      }
    }

    .count {
      font-family: 'ledNumber';
      padding-left: 6px;
      margin-right: 10px;
      color: #00ffff;
      font-size: 20px;
      font-weight: bold;
      background: rgb(101 101 101 / 40%);
      letter-spacing: 2px;
      span {
        font-size: 14px;
        font-family: none;
      }
    }
  }
}
//mid
.btn-box {
  position: relative;
  left: 440px;
  top: 10px;
  width: 150px;
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
</style>
