<template>
  <div>
    <Panel>
      <div style="height:50px"></div>
      <div>
        <Title>店铺发展对比</Title>
        <div class="sub-title">
          <Title level="level2" style="width:50%;" color2="#4adbff">交子公园金融商务区</Title>
          <Title level="level2" style="width:50%;" color2="#d23644">{{ functional | functionalName }}</Title>
        </div>
        <div class="flex-box" style="margin:0 20px">
          <div class="index-list">
            <div class="item" v-for="(item, index) in indexList[0]" :key="index">
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
        <Title>购物中心发展对比</Title>
        <div class="sub-title" style="margin-left:10px">
          <Title level="level2" style="width:50%;" color2="#4adbff">交子公园金融商务区</Title>
          <Title level="level2" style="width:50%;" color2="#d23644">{{ functional | functionalName }}</Title>
        </div>
        <div class="row">
          <div class="row-label">发展现状</div>
          <div class="flex-box row-content" style="margin:0 20px">
            <div class="index-list">
              <div class="item" v-for="(item, index) in indexList[1]" :key="index">
                <div class="label">
                  <i :class="'iconfont ' + item.icon"></i>
                  <span>{{ item.name }}</span>
                </div>
                <div class="flex-box" style="justify-content: space-between;">
                  <div class="count" :style="`color: ${item.value[0] >= item.value[1] ? '#ffff00' : '#fff'}`">
                    {{ item.value[0] }}
                    <span>{{ item.unit }}</span>
                  </div>
                  <div class="count" :style="`color: ${item.value[1] >= item.value[0] ? '#ffff00' : '#fff'}`">
                    {{ item.value[1] }}
                    <span>{{ item.unit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="row-label">发展历程</div>
          <div class="flex-box row-content" style="margin:0 20px">
            <div class="index-list">
              <div class="item" v-for="(item, index) in indexList[2]" :key="index">
                <div class="label">
                  <i :class="'iconfont ' + item.icon"></i>
                  <span>{{ item.name }}</span>
                </div>
                <div class="flex-box" style="justify-content: space-between;">
                  <div class="count" :style="`color: ${item.value[0] >= item.value[1] ? '#ffff00' : '#fff'}`">
                    {{ item.value[0] }}
                    <span>{{ item.unit }}</span>
                  </div>
                  <div class="count" :style="`color: ${item.value[1] >= item.value[0] ? '#ffff00' : '#fff'}`">
                    {{ item.value[1] }}
                    <span>{{ item.unit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="row-label">发展趋势</div>
          <div class="flex-box row-content" style="margin:0 20px">
            <div class="index-list">
              <div class="item" v-for="(item, index) in indexList[3]" :key="index">
                <div class="label">
                  <i :class="'iconfont ' + item.icon"></i>
                  <span>{{ item.name }}</span>
                </div>
                <div class="flex-box" style="justify-content: space-between;">
                  <div class="count" :style="`color: ${item.value[0] >= item.value[1] ? '#ffff00' : '#fff'}`">
                    {{ item.value[0] }}
                    <span>{{ item.unit }}</span>
                  </div>
                  <div class="count" :style="`color: ${item.value[1] >= item.value[0] ? '#ffff00' : '#fff'}`">
                    {{ item.value[1] }}
                    <span>{{ item.unit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>店铺结构对比</Title>
        <div class="gl-chart-box" style="height: calc(75vh - 221px);">
          <BarHorizSignChart id="category0" :chartData="chartData.category0" :color="['#4adbff', '#d23644']" dataZoom />
        </div>
      </div>
      <div class="gl-panel-item" v-if="indexList[1][0].value[1]">
        <Title>购物中心签约业态对比</Title>
        <div class="gl-chart-box" style="height:25vh">
          <SupperChart id="category1" :chartData="chartData.category" :color="['#4adbff', '#d23644']" />
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

    <div class="legend-box">
      <Legend :stops="stops" type="circle"></Legend>
    </div>
  </div>
</template>

<script>
import api from '@/api/ndApi/economy/shop'
import pApi from '@/api/ndApi/economy/project'
import { removeGeneralLayer, addCircleLayer, addHeatLayer, mapOutParam } from '../mapfunc'
import { getColorListByCount } from 'tools'
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
      btnActive: '店铺分布',
      btnList: ['店铺分布', '店铺热力'],
      indexList: {
        0: [
          {
            name: '店铺数量',
            value: [0, 0],
            unit: '个',
            icon: 'icon-shuliang'
          },
          {
            name: '店铺增长率',
            value: [0, 0],
            unit: '%',
            icon: 'icon-shangsheng'
          },
          {
            name: '店铺消亡率',
            value: [0, 0],
            unit: '%',
            icon: 'icon-8fall'
          }
        ],
        1: [
          {
            name: '购物中心数量',
            value: [0, 0],
            unit: '个',
            icon: 'icon-shuliang'
          },
          {
            name: '购物中心面积',
            value: [0, 0],
            unit: '万m²',
            icon: 'icon-mianji1'
          }
        ],
        2: [
          {
            name: '近3年新增数量',
            value: [0, 0],
            unit: '个',
            icon: 'icon-shuliang'
          },
          {
            name: '近3年新增面积',
            value: [0, 0],
            unit: '万m²',
            icon: 'icon-mianji1'
          }
        ],
        3: [
          {
            name: '未来3年新增数量',
            value: [0, 0],
            unit: '个',
            icon: 'icon-shuliang'
          },
          {
            name: '未来3年新增面积',
            value: [0, 0],
            unit: '万m²',
            icon: 'icon-mianji1'
          }
        ]
      },
      mapLayer: {
        leftMap: null,
        rightMap: null
      },
      chartData: {
        category0: {},
        category: {}
      },
      stops: []
    }
  },
  filters: {
    functionalName(id) {
      return functionalTable[id]
    }
  },
  watch: {
    btnActive: {
      handler() {
        removeGeneralLayer('leftMap')
        removeGeneralLayer('rightMap')
        this.getMapData()
      },
      immediate: true
    }
  },
  mounted() {
    this.getChartData()
    this.getStops()
  },
  beforeDestroy() {
    removeGeneralLayer('leftMap')
    removeGeneralLayer('rightMap')
    window.leftMap.flyTo({
      center: mapOutParam.center[0],
      zoom: 13.8
    })
    window.rightMap.flyTo({
      center: mapOutParam.center[1],
      zoom: 11
    })
  },
  methods: {
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
      this.stops = stops
    },
    getChartData() {
      console.log('获取图表数据')
      api.chart.index({}).then(res => {
        const data = res.data.data
        this.indexList[0][0].value[0] = parseInt(data.shopnum)
        this.indexList[0][1].value[0] = (data.rate * 100).toFixed(2)
        this.indexList[0][2].value[0] = (data.derate * 100).toFixed(2)
        this.$forceUpdate()
      })

      api.chart.index({ functionId: this.functional }).then(res => {
        const data = res.data.data
        this.indexList[0][0].value[1] = parseInt(data.shopnum)
        this.indexList[0][1].value[1] = (data.rate * 100).toFixed(2)
        this.indexList[0][2].value[1] = (data.derate * 100).toFixed(2)
        this.$forceUpdate()
      })

      pApi.chart.mallIndex().then(res => {
        const data = res.data.data
        console.log('本品', data)
        this.indexList[1][0].value[0] = parseInt(data.count_open)
        this.indexList[1][1].value[0] = parseFloat(data.count_open_area)
        this.indexList[2][0].value[0] = parseInt(data.count_open_area_threeyear)
        this.indexList[2][1].value[0] = parseFloat(data.count_open_area_threeyear)
        this.indexList[3][0].value[0] = parseFloat(data.count_not_opened)
        this.indexList[3][1].value[0] = parseFloat(data.count_not_open_area)
        this.$forceUpdate()
      })

      pApi.chart.mallIndex(this.functional).then(res => {
        const data = res.data.data
        console.log('竞品', data)
        this.indexList[1][0].value[1] = parseInt(data.count_open)
        this.indexList[1][1].value[1] = parseFloat(data.count_open_area)
        this.indexList[2][0].value[1] = parseInt(data.count_open_area_threeyear)
        this.indexList[2][1].value[1] = parseFloat(data.count_open_area_threeyear)
        this.indexList[3][0].value[1] = parseFloat(data.count_not_opened)
        this.indexList[3][1].value[1] = parseFloat(data.count_not_open_area)
        this.$forceUpdate()
      })

      api.chart.category({}).then(res => {
        const data = res.data.data
        let category = {
          name: '项目数量',
          unit: '个',
          value: [
            {
              name: '交子项目',
              data: []
            },
            {
              name: '所选区域项目',
              data: []
            }
          ],
          yAxis: []
        }
        data.forEach(item => {
          category.yAxis.push(item.type)
          category.value[0].data.push(item.count)
        })
        api.chart.category({ functionId: this.functional }).then(res2 => {
          const data2 = res2.data.data
          console.log(data2)
          const table = {}

          data2.forEach(item => {
            table[item.type] = item.count
          })
          category.yAxis.forEach(item => {
            category.value[1].data.push(table[item] ? table[item] : 0)
          })
          data2.forEach(item => {
            if (category.yAxis.indexOf(item.type) == -1) {
              console.log(item.type)
              category.yAxis.push(item.type)
              category.value[0].data.push(0)
              category.value[1].data.push(item.count)
            }
          })
          this.chartData.category0 = category
          console.log(this.chartData.category0)
        })
      })

      pApi.chart.type().then(res => {
        const data = res.data.data
        let category = {
          name: '项目数量',
          unit: '个',
          value: [
            {
              name: '交子项目',
              data: []
            },
            {
              name: '所选区域项目',
              data: []
            }
          ],
          xAxis: []
        }
        data.forEach(item => {
          category.xAxis.push(item.type)
          category.value[0].data.push(item.count)
        })

        pApi.chart.type(this.functional).then(res2 => {
          const data2 = res2.data.data
          console.log(data2)
          const table = {}
          data2.forEach(item => {
            table[item.type] = item.count
          })
          category.xAxis.forEach(item => {
            category.value[1].data.push(table[item] ? table[item] : 0)
          })
          data2.forEach(item => {
            if (category.xAxis.indexOf(item.type) == -1) {
              category.xAxis.push(item.type)
              category.value[0].data.push(0)
              category.value[1].data.push(item.count)
            }
          })
          this.chartData.category = category
        })
      })
    },
    getMapData() {
      if (!this.mapLayer.leftMap) {
        api.map.shopPoint({ year: 2021 }).then(res => {
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
          this.mapLayer.leftMap = layer
          this.addPointLayer('leftMap')
        })
      } else {
        this.addPointLayer('leftMap')
      }
      if (!this.mapLayer.rightMap) {
        api.map.shopPoint({ functionId: this.functional, year: 2021 }).then(res => {
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
          this.mapLayer.rightMap = layer
          this.addPointLayer('rightMap')
        })
      } else {
        this.addPointLayer('rightMap')
      }
    },
    addPointLayer(mapID) {
      if (this.btnActive == '店铺分布') {
        addCircleLayer({
          mapID,
          data: this.mapLayer[mapID],
          color: this.stops,
          color_type: 'categorical',
          symbol: { size: 12, color: 'rgba(255,255,255,0.8)', zoom: [15, 24] },
          value_of_zoom: [9, 0.5, 12, 1, 14, 2, 20, 3]
        })
      } else if (this.btnActive == '店铺热力') {
        addHeatLayer({
          mapID,
          data: this.mapLayer[mapID],
          multiple: 9,
          radius: [7, 10, 10, 15, 15, 30],
          intensity: [7, 1, 10, 4, 15, 10]
        })
      }
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

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px dashed #04acb899;
  padding: 5px 0;
  &:nth-last-child(1) {
    border-bottom: none;
  }
  .row-label {
    width: 28px;
    text-align: center;
    color: #00ffff88;
    font-size: 18px;
    font-weight: bold;
  }
  .row-content {
    width: 100%;
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
    height: calc((100vh - 397px) / 9);
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
.legend-box {
  position: fixed;
  right: 400px;
  top: 90px;
}
</style>
