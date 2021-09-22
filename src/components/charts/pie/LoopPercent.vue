<template>
  <div v-if="show" :id="id" class="echat"></div>
  <div v-else class="echat-err">
    <i
      v-if="info == '暂无数据'"
      class="iconfont icon-zanwutubiaoshuju myicon"
    ></i>
    <div class="info">{{ info }}</div>
  </div>
</template>
<script>
import config from "../js/chartConfig.js";
export default {
  props: {
    id: {
      type: String,
      default: "LoopPercent",
    },
    diy: {
      type: Boolean,
      default: true,
    },
    chartData: {
      default() {
        return {
          insideLabel: "(单位)",
          middleLabel: "",
          value: 6,
          value1: 10,
        };
      },
    },
    color: {
      type: String,
      default: "#4ADBFF",
    },
    radius: {
      type: Number,
      default: 35,
    },
  },
  data() {
    return {
      resizeTimer: null,
      show: true,
      info: "数据获取中...",
    };
  },
  watch: {
    chartData: {
      handler(e) {
        console.log(e);
        if (this.myChart) {
          this.myChart.dispose();
        }
        this.info = "数据获取中...";
        if (this.chartData && this.chartData.value) {
          this.show = true;
          setTimeout(() => {
            this.initEchart();
          }, 400);
        } else {
          this.show = false;
          this.info = "暂无数据";
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 总体分析
    initEchart() {
      let _this = this;
      let myChart = document.getElementById(this.id);
      this.myChart = this.$echarts.init(myChart);
      let data = this.chartData;
      let stylData = []; //放进度条百分比
      let titleArr = [],
        seriesArr = [],
        colors = [`${this.color}ee`, `${this.color}66`, `${this.color}22`]; //主题色、外圈色、右进度色

      let percent = ((data.value / data.value1) * 100).toFixed(0); // 百分比
      if (data.value < data.value1) {
        //百分比小于100的时候
        let num = ((data.value / data.value1) * 75).toFixed(2);
        let num1 = 75 - num;
        stylData = [25, num, num1];
      } else {
        //百分比大于100的时候 全显示
        stylData = [25, 75, 0];
      }

      seriesArr.push(
        // 内圈+数字
        {
          name: "内圈",
          type: "pie",
          hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
          radius: [0, this.radius + "%"], //饼图的半径 数组的第一项是内半径，第二项是外半径
          label: {
            normal: {
              show: true,
              position: "center",
              color: "#fff",
              textStyle: {
                fontSize: 16,
                color: "#fff",
              },
              formatter: function () {
                // return data.middleLabel + percent + "%";
                if (_this.diy) {
                  return `\n\n{count|${data.value}}\n\n{label|${data.insideLabel}}`;
                } else {
                  return `\n{count|${data.value}}\n{label|${data.insideLabel}}`;
                }
              },
              offsetCenter: ["0%", "0%"],
              rich: {
                count: {
                  fontSize: 16,
                  height: 100,
                  // padding: [0, 0, 100, 0],
                },
                label: {
                  fontSize: 14,
                  // padding: [100, 0, 0, 0],
                },
              },
            },
          },
          labelLine: {
            normal: {
              show: true,
            },
          },
          center: ["50%", 32 + 17 + "%"],
          data: [
            {
              value: 0,
              itemStyle: {
                normal: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors[1] },
                    { offset: 0.6, color: colors[2] },
                    { offset: 1, color: "rgba(9, 32, 68, 0.247)" },
                  ]),
                },
              },
            },
          ],
        },
        // 进度数据
        {
          name: "数据",
          type: "pie",
          startAngle: 315,
          radius: [
            parseInt(this.radius) + 10 + "%",
            parseInt(this.radius) + 18 + "%",
          ],
          legendHoverLink: false,
          hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: "inside",
              textStyle: {
                fontSize: 14,
                color: "#fff",
              },
              formatter: function () {
                return data.middleLabel + percent + "%";
              },
            },
            emphasis: {
              //鼠标进入显示数据
              show: false,
              textStyle: {
                fontSize: 20, //调整字体大小
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: stylData[0],
              itemStyle: {
                normal: {
                  color: "rgba(0,0,0,0)",
                },
              },
              label: {
                normal: {
                  show: false, //隐藏第一段数据
                },
              },
            },
            {
              value: stylData[1],
              itemStyle: {
                normal: {
                  color: colors[0],
                },
              },
            },
            {
              value: stylData[2],
              itemStyle: {
                normal: {
                  color: colors[2],
                },
                emphasis: {
                  color: colors[2],
                },
              },
              label: {
                normal: {
                  show: false, //隐藏第三段数据
                },
              },
            },
          ],
          center: ["50%", 32 + 17 + "%"],
        },
        // 外圈
        {
          name: "外圈",
          type: "pie",
          startAngle: 315,
          hoverAnimation: false,
          radius: [
            parseInt(this.radius) + 22 + "%",
            parseInt(this.radius) + 24 + "%",
          ],
          label: {
            normal: {
              show: false,
              position: "center",
            },
            emphasis: {
              color: colors[2],
            },
          },
          labelLine: {
            normal: {
              show: true,
            },
          },
          data: [
            {
              value: 25,
              itemStyle: {
                normal: {
                  color: "rgba(0,0,0,0)",
                },
              },
            },
            {
              value: 75,
              itemStyle: {
                normal: {
                  color: colors[1],
                },
              },
            },
          ],
          center: ["50%", 32 + 17 + "%"],
        }
      );
      this.myChart.setOption({
        title: titleArr,
        textStyle: {
          fontFamily: config.fontFamily,
        },
        tooltip: {
          trigger: "axis",
          transitionDuration: 0, //解决屏幕抖动bug
        },
        series: seriesArr,
      });
      window.addEventListener("resize", function () {
        _this.myChart.resize();
      });
    },
    resize() {
      let _this = this;
      if (_this.resizeTimer) {
        clearTimeout(_this.resizeTimer);
      }
      _this.resizeTimer = setTimeout(function () {
        _this.myChart.resize();
      }, 400);
    },
  },

  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    window.removeEventListener("resize", this.resize);
  },
};
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
