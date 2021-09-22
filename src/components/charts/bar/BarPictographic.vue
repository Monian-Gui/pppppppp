<template>
  <div v-if="show" class="echat">
    <div :id="id" style="width: 100%; height: 100%"></div>
    <div class="titles">{{ chartData.name }}</div>
  </div>
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
      default: "Bar",
    },
    chartData: {
      type: Object,
      default() {
        return {
          value: [10],
          yAxis: ["y1"],
        };
      },
    },
    // 图表位置 'top,right,bottom,left'
    grid: {
      type: String,
      default: "3,28,5,5",
    },
    // 柱子颜色
    colors: {
      type: Array,
      default() {
        return ["#DBEB63", "#0BBF03", "#121B24", "#172130"];
      },
    },
    // 柱子宽度
    barWidth: {
      type: String,
      default: "12",
    },
    // 颜色
    color: {
      type: String,
      default: config.color[0],
    },
    // 显示百分比
    percent: {
      type: Boolean,
      default: true,
    },
    fontLongest: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      resizeTimer: null,
      show: false,
      info: "数据获取中...",
    };
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
          this.myChart.dispose();
        }
        this.info = "数据获取中...";
        if (
          this.chartData &&
          this.chartData.yAxis &&
          this.chartData.yAxis.length > 0
        ) {
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
    // 绘制图表
    initEchart() {
      let chartData = this.chartData;
      let yAxis = chartData.value;
      let xData = chartData.yAxis;
      let colors = this.colors;
      let that = this;
      let myChart = document.getElementById(this.id);
      this.myChart = this.$echarts.init(myChart);
      //255 67 67

      let seriesArr = [
        {
          name: "",
          type: "bar",
          barWidth: 16,
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colors[0],
                },
                {
                  offset: 1,
                  color: colors[1],
                },
              ]),
            },
          },
          data: yAxis,
          z: 10,
          zlevel: 0,
        },
        {
          // 分隔
          type: "pictorialBar",
          itemStyle: {
            normal: {
              color: "#0A1928",
            },
          },

          symbolRepeat: "fixed",
          symbolMargin: [4],
          symbol: "rect",
          symbolClip: true,
          symbolSize: [20, 3],
          symbolPosition: "start",
          symbolOffset: [0, 0],
          data: [100],
          width: 0,
          z: 0,
          zlevel: 1,
        },
        {
          name: "外框",
          type: "bar",
          barGap: "-100%", // 设置外框粗细
          data: [100],
          barWidth: 16,
          itemStyle: {
            normal: {
              color: "rgba(65, 158, 255, 0.2)", // 填充色
              // barBorderRadius: 0, //圆角半径
              label: {
                // 标签显示位置
                color:"#fff",
                show: true,
                position: "top", // insideTop 或者横向的 insideLeft
                formatter: () => {
                  return yAxis[0] + "%";
                },
              },
            },
          },
          z: 0,
        },

        // {
        //   name: "",
        //   type: "pictorialBar", //设置类型为象形柱状图
        //   symbol: "rect", //
        //   symbolRepeat: true, //图形是否重复
        //   symbolSize: [12, 6], //图形元素的尺寸
        //   barWidth: "11%", //
        //   barMaxWidth: "20%", //最大宽度
        //   symbolMargin: "3", //图形垂直间隔
        //   zlevel: 11,
        //   itemStyle: {
        //     normal: {
        //       label: {
        //         //标签显示位置
        //         color: "#fff",
        //         fontSize: 12,
        //         show: false,
        //         position: "top", //insideTop 或者横向的 insideLeft
        //         formatter: (v) => {
        //           return v.value + "%";
        //         },
        //       },
        //       color: {
        //         type: "linear",
        //         x: 0,
        //         y: 0,
        //         x2: 0,
        //         y2: 1,
        //         colorStops: [
        //           {
        //             offset: 0,
        //             color: colors[0], // 0% 处的颜色
        //           },
        //           {
        //             offset: 1,
        //             color: colors[1], // 100% 处的颜色
        //           },
        //         ],
        //         global: false, // 缺省为 false
        //       },
        //     },
        //   },
        //   z: 99999,
        //   emphasis: {
        //     itemStyle: {
        //       color: "#FFAD5C",
        //     },
        //   },

        //   data: yAxis, //Y轴数据
        //   animationEasing: "elasticOut", //动画效果
        // },
        // {
        //   name: "",
        //   type: "pictorialBar", //设置类型为象形柱状图
        //   symbol: "rect", //
        //   symbolRepeat: true, //图形是否重复
        //   symbolSize: [12, 6], //图形元素的尺寸
        //   barWidth: "11%", //
        //   barMaxWidth: "20%", //最大宽度
        //   symbolMargin: "3", //图形垂直间隔
        //   zlevel: 11,
        //   itemStyle: {
        //     normal: {
        //       label: {
        //         //标签显示位置
        //         color: "#fff",
        //         fontSize: 12,
        //         show: true,
        //         position: "top", //insideTop 或者横向的 insideLeft
        //         formatter: () => {
        //           return yAxis[0] + "%";
        //         },
        //       },
        //       color: {
        //         type: "linear",
        //         x: 0,
        //         y: 0,
        //         x2: 0,
        //         y2: 1,
        //         colorStops: [
        //           {
        //             offset: 0,
        //             color: "rgba(65, 158, 255, 0.3)", // 0% 处的颜色
        //           },
        //           {
        //             offset: 1,
        //             color: "rgba(65, 158, 255, 0.3)", // 100% 处的颜色
        //           },
        //         ],
        //         global: false, // 缺省为 false
        //       },
        //     },
        //   },
        //   label: {
        //     normal: {
        //       label: {
        //         show: false,
        //       },
        //     },
        //   },
        //   z: 1,
        //   emphasis: {
        //     itemStyle: {
        //       color: "#FFAD5C",
        //     },
        //   },

        //   data: [100], //Y轴数据
        //   animationEasing: "elasticOut", //动画效果
        // },
      ];

      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          position: "top",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff",
            },
          },
          formatter: (params) => {
            return params[0].data + "人";
          },
        },
        grid: [
          {
            //设置边距
            left: 20,
            bottom: 65,
            top: 65,
            right: 20,
          },
        ],
        yAxis: {
          //Y轴配置
          show: false,
          axisLine: {
            show: false,
            lineStyle: {
              //隐藏Y轴
              opacity: 0,
            },
          },
          axisTick: {
            //隐藏刻度
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#24354C",
            },
          },
          axisLabel: {
            //Y轴文字
            show: true,
            color: "#6E8399",
            fontSize: 12,
          },
        },
        xAxis: {
          //X轴配置
          data: xData, //X轴数据
          show: false,
          axisLabel: {
            //X轴文字样式
            color: "#fff",
            fontSize: 12,
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: "#6E8399",
            },
            show: true,
          },
          axisTick: {
            show: false,
          },
        },
        series: seriesArr,
      });
      window.addEventListener("resize", this.resize);

      if (this.clickStatus) {
        this.myChart.on("click", function (params) {
          that.clickStatus = false;
          that.clickHandle(params.name);
        });
      }
    },

    resize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.myChart.resize();
      }, 800);
    },
  },

  beforeDestroy() {
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
  position: relative;
  .titles {
    position: absolute;
    z-index: 1000000;
    bottom: 12%;
    left: 50%;
    height: 20px;
    font-size: 14px;
    transform: translate(-50%, 0);
  }
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
