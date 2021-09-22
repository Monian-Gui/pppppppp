<template>
  <div>
    <Panel>
      <div style="height:50px"></div>
      <div>
        <Title>优势区域对比</Title>
        <div class="sub-title" style="padding-left:40px">
          <Title level="level2" style="width:50%" color2="#4adbff">交子公园金融商务区</Title>
          <Title level="level2" style="width:50%" color2="#d23644">{{ functional | functionalName }}</Title>
        </div>
        <div class="index-list" style="padding:10px 0">
          <div class="item" v-for="(item, index) in indexList" :key="index">
            <div class="label">{{ item.name }}</div>
            <div class="count-box">
              <div class="count" :style="`color: ${item.value[0] >= item.value[1] ? '#ffff00' : '#fff'}`">
                {{ item.value[0] }}%
              </div>
              <div class="count" :style="`color: ${item.value[1] >= item.value[0] ? '#ffff00' : '#fff'}`">
                {{ item.value[1] }}%
              </div>
            </div>
          </div>
        </div>
        <Title level="level2">热点区县</Title>
        <div class="page-chart-box">
          <div style="width:100%;height:100%">
            <dv-scroll-board :config="config" style="width:100%;height:100%" />
          </div>
        </div>
        <Title level="level2">热点街道</Title>
        <div class="page-chart-box">
          <div style="width:100%;height:100%">
            <dv-scroll-board :config="config2" style="width:100%;height:100%" />
          </div>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>客流渗透对比</Title>
        <div class="sub-title">
          <Title level="level2" style="width:50%" color2="#4adbff">交子公园金融商务区</Title>
          <Title level="level2" style="width:50%" color2="#d23644">{{ functional | functionalName }}</Title>
        </div>
        <div class="flex-box" style=" flex-wrap: wrap;">
          <div class="gl-chart-box" style="width:50%;height:14vh" v-for="(item, index) in pieList" :key="item.name">
            <LoopPercent :id="'polo' + index" radius="60" :chartData="item" />
          </div>
        </div>
      </div>

      <div style="margin-top:18px">
        <Title>客流辐射范围对比</Title>
        <div class="gl-chart-box">
          <SupperChart id="more" type="line" :chartData="moreData" smooth rotate="20" :color="['#4adbff', '#d23644']" />
        </div>
        <div class="gl-chart-box">
          <SupperChart id="more2" type="line" :chartData="moreData2" smooth :color="['#4adbff', '#d23644']" />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
