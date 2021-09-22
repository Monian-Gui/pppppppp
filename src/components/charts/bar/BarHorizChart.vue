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
      default: 'Bar'
    },
    chartData: {
      type: Object,
      default() {
        return {
          name: '',
          unit: '',
          value: [7, 6, 5, 4, 3, 2, 1],
          yAxis: ['y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7']
        }
      }
    },
    // 图表位置 'top,right,bottom,left'
    grid: {
      type: String,
      default: '3,28,5,5'
    },
    // 柱子宽度
    barWidth: {
      type: String,
      default: '12'
    },
    // 颜色
    color: {
      type: String,
      default: config.color[0]
    },
    // 显示百分比
    percent: {
      type: Boolean,
      default: true
    },
    fontLongest: {
      type: Number,
      default: 5
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
    //     if (val && val.value && val.value.length > 0) {
    //       this.show = true
    //       setTimeout(() => {
    //         this.initEchart()
    //       }, 400)
    //     } else {
    //       this.show = false
    //       this.info = '暂无数据'
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
  methods: {
    // 绘制图表
    initEchart() {
      let chartData = this.chartData
      let yAxis = chartData.yAxis
      let grid = format.gridFormat(this.grid)
      let length = yAxis.length
      let sum = 0
      this.chartData.value.forEach(item => {
        sum += parseFloat(item)
      })
      let dataZoomEnd = (1120 / length).toFixed(2) - 1
      if (!chartData.unit) {
        chartData.unit = '无'
      }
      let that = this
      let myChart = document.getElementById(this.id)
      this.myChart = this.$echarts.init(myChart)
      //255 67 67
      let color1 = new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: format.lightColor(this.color, -80) + '00' },
        { offset: 0.2, color: format.lightColor(this.color, -80) + '88' },
        { offset: 1, color: format.lightColor(this.color, -80) }
      ])
      let color2 = new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: format.lightColor(this.color, -60) + '00' },
        { offset: 0.2, color: format.lightColor(this.color, -60) + '88' },
        { offset: 1, color: format.lightColor(this.color, -60) }
      ])
      //44 165 255
      let color3 = new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: format.lightColor(this.color, -40) + '00' },
        { offset: 0.2, color: format.lightColor(this.color, -40) + '88' },
        { offset: 1, color: format.lightColor(this.color, -40) }
      ])
      //44 165 255
      let color = new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: this.color + '00' },
        { offset: 0.2, color: this.color + '88' },
        { offset: 1, color: format.lightColor(this.color, 40) }
      ])
      let seriesArr = [
        {
          name: chartData.name,
          type: 'bar',
          barMinHeight: 50,
          data: chartData.value,
          barWidth: this.barWidth, //柱图宽度
          //圆角渐变设置
          itemStyle: {
            emphasis: {},
            normal: {
              color: function(params) {
                if (params.dataIndex == 0) {
                  return color1
                } else if (params.dataIndex == 1) {
                  return color2
                } else if (params.dataIndex == 2) {
                  return color3
                } else {
                  return color
                }
              },
              barBorderRadius: 5,
              label: {
                show: true, //开启显示
                position: 'right', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#fff',
                  fontSize: 10
                },
                formatter: formatter => {
                  const c = formatter.value
                  if (this.percent) {
                    let p = ((c / sum) * 100).toFixed(2)
                    return `${c}(${p}%)`
                  }
                  return `${c}`
                }
              }
            }
          }
        }
      ]

      this.myChart.setOption({
        // 颜色库
        color: ['#4ADBFF', '#5AF717'],
        //图表位置
        grid,
        textStyle: {
          fontFamily: config.fontFamily
        },
        //滚动条
        dataZoom: {
          id: 'dataZoomY',
          type: 'slider', //滚动类型
          width: 10,
          show: true,
          orient: 'vertical',
          // filterMode: 'empty', //数据过滤模式
          start: 0,
          end: dataZoomEnd,
          textStyle: {
            //滚动条两边的颜色
            color: '#fff'
          },
          backgroundColor: 'rgba(47,69,84,0)', //组件的背景颜色
          zoomLock: true, //锁定区域大小
          moveOnMouseMove: true,
          zoomOnMouseWheel: true,
          top: '5%',
          right: '5%',
          bottom: '15%'
        },

        xAxis: {
          name: '单位(' + chartData.unit + ')',
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          nameTextStyle: {
            align: 'center',
            padding: [0, -45, 5, 0]
          },
          //坐标轴数据
          axisLabel: { show: false },
          //格网线
          splitLine: { show: false },
          // 刻度线
          axisTick: { show: false },
          //格网区域
          splitArea: { show: false }
        },
        //左侧y轴
        yAxis: [
          {
            type: 'category',
            inverse: true, //倒序
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              },
              formatter: value => {
                //过长省略
                return value.length > this.fontLongest ? value.slice(0, this.fontLongest) + '...' : value
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ffffff88'
              }
            },
            data: yAxis,
            nameTextStyle: {
              padding: [2, 10]
            }
          }
        ],
        tooltip: {
          transitionDuration: 0, //解决屏幕抖动bug
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        series: seriesArr
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
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }
      this.resizeTimer = setTimeout(() => {
        this.myChart.resize()
      }, 800)
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
