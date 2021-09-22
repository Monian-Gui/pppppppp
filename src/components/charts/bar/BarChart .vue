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
// import format from "../js/formatUtil.js";
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
          name: "",
          unit: "万",
          value: [
            {
              name: "数量1",
              data: [400, 200, 500, 300, 600],
              stack: "1",
            },
            {
              name: "数量2",
              data: [100, 50, 60, 80, 30],
            },
          ],
          xAxis: ["y1", "y2", "y3", "y4", "y5"],
        };
      },
    },
    // 图表位置 'top,right,bottom,left'
    grid: {
      type: String,
      default: "3,28,5,5",
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
    // 柱子颜色
    colors: {
      type: Array,
      default() {
        return ["#19A3F8", "#0E58A0", "#F9E59F", "#CC9550"];
      },
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
          this.chartData.xAxis &&
          this.chartData.xAxis.length > 0
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
      let myChart = document.getElementById(this.id);
      this.myChart = this.$echarts.init(myChart);
      let colors = this.colors;
      let chartData = this.chartData;
      let legenddata = chartData.value.map(v=>v.name)
      let seriesArr = [
        {
          name: chartData.value[0].name,
          type: "bar",
          yAxisIndex:1,
          data: chartData.value[0].data,
          barWidth: "20",
          itemStyle: {
            normal: {
              label: {
                //标签显示位置
                color: "#fff",
                fontSize: 12,
                show: true,
                position: "top", //insideTop 或者横向的 insideLeft
                formatter: (v) => {
                  return v.value + "%";
                },
              },
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colors[0], // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colors[1], // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
        {
          name: chartData.value[1].name,
          type: "bar",
          smooth:true,
          data:  chartData.value[1].data,
          barWidth: "20",
          itemStyle: {
            normal: {
              label: {
                //标签显示位置
                color: "#fff",
                fontSize: 12,
                show: true,
                position: "top", //insideTop 或者横向的 insideLeft
                formatter: (v) => {
                  return v.value + "%";
                },
              },
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colors[2], // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colors[3], // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
      ];

      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
           icon: 'circle',
          data: legenddata,
          align: "left",
           x: "center",
          top: "10%",
          textStyle: {
            color: "#C9ECF5",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: chartData.xAxis,
            axisLabel: {
              color: "#C9ECF5",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "(" + chartData.unit + ")",
            nameTextStyle: {
              color: "#C9ECF5",
            },
            axisLabel: {
              formatter: "{value}",
              color: "#C9ECF5",
              textStyle: {
                color: "#C9ECF5",
              },
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: "#C9ECF5",
                type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
              },
              show: false, //隐藏或显示
            },
          },
          {
            type: "value",
            name: "(" + chartData.unit + ")",
            nameTextStyle: {
              color: "#C9ECF5",
            },
            axisLabel: {
              formatter: "{value}",
              color: "#C9ECF5",
              textStyle: {
                color: "#C9ECF5",
              },
            },
            splitLine: {
              //网格线
              lineStyle: {
                color: "#C9ECF5",
                type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, //隐藏或显示
            },
          },
        ],
        series: seriesArr,
      });
      window.addEventListener("resize", this.resize);

      // if (this.clickStatus) {
      //   this.myChart.on("click", function (params) {
      //     that.clickStatus = false;
      //     that.clickHandle(params.name);
      //   });
      // }
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
