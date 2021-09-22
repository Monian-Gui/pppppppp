<template>
  <div>
    <Panel>
      <div style="height:50px"></div>
      <div>
        <Title>客流量对比</Title>
        <div class="sub-title">
          <Title level="level2" style="width:50%;" color2="#4adbff">交子公园金融商务区</Title>
          <Title level="level2" style="width:50%;" color2="#d23644">{{ functional | functionalName }}</Title>
        </div>
        <div class="flex-box" style="margin-left:20px">
          <div class="index-list">
            <div class="item" v-for="(item, index) in indexList" :key="index">
              <div class="label">
                <i :class="'iconfont ' + item.icon"></i>
                <span>{{ item.name }} ({{ item.unit }})</span>
              </div>
              <div class="flex-box" style="justify-content: space-between;">
                <div class="count" :style="`color: ${item.value[0] >= item.value[1] ? '#ffff00' : '#fff'}`">
                  {{ item.value[0] }}
                </div>
                <div class="count" :style="`color: ${item.value[1] >= item.value[0] ? '#ffff00' : '#fff'}`">
                  {{ item.value[1] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Title>客流画像对比</Title>
        <div class="sub-title">
          <Title level="level2" style="width:50%;" color2="#4adbff">交子公园金融商务区</Title>
        </div>
        <div class="gl-chart-box" style=" height: calc((100vh - 524px) / 2);">
          <PyramidChart></PyramidChart>
        </div>

        <div class="sub-title">
          <Title level="level2" style="width:50%;" color2="#d23644">{{ functional | functionalName }}</Title>
        </div>
        <div class="gl-chart-box" style=" height: calc((100vh - 524px) / 2);">
          <PyramidChart id="Pyramid2"></PyramidChart>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>区县客流来源对比</Title>
        <div class="page-chart-box">
          <BarHorizSignChart :chartData="chartData.district" dataZoom :color="['#4adbff', '#d23644']" />
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>街道客流来源对比</Title>
        <div class="page-chart-box">
          <BarHorizSignChart id="bar2" :chartData="chartData.street" dataZoom :color="['#4adbff', '#d23644']" />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
import api from '@/api/ndApi/economy/flow'
import { removeGeneralLayer, geomDataFormat, add3DGrid, mapOutParam } from '../mapfunc'
import { functionalTable } from 'localData'
export default {
  props: {
    functional: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      indexList: [
        {
          name: '白天客流',
          value: [0, 0],
          unit: '千人',
          icon: 'icon-baitian'
        },
        {
          name: '夜间客流',
          value: [0, 0],
          unit: '千人',
          icon: 'icon-yejian'
        },
        {
          name: '工作日客流',
          value: [0, 0],
          unit: '千人',
          icon: 'icon-riliceshi'
        },
        {
          name: '周末客流',
          value: [0, 0],
          unit: '千人',
          icon: 'icon-zhoumotongyong'
        }
      ],
      chartData: {
        district: {},
        street: {}
      }
    }
  },
  filters: {
    functionalName(id) {
      return functionalTable[id]
    }
  },
  beforeDestroy() {
    removeGeneralLayer('leftMap')
    removeGeneralLayer('rightMap')
  },
  mounted() {
    window.leftMap.flyTo({
      center: mapOutParam.center[0],
      zoom: 9.5
    })
    window.rightMap.flyTo({
      center: mapOutParam.center[1],
      zoom: 9.5
    })
    this.getChartData()
    this.getMapData()
  },
  methods: {
    getChartData() {
      console.log('获取图表数据')
      api.chart.index({}).then(res => {
        const data = res.data.data
        this.indexList[0].value[0] = parseInt(data.workdayDay + data.weekendDay) / 2
        this.indexList[1].value[0] = parseInt(data.workdayNight + data.weekendNight) / 2
        this.indexList[2].value[0] = parseInt(data.workday)
        this.indexList[3].value[0] = parseInt(data.weekend)
        this.$forceUpdate()
      })

      api.chart.index({ id: this.functional }).then(res => {
        const data = res.data.data
        this.indexList[0].value[1] = parseInt(data.workdayDay + data.weekendDay) / 2
        this.indexList[1].value[1] = parseInt(data.workdayNight + data.weekendNight) / 2
        this.indexList[2].value[1] = parseInt(data.workday)
        this.indexList[3].value[1] = parseInt(data.weekend)
        this.$forceUpdate()
      })

      api.map.od({}).then(res => {
        const data = res.data.data
        let district = {
          name: '客流',
          unit: '人',
          value: [
            {
              name: '交子客流',
              data: []
            },
            {
              name: '所选区域客流',
              data: []
            }
          ],
          yAxis: []
        }
        data.sort((a, b) => {
          return b.pop - a.pop
        })
        data.forEach(item => {
          district.value[0].data.push(item.pop)
          district.yAxis.push(item.scale_name)
        })

        api.map.od({ id: this.functional }).then(res2 => {
          const data2 = res2.data.data
          data2.forEach(item => {
            district.value[1].data[district.yAxis.indexOf(item.scale_name)] = item.pop
          })
          this.chartData.district = district
        })
      })

      api.map.od({ spatialScale: 'street' }).then(res => {
        const data = res.data.data
        let street = {
          name: '客流',
          unit: '人',
          value: [
            {
              name: '交子客流',
              data: []
            },
            {
              name: '所选区域客流',
              data: []
            }
          ],
          yAxis: []
        }
        data.sort((a, b) => {
          return b.pop - a.pop
        })
        data.forEach(item => {
          if (item.pop > 0) {
            street.value[0].data.push(item.pop)
            street.yAxis.push(item.scale_name)
          }
        })

        api.map.od({ id: this.functional, spatialScale: 'street' }).then(res2 => {
          const data2 = res2.data.data
          data2.sort((a, b) => {
            return b.pop - a.pop
          })
          const table = {}
          data2.forEach(item => {
            table[item.scale_name] = item.pop
          })
          street.yAxis.forEach(item => {
            street.value[1].data.push(table[item] ? table[item] : 0)
          })
          data2.forEach(item => {
            if (street.yAxis.indexOf(item.scale_name) == -1 && item.pop > 0) {
              street.yAxis.push(item.scale_name)
              street.value[0].data.push(0)
              street.value[1].data.push(item.pop)
            }
          })
          this.chartData.street = street
        })
      })
    },
    getMapData() {
      api.map.grid({}).then(res => {
        const data = res.data.data
        const resData = geomDataFormat({ data, value: 'pop', color: 'pop' })

        let valueList = []
        data.forEach(item => {
          valueList.push(item.pop)
        })

        add3DGrid({
          mapID: 'leftMap',
          data: resData,
          color: [
            [1, '#47f7f4'],
            [8, '#12eaf9'],
            [20, '#2cbafa'],
            [50, '#4591f6'],
            [100, '#5a6bf7'],
            [200, '#6f4cf6'],
            [400, '#8030f9'],
            [800, '#8f19f9']
          ]
        })
      })
      api.map.grid({ id: this.functional }).then(res => {
        const data = res.data.data
        const resData = geomDataFormat({ data, value: 'pop', color: 'pop' })

        let valueList = []
        data.forEach(item => {
          valueList.push(item.pop)
        })
        add3DGrid({
          mapID: 'rightMap',
          data: resData,
          color: [
            [1, '#fa988d'],
            [8, '#f37f70'],
            [20, '#e76356'],
            [50, '#d4453e'],
            [100, '#cc3635'],
            [200, '#b52831'],
            [400, '#9b1c35'],
            [800, '#76132e']
          ]
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
}

.sub-title {
  display: flex;
  margin-top: 5px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #04acb899;
  .row-label {
    width: 28px;
    text-align: center;
    color: #00ffff88;
    font-size: 18px;
    font-weight: bold;
  }
}

.index-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  width: 100%;
  .item {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 2px 0;
    .label {
      font-size: 14px;
      i {
        font-size: 20px;
        margin-right: 5px;
      }
    }
    .count {
      width: 45%;
      padding: 2px 5px;
      color: #ffff00;
      background: rgb(101 101 101 / 40%);
      font-size: 18px;
      font-weight: bold;
      font-family: 'ledNumber';
      letter-spacing: 2px;
      span {
        font-size: 16px;
        font-family: '';
      }
    }
  }
}
.page-chart-box {
  height: calc((100vh - 221px) / 2);
}
</style>