import api from '@/api/ndApi/economy/comparison'
import fApi from '@/api/ndApi/economy/flow'
import { add3DGrid, mapOutParam, removeGeneralLayer } from '../mapfunc'
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
      moreData: {},
      moreData2: {},
      indexList: [
        {
          name: '区县',
          value: ['0', '0']
        },
        {
          name: '街道',
          value: ['0', '0']
        },
        {
          name: '面积',
          value: ['0', '0']
        },
        {
          name: '人口',
          value: ['0', '0']
        }
      ],
      config: {},
      config2: {},
      pieList: [
        {
          insideLabel: '竞品居住人口\n到访交子',
          middleLabel: '',
          value: 6,
          value1: 10
        },
        {
          insideLabel: '交子居住人口\n到访竞品',
          middleLabel: '',
          value: 6,
          value1: 10
        },
        {
          insideLabel: '竞品工作人口\n到访交子',
          middleLabel: '',
          value: 6,
          value1: 10
        },
        {
          insideLabel: '交子工作人口\n到访竞品',
          middleLabel: '',
          value: 6,
          value1: 10
        }
      ]
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
      api.chart.index({ toFunctionId: this.functional }).then(res => {
        const data = res.data.data
        console.log(data)
        function float(a) {
          return parseFloat((a * 100).toFixed(2))
        }
        this.indexList[0].value = [float(data.selfDistrictRate), float(data.opponentDistrictRate)]
        this.indexList[1].value = [float(data.selfStreetRate), float(data.opponentStreetRate)]
        this.indexList[2].value = [float(data.selfGridRate), float(data.opponentGridRate)]
        this.indexList[3].value = [float(data.selfPopulationRate), float(data.opponentPopulationRate)]

        let config = {
          header: ['名称', '交子客流', '所选区域客流'],
          data: [],
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          columnWidth: [45],
          index: true,
          headerBGC: '#00BAFF77',
          carousel: 'page',
          waitTime: 5000,
          align: ['center'],
          rowNum: 7
        }
        data.advantageDistricts.forEach(item => {
          config.data.push([item.name, item.rate1 + '%', item.rate2 + '%'])
        })
        let config2 = {
          header: ['名称', '交子客流', '所选区域客流'],
          data: [],
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          columnWidth: [45],
          index: true,
          headerBGC: '#00BAFF77',
          carousel: 'page',
          waitTime: 5000,
          align: ['center'],
          rowNum: 7
        }
        data.advantageStreets.forEach(item => {
          config2.data.push([item.name, item.rate1 + '%', item.rate2 + '%'])
        })
        this.config = config
        this.config2 = config2
      })
      api.chart.pie({ toFunctionId: this.functional }).then(res => {
        const data = res.data.data
        this.pieList[0].value = data.functionLivePopulationOut
        this.pieList[0].value1 = data.functionLivePopulation
        this.pieList[1].value = data.toFunctionLivePopulationOut
        this.pieList[1].value1 = data.toFunctionLivePopulation
        this.pieList[2].value = data.functionWorkPopulationOut
        this.pieList[2].value1 = data.functionWorkPopulation
        this.pieList[3].value = data.toFunctionWorkPopulationOut
        this.pieList[3].value1 = data.toFunctionWorkPopulation
      })
      fApi.chart.bar({}).then(res => {
        const data = res.data.data
        let more = {
          name: '客流量',
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
          xAxis: []
        }
        let count = 0
        for (let key in data) {
          count += data[key]
          const array = key.split('_')
          const xAxis = array[1] ? `${array[1]}km` : '>=10km'
          if (array[1] && array[1] % 2 == 1) {
            more.xAxis.push(xAxis)
            more.value[0].data.push(count)
          }
        }

        fApi.chart.bar({ id: this.functional }).then(res2 => {
          const data2 = res2.data.data
          let count2 = 0
          for (let key in data2) {
            count2 += data2[key]
            more.value[1].data.push(count2)
          }
          this.moreData = more
        })
      })

      fApi.chart.circle({ dayType: this.typeActive }).then(res => {
        const data = res.data.data
        console.log(data)
        this.circleData = data
        let more2 = {
          name: '距交子距离',
          unit: 'm',
          value: [
            {
              name: '距交子距离',
              data: []
            },
            {
              name: '距所选区域距离',
              data: []
            }
          ],
          xAxis: []
        }
        for (let key in data) {
          const array = key.split('_')
          more2.xAxis.push(`${array[1]}0%`)
          more2.value[0].data.push(data[key])
        }
        fApi.chart.circle({ id: this.functional }).then(res2 => {
          const data2 = res2.data.data
          for (let key in data) {
            more2.value[1].data.push(data2[key])
          }

          this.moreData2 = more2
        })
      })
    },
    getMapData() {
      api.map.grid({ toFunctionId: this.functional }).then(res => {
        const data = res.data.data
        let leftData = {
            type: 'FeatureCollection',
            features: []
          },
          rightData = {
            type: 'FeatureCollection',
            features: []
          }
        data.forEach(item => {
          leftData.features.push({
            type: 'Feature',
            properties: {
              value: item.num,
              color: item.functionId == 'E17' ? item.num : 0
            },
            geometry: JSON.parse(item.geom)
          })
          rightData.features.push({
            type: 'Feature',
            properties: {
              value: item.num,
              color: item.functionId == 'E17' ? 0 : item.num
            },
            geometry: JSON.parse(item.geom)
          })
        })

        add3DGrid({
          mapID: 'leftMap',
          data: leftData,
          color: [
            [0, 'rgba(220,220,220,0.3)'],
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
        add3DGrid({
          mapID: 'rightMap',
          data: rightData,
          color: [
            [0, 'rgba(220,220,220,0.3)'],
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
  padding-top: 8px;
  .item {
    width: 100%;
    display: flex;
    padding: 2px 0;
    font-size: 14px;

    .label {
      width: 32px;
      text-align: center;
      color: #00ffff88;
      font-size: 16px;
      font-weight: bold;
      margin-right: 20px;
    }
    .count-box {
      width: calc(100% - 52px);
      align-items: center;
      justify-content: space-between;
      display: flex;
    }
    .count {
      width: 46%;
      padding-left: 5px;
      color: #ffff00;
      background: rgb(101 101 101 / 40%);
      font-size: 18px;
      font-weight: bold;
      font-family: 'ledNumber';
      letter-spacing: 2px;
      span {
        font-size: 16px;
      }
    }
  }
}
.page-chart-box {
  height: calc((100vh - 378px) / 2);
}
</style>
