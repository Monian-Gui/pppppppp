<template>
  <div class="module-contianer">
    <Panel>
      <div class="gl-panel-item">
        <Title>居住、就业人口分析</Title>

        <Title level="level2">居住、就业人口总量</Title>

        <div class="index-list">
          <div class="item" v-for="item in textInfo" :key="item.name">
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

        <Title level="level2">居住人口画像</Title>
        <div class="gl-chart-box" style="height:calc((100vh - 239px) / 2 + 20px)">
          <PyramidChart :chartData="livePyram"></PyramidChart>
        </div>

        <Title level="level2">就业人口画像</Title>
        <div class="gl-chart-box" style="height:calc((100vh - 239px) / 2 + 20px)">
          <PyramidChart id="left3" :chartData="workPyram"></PyramidChart>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>职住通勤分析</Title>

        <Title level="level2">区通勤排行</Title>
        <div class="gl-chart-box" style="height:calc((100vh - 239px) / 3 + 20px)">
          <BarHorizChart :chartData="districtList"></BarHorizChart>
        </div>

        <Title level="level2">街道通勤排行</Title>
        <div class="gl-chart-box" style="height:calc((100vh - 239px) / 3 + 20px)">
          <BarHorizChart id="right2" :chartData="streetList"></BarHorizChart>
        </div>

        <Title level="level2">就业人口随距离变化</Title>
        <div class="gl-chart-box" style="height:calc((100vh - 239px) / 3 - 40px)">
          <SupperChart id="more2" type="line" smooth :areaOpacity="0.5" :chartData="distanceChart" :dataZoom="true" />
        </div>
      </div>
    </Panel>

    <div class="btn-box">
      <div style="margin-bottom:8px" v-for="item in btnList" :key="item" @click="butClickHandle(item)">
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

    <div class="legend-box">
      <Legend :stops="stops" label=">=" type="area" unit="人"></Legend>
    </div>
    <LayerControl style="right:516px" />
  </div>
</template>

<script>
import store from '@/store'
import { geomDataFormat, add3DGrid, getEquivalentStops, mapOutParam } from 'mapfunc'
export default {
  data() {
    return {
      /* reqData */
      textInfo: [
        { label: '居住人口总量', value: '0', icon: 'icon-juminjuzhudilunkuo', unit: '人' },
        { label: '就业人口总量', value: '0', icon: 'icon-jiuye', unit: '人' }
      ],
      livePyram: null,
      workPyram: null,
      districtList: {
        unit: '',
        name: '',
        value: [],
        yAxis: []
      },
      streetList: {
        unit: '',
        name: '',
        value: [],
        yAxis: []
      },
      distanceChart: {
        unit: '',
        name: '',
        data: [],
        xAxis: []
      },

      /* staticData */
      btnActive: '居住人口工作地',
      btnList: ['居住人口工作地', '工作人口居住地'],
      stops: []
    }
  },
  mounted() {
    this.getAllChart()
    this.butClickHandle(this.btnActive)
  },
  methods: {
    butClickHandle(act) {
      this.btnActive = act

      window.map.flyTo({
        center: mapOutParam.center,
        zoom: 11,
        pitch: 30
      })
      this.getGridData()
    },

    getAllChart() {
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/population/workToResidence/everything`, {})
        .then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          console.log('getAllChart', data)

          // 居住、就业人口总量
          this.textInfo[0].value = data.populationCount.resNum
          this.textInfo[1].value = data.populationCount.workNum

          // 人口画像
          let livePyram = {
              value: [
                {
                  name: '男',
                  value: []
                },
                {
                  name: '女',
                  value: []
                }
              ],

              yAxis: []
            },
            workPyram = JSON.parse(JSON.stringify(livePyram))

          data.populationShape.res.male.forEach(item => {
            livePyram.value[0].value.push(-item.num)
            livePyram.yAxis.push(item.age_type)
          })
          data.populationShape.res.female.forEach(item => {
            livePyram.value[1].value.push(item.num)
          })
          data.populationShape.work.male.forEach(item => {
            workPyram.value[0].value.push(-item.num)
            workPyram.yAxis.push(item.age_type)
          })
          data.populationShape.work.female.forEach(item => {
            workPyram.value[1].value.push(item.num)
          })

          this.livePyram = livePyram
          this.workPyram = workPyram

          // 通勤排行
          let districtList = {
              name: '通勤人数',
              unit: '人',
              value: [],
              yAxis: []
            },
            streetList = JSON.parse(JSON.stringify(districtList))
          let district = data.populationCommute.district
          let street = data.populationCommute.street
          district.forEach(item => {
            districtList.value.push(item.num)
            districtList.yAxis.push(item.name)
          })
          street.forEach(item => {
            streetList.value.push(item.num)
            streetList.yAxis.push(item.name)
          })
          this.districtList = districtList
          this.streetList = streetList

          // 就业人口随距离变化
          //TODO
          let distanceChart = {
            unit: '人',
            name: '通勤人数',
            data: [],
            xAxis: []
          }
          data.populationDistance.forEach(item => {
            distanceChart.data.push(item.num)
            distanceChart.xAxis.push(item.distance + 'km')
          })
          this.distanceChart = distanceChart
        })
    },

    getGridData() {
      this.http
        .get(this.url + `/api/v1/${store.state.functionId}/population/workToResidence/distribute`, {})
        .then(res => {
          let data = null

          switch (this.btnActive) {
            case '居住人口工作地':
              data = res.data.data.workGridsByResidence
              break
            case '工作人口居住地':
              data = res.data.data.residenceGridsByWork
              break
          }

          // color: undefined
          // functionId: null
          // gridId: "345966"
          // num: 5
          // value: undefined
          const resData = geomDataFormat({ data, value: 'num', color: 'num' })

          let valueList = []
          data.forEach(item => {
            valueList.push(item.value)
          })
          this.stops = getEquivalentStops({ array: valueList })
          console.log(this.stops)
          add3DGrid({ data: resData, color: this.stops })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  width: 80%;
  margin: 4px 0;
  .item {
    width: 50%;
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
</style>
