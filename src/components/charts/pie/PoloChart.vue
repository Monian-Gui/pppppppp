<template>
  <div v-if="show" :id="id" class="echat"></div>
  <div v-else class="echat-err">
    <i v-if="info == '暂无数据'" class="iconfont icon-zanwutubiaoshuju myicon"></i>
    <div class="info">{{ info }}</div>
  </div>
</template>
<script>
import config from '../js/chartConfig'
import formatUtil from '../js/formatUtil'
import 'echarts-liquidfill'
export default {
  // ? 参数说明
  props: {
    // id:图表唯一标识
    id: {
      type: String,
      default: 'PoloChart'
    },
    // name:用于描述该数据是何数据，出现在移入弹框以及底部title（需要titleShow 为 true 显示）
    name: {
      type: String,
      default: '人口数'
    },
    // count:中间显示的数字
    count: {
      type: Number,
      default: 1234
    },
    // deep:水位的高度，范围为0-1
    deep: {
      type: Array,
      default() {
        return [0.55, 0.5]
      }
    },
    // unit:单位
    unit: {
      type: String,
      default: ''
    },
    // center:图表的位置
    center: {
      type: Array,
      default() {
        return ['50%', '50%']
      }
    },
    // color:使用的颜色组，只使用color[0]
    color: {
      type: String,
      default() {
        return config.color[0]
      }
    },
    // titleShow:是否显示底部title
    titleShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    radius: {
      type: String,
      default() {
        return '50'
      }
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
    // count: {
    //   handler(val) {
    //     if (val) {
    //       this.initEchart()
    //     }
    //   },
    //   deep: true
    // }
    count: {
      handler() {
        if (this.myChart) {
          this.myChart.dispose()
        }
        this.info = '数据获取中...'
        if (this.count) {
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
      let color = this.color
      const radius = this.radius

      function _pie2() {
        let dataArr = []
        for (var i = 0; i < 8; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 25,
              itemStyle: {
                normal: {
                  color: formatUtil.lightColor(color, -20) + '66'
                }
              }
            })
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 20,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }

      let series = [
        {
          type: 'liquidFill',
          radius: radius + '%',
          center: this.center,
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 1,
                  color: formatUtil.lightColor(color, -100)
                },
                {
                  offset: 0,
                  color: color
                }
              ],
              globalCoord: false
            }
          ],
          data: this.deep,
          backgroundStyle: {
            borderWidth: 1,
            color: formatUtil.lightColor(color, -200)
          },
          label: {
            normal: {
              formatter: ` ${this.count}{unit| ${this.unit}}`,
              textStyle: {
                fontSize: 18,
                color: '#fff',
                fontFamily: config.fontFamily
              },
              rich: {
                unit: {
                  fontSize: 14
                }
              }
            }
          },
          outline: {
            show: true,
            itemStyle: {
              borderWidth: 0
            },
            borderDistance: 0
          }
        },
        {
          type: 'pie',
          zlevel: 1,
          silent: true,
          center: this.center,
          radius: [parseInt(radius) + 5 + '%', parseInt(radius) + 4 + '%'],
          hoverAnimation: false,
          color: formatUtil.lightColor(color, -20) + '66',
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [1]
        },
        {
          type: 'pie',
          zlevel: 2,
          silent: true,
          center: this.center,
          radius: [parseInt(radius) + 13 + '%', parseInt(radius) + 10 + '%'],
          startAngle: 50,
          hoverAnimation: false,
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: _pie2()
        },
        {
          type: 'pie',
          zlevel: 3,
          silent: true,
          center: this.center,
          radius: [parseInt(radius) + 8 + '%', parseInt(radius) + 9 + '%'],
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: _pie2()
        }
      ]

      this.myChart.setOption({
        color,
        title: [
          {
            text: this.name,
            x: '50%',
            bottom: '10%',
            textAlign: 'center',
            show: this.titleShow,
            textStyle: {
              fontSize: 14,
              fontWeight: '100',
              color: '#fff'
            }
          }
        ],
        textStyle: {
          fontFamily: config.fontFamily
        },
        tooltip: {
          trigger: 'item',
          formatter: `${this.name} : ${this.count}${this.unit}`,
          transitionDuration: 0, //解决屏幕抖动bug
          confine: true,
          rich: {
            unit: {
              fontSize: 40,
              color: 'red'
            }
          }
        },
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
