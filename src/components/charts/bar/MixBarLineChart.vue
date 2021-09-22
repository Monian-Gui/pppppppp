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
    // 图表id 在同一页面的id必须不同，否则冲突
    id: {
      type: String,
      default: 'MinBarLineChart'
    },
    //传入数据
    chartData: {
      type: Object,
      default() {
        return {
          unit: ['件', '%'],
          value: [
            {
              name: '事件数',
              data: [400, 200, 500, 300, 600]
            },

            {
              name: '增长率',
              data: [20, 18, 22, 25, 10],
              type: 'line',
              yAxisIndex: 1
            }
          ],
          xAxis: ['x1', 'x2', 'x3', 'x4', 'x5']
        }
      }
    },
    //图表类型 可为 bar或line
    type: {
      type: String,
      default: 'bar'
    },
    // 图表位置 'top,right,bottom,left'
    grid: {
      type: String,
      default: '18,5,5,3'
    },
    // 折线图是否为曲线形式
    smooth: {
      type: Boolean,
      default: false
    },
    // 是否显示滚动条
    dataZoom: {
      type: Boolean,
      default: false
    },
    //x轴字体旋转角度
    rotate: {
      type: Number,
      default: 0
    },
    barWidth: {
      type: Number,
      default: 20
    },
    color: {
      type: Array,
      default() {
        return config.color
      }
    },
    leftScope: {
      type: String,
      default() {
        return null
      }
    },
    rightScope: {
      type: String,
      default() {
        return null
      }
    },
    endValue: {
      type: Number,
      default() {
        return 30
      }
    },
    areaOpacity: {
      type: Number,
      default: 0
    },
    linearColor: {
      type: Boolean,
      default: true
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
    chartData: {
      handler() {
        if (this.myChart) {
          this.myChart.dispose()
        }
        this.info = '数据获取中...'
        if (this.chartData && this.chartData.xAxis && this.chartData.xAxis.length > 0) {
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
  methods: {
    // 绘制图表
    initEchart() {
      let myChart = document.getElementById(this.id)
      this.myChart = this.$echarts.init(myChart)

      let chartData = this.chartData
      let color = this.color
      console.log('supper', chartData)

      //格式化
      let grid = format.gridFormat(this.grid)
      let leftScope = format.yAxisScopeFormat(this.leftScope)
      let rightScope = format.yAxisScopeFormat(this.rightScope)

      //单数据与堆叠数据判断
      let series = [],
        legendData = []

      chartData.value.forEach((item, index) => {
        item.type = item.type == undefined ? this.type : item.type
        item.smooth = this.smooth
        item.barWidth = this.barWidth

        item.areaStyle = {
          shadowBlur: 2,
          opacity: this.areaOpacity
        }

        console.log(this.color[index])

        if (this.linearColor) {
          const nowColor = {
            type: 'linear',
            colorStops: [
              {
                offset: 0,
                color: color[index] // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: format.lightColor(color[index], -50) // 0% 处的颜色
              },
              {
                offset: 1,
                color: format.lightColor(color[index], -100) // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
          const emphasis = {
            type: 'linear',
            colorStops: [
              {
                offset: 0,
                color: format.lightColor(color[index], 50) // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: format.lightColor(color[index], -20) // 0% 处的颜色
              },
              {
                offset: 1,
                color: format.lightColor(color[index], -50) // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
          item.itemStyle = {
            color: nowColor
          }
          item.emphasis = {
            itemStyle: {
              color: emphasis
            }
          }
        }

        series.push(item)
        legendData.push(item.name)
      })

      //滚动条
      let dataZoom = [
        {
          disabled: !this.dataZoom,
          type: 'inside',
          startValue: 0,
          endValue: chartData.xAxis.length >= this.endValue ? this.endValue : chartData.xAxis.length
          // endValue: chartData.xAxis.length
        },
        {
          bottom: 10,
          show: this.dataZoom,
          type: 'slider',
          textStyle: {
            color: '#fff',
            fontSize: 8
          },
          height: 10,
          labelFormatter: function(value, time) {
            return time.slice(0, 4) + '\n' + time.slice(5, 10)
          }
        }
      ]
      this.myChart.setOption({
        // 颜色库
        color,
        //滚动条
        dataZoom,
        //图表位置
        grid,
        textStyle: {
          fontFamily: config.fontFamily
        },
        //图例
        legend: {
          selectedMode: chartData.data ? false : true, //取消图例上的点击事件
          right: '12%',
          top: '6%',
          itemGap: 10, // 间隔
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: '#fff', // 图例文字颜色
            fontSize: 12
          },
          data: legendData
        },

        tooltip: {
          transitionDuration: 0, //解决屏幕抖动bug
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: this.type == 'bar' ? 'shadow' : 'line', // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: this.dataZoom == false ? 0 : 'auto',
            rotate: this.rotate,
            textStyle: {
              color: '#fff',
              fontSize: 12
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          boundaryGap: this.type == 'line' ? false : true,
          data: chartData.xAxis
        },
        yAxis: [
          {
            nameTextStyle: { padding: [0, 0, 0, -30] },
            name: chartData.unit[0],
            type: 'value',
            min: leftScope[0],
            max: leftScope[1],
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            offset: '-8',
            //坐标轴数据
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            // 坐标轴在 grid 区域中的分隔线。
            splitLine: {
              lineStyle: {
                color: '#aaa'
              }
            }
          },
          {
            nameTextStyle: { padding: [0, -30, 0, 0], color: '#fff' },
            type: 'value',
            name: chartData.unit[1],
            min: rightScope[0],
            max: rightScope[1],
            // interval: 5,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            // 坐标轴在 grid 区域中的分隔线。
            splitLine: {
              show: false
            }
          }
        ],
        series
      })
      window.addEventListener('resize', this.resize)
    },
    resize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }
      this.resizeTimer = setTimeout(() => {
        this.myChart.resize()
      }, 400)
    }
  },

  beforeDestroy() {
    if (this.myChart) {
      this.myChart.clear()
    }
    window.removeEventListener('resize', this.resize)
  }
}
</script>

<style lang="scss" scoped>
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
