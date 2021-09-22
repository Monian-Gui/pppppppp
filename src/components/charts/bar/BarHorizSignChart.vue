<template>
  <div v-if="show" :id="id" class="echat"></div>
  <div v-else class="echat-err">
    <i v-if="info == '暂无数据'" class="iconfont icon-zanwutubiaoshuju myicon"></i>
    <div class="info">{{ info }}</div>
  </div>
</template>

<script>
import format from '../js/formatUtil.js'
import config from '../js/chartConfig.js'
export default {
  props: {
    id: {
      type: String,
      default: 'BarHorizSignChart'
    },
    chartData: {
      type: Object,
      default() {
        return {
          name: '事件数',
          unit: '件',
          value: [
            {
              name: '数量1',
              data: [400, 200, 500, 300, 600],
              stack: '1'
            },
            {
              name: '数量2',
              data: [400, 200, 500, 300, 600]
            },
            {
              name: '数量3',
              data: [400, 200, 500, 300, 600]
            },
            {
              name: '数量4',
              data: [400, 123, 500, 325, 600],
              stack: '1'
            }
          ],
          yAxis: ['啦啦啦市', 'x2', 'x3', 'x4', 'x5']
        }
      }
    },
    color: {
      type: Array,
      default() {
        return config.color
      }
    },
    // 图表位置 'top,right,bottom,left'
    grid: {
      type: String,
      default: '10,10,3,3'
    },
    //x轴字体旋转角度
    rotate: {
      type: String,
      default: '0'
    },
    // 是否显示滚动条
    dataZoom: {
      type: Boolean,
      default: false
    },
    barWidth: {
      type: String,
      default: '8'
    }
  },
  data() {
    return {
      resizeTimer: null,
      show: false,
      info: '数据获取中...'
    }
  },
  watch: {
    // chartData: {
    //   handler(val) {
    //     if (this.myChart) {
    //       this.myChart.dispose()
    //     }

    //     this.info = '数据获取中...'
    //     if (val.value && val.value.length > 0) {
    //       this.show = true
    //       setTimeout(() => {
    //         this.initEchart()
    //       }, 0)
    //     } else {
    //       this.show = false
    //       setTimeout(() => {
    //         if (!val.value || val.value.length == 0) {
    //           this.info = '暂无数据'
    //         }
    //       }, 30000)
    //     }
    //   },
    //   deep: true
    // }
    chartData: {
      handler() {
        if (this.myChart) {
          this.myChart.dispose()
        }
        this.info = '数据获取中...'
        if (this.chartData && this.chartData.yAxis && this.chartData.yAxis.length > 0) {
          this.show = true
          setTimeout(() => {
            this.initEchart()
          }, 400)
        } else {
          this.show = false
          this.info = '暂无数据'
        }
      },
      deep: true,
      immediate: true
    }
  },
  // mounted() {
  //   if (this.chartData.data || this.chartData.value) {
  //     this.show = true
  //     setTimeout(() => {
  //       this.initEchart()
  //     }, 0)
  //   } else {
  //     this.show = false
  //   }
  // },

  methods: {
    // 绘制图表
    initEchart() {
      if (this.myChart) {
        this.myChart.dispose()
      }
      let chartData = this.chartData
      if (!chartData.unit) {
        chartData.unit = '无'
      }
      let that = this
      let myChart = document.getElementById(this.id)
      this.myChart = this.$echarts.init(myChart)
      let grid = format.gridFormat(this.grid)

      let legendData = []

      chartData.value.map(item => {
        item.barWidth = this.barWidth
        item.type = 'bar'
        legendData.push(item.name)
      })

      this.myChart.setOption({
        // 颜色库
        color: this.color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        textStyle: {
          fontFamily: config.fontFamily
        },
        grid,
        legend: {
          data: legendData,
          textStyle: {
            //滚动条两边的颜色
            color: '#fff'
          },
          top: '1.5%'
        },
        //滚动条
        dataZoom: {
          id: 'dataZoomY',
          type: 'slider', //滚动类型
          width: 10,
          show: this.dataZoom,
          startValue: 0,
          endValue: 10,
          orient: 'vertical',
          filterMode: 'none', //数据过滤模式
          // startValue: 0,
          // endValue: 10,
          textStyle: {
            //滚动条两边的颜色
            color: '#fff'
          },
          backgroundColor: 'rgba(47,69,84,0)', //组件的背景颜色
          zoomLock: true, //锁定区域大小
          moveOnMouseMove: true,
          zoomOnMouseWheel: true,
          top: '8%',
          right: '4%',
          bottom: '10%'
        },
        xAxis: [
          {
            name: chartData.unit,
            type: 'value',
            axisLabel: {
              rotate: this.rotate
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            // 坐标轴在 grid 区域中的分隔线。
            splitLine: {
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            inverse: true, //倒序
            axisTick: {
              show: false
            },
            data: chartData.yAxis,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ffffff88'
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              },
              formatter: function(value) {
                //过长省略
                return value.length > 5 ? value.slice(0, 5) + '...' : value
              }
            }
          }
        ],
        series: chartData.value
      })
      window.addEventListener('resize', this.resize)

      if (this.clickStatus) {
        this.myChart.on('click', function(params) {
          that.clickStatus = false
          that.clickHandle(params.name)
        })
      }
    },

    resize() {
      let that = this
      if (that.resizeTimer) {
        clearTimeout(that.resizeTimer)
      }
      that.resizeTimer = setTimeout(function() {
        that.myChart.resize()
      }, 400)
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
}
.echat {
  width: 100%;
  height: 100%;
}
.echat-err {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8f8f8f;
  font-size: 16px;
  .myicon {
    font-size: 42px;
  }
  .info {
    margin-top: -2px;
  }
}
</style>
