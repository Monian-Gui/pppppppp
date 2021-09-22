<template>
  <div v-if="show" :id="id" class="echat"></div>
  <div v-else class="echat-err">
    <i v-if="info == '暂无数据'" class="iconfont icon-zanwutubiaoshuju myicon"></i>
    <div class="info">{{ info }}</div>
  </div>
</template>
<script>
import { numberFormat } from 'tools'
import config from '../js/chartConfig.js'
export default {
  props: {
    id: {
      type: String,
      default: 'LoopChart'
    },
    chartData: {
      default() {
        return [
          { value: 50, name: '事件1' },
          { value: 40, name: '事件2' },
          { value: 55, name: '事件3' },
          { value: 30, name: '事件4' },
          { value: 50, name: '事件5' }
        ]
      }
    },
    unit: {
      type: String,
      default: '人'
    },
    name: {
      type: String,
      default: '人口数'
    },
    color: {
      type: Array,
      default() {
        return config.color
      }
    },
    radius: {
      type: Array,
      default() {
        return ['40%', '55%']
      }
    },
    center: {
      type: Array,
      default() {
        return ['70%', '45%']
      }
    },
    borderRadius: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resizeTimer: null,
      show: true,
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
        if (this.chartData && this.chartData.length > 0) {
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
    initEchart() {
      let myChart = document.getElementById(this.id)
      this.myChart = this.$echarts.init(myChart)
      let chartData = JSON.parse(JSON.stringify(this.chartData)) || []
      let num = 0,
        temp
      chartData.map(item => {
        num += parseInt(item.value)
      })
      temp = numberFormat(num)
      let seriesArr = [
        {
          name: this.name,
          type: 'pie',
          radius: this.radius,
          center: this.center,
          itemStyle: {
            normal: {
              borderWidth: 0,
              borderRadius: this.borderRadius
            }
          },
          //提示项文字
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              fontSize: '23',
              fontWeight: 'bold'
            }
          },
          data: chartData
        }
      ]

      let legend = {
        type: 'scroll', //分页类型
        orient: 'vertical',
        top: '12%',
        left: '8%',
        // align: "left",
        itemWidth: 16,
        itemHeight: 14,
        itemGap: 10,
        pageIconColor: '#fff', //翻页按钮的颜色。
        inactiveColor: '#909090d0', //图例关闭时的颜色
        pageIconInactiveColor: '#aaa', //翻页按钮不激活时（即翻页到头时）的颜色。
        pageIconSize: 12,
        pageTextStyle: {
          color: '#eee'
        },
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: name => {
          let num = 0,
            temp
          for (let i = 0, l = chartData.length; i < l; i++) {
            if (chartData[i].name == name) {
              num = chartData[i].value
            }
          }
          temp = numberFormat(num)
          if (name.length > 6) {
            return name.substring(0, 6) + `... ：${num}${this.unit}`
          } else {
            return `${name}：${temp[0]}${temp[1]}`
          }
        }
      }

      this.myChart.setOption({
        color: this.color,
        textStyle: {
          fontFamily: config.fontFamily
        },
        title: {
          text: `总   数 ：${temp[0]}${temp[1]}${this.unit}`,
          right: '13%',
          bottom: 15,
          textStyle: {
            color: '#4adbff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}' + this.unit + '({d}%)',
          transitionDuration: 0 //解决屏幕抖动bug
        },
        series: seriesArr,
        legend
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
      this.myChart.dispose()
    }
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
