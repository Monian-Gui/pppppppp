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
export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          value: [
            {
              name: "男",
              value: [-2, -3, -6, -7, -4, -3],
            },
            {
              name: "女",
              value: [3, 5, 6, 7, 3, 3],
            },
          ],

          yAxis: [1, 2, 3, 4, 5, 6],
        };
      },
    },
    id: {
      type: String,
      default: "pyramid",
    },
    barWidth: {
      type: Number,
      default: 10,
    },
    grid: {
      default() {
        return {
          top: "30",
          left: "80",
          right: "30",
          bottom: "30",
        };
      },
    },
  },
  data() {
    return {
      resizeTimer: null,
      show: false,
      info: "数据获取中...",
      manSum: 0,
      womanSum: 0,
    };
  },
  watch: {
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
          this.manSum = 0;
          this.womanSum = 0;
          if (this.chartData.value[0].value.length > 0) {
            this.manSum = this.chartData.value[0].value.reduce((x, y) => x + y);
          }
          if (this.chartData.value[1].value.length > 0) {
            this.womanSum = this.chartData.value[1].value.reduce(
              (x, y) => x + y
            );
          }

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
      let manSum = this.manSum;
      let womanSum = this.womanSum;
      let grid = this.grid;
      let myChart = document.getElementById(this.id);
      this.myChart = this.$echarts.init(myChart);

      let chartData = this.chartData;
      let yAxis = this.chartData.yAxis;
      let seriesArr = [
        {
          name: chartData.value[0].name,
          type: "bar",
          stack: "总量",
          data: chartData.value[0].value,
          color: "rgb(44, 165, 255)",
          barWidth: this.barWidth,
        },
        {
          name: chartData.value[1].name,
          type: "bar",
          stack: "总量",
          data: chartData.value[1].value,
          color: "rgb(255, 100, 137)",
          barWidth: this.barWidth,
        },
      ];

      this.myChart.setOption({
        // 图例
        legend: {
          selectedMode: true, //false 取消图例上的点击事件
          left: "2%",
          top: "3%",
          itemGap: 10, // 间隔
          itemWidth: 14,
          itemHeight: 6,
          textStyle: {
            color: "#fff", // 图例文字颜色
            fontSize: 16,
          },
        },
        // toolbox: {
        //   right: '20',
        //   itemSize: 16,
        //   feature: {
        //     dataView: {
        //       show: true
        //     },

        //     saveAsImage: {
        //       show: true,
        //       backgroundColor: '#000000'
        //     }
        //   },
        //   iconStyle: {
        //     normal: {
        //       color: '#FFF'
        //     },
        //     emphasis: {
        //       color: '#fff'
        //     }
        //   }
        // },
        textStyle: {
          fontFamily: "Microsoft YaHei",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let res = params[0].name;
            let sum = 0;
            for (let i = 0, l = params.length; i < l; i++) {
              if (params[i].value < 0) {
                params[i].value = -params[i].value;
              }
              if (l == 2) {
                i == 0 ? (sum = manSum) : (sum = womanSum);
              } else {
                manSum ? (sum = manSum) : (sum = womanSum);
              }
              let d = ((params[i].value / sum) * 100).toFixed(2);
              d = Math.abs(d);
              res += `</br>   ${params[i].seriesName} : ${params[i].value}  (${d}%)`;
            }
            return res;
          },
        },

        //图表位置
        grid: grid,

        xAxis: {
          type: "value",
          minInterval: 1,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#fff",
            },
          },
          //坐标轴数据
          axisLabel: {
            show: true,
            rotate: 20,
            textStyle: {
              color: "#fff",
              fontSize: 12,
            },
            formatter: (value) => {
              // 负数取反
              if (value < 0) return -value;
              else return value;
            },
          },
          //格网线
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 156, 255,0.3)",
            },
          },
          // 刻度线
          axisTick: {
            show: false,
          },
          //格网区域
          splitArea: {
            show: false,
          },
        },

        yAxis: [
          {
            type: "category",
            // axisLabel: {
            //   rotate: 30
            // },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#fff",
              },
            },
            //坐标轴数据
            axisLabel: {
              textStyle: {
                color: "#fff",
                fontSize: 16,
              },
            },
            // splitLine: {
            //   show: true,
            //   lineStyle: {
            //     color: 'rgba(0, 156, 255,0.65)'
            //   }
            // },
            data: yAxis,
          },
        ],

        series: seriesArr,
      });

      window.addEventListener("resize", this.resize);
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
