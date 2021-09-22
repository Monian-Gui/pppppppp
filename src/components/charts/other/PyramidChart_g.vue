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
          top: "40",
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
          x: "left",
          top: "0%",
          left:'10%',
          itemGap: 10, // 间隔
          itemWidth: 20,
          itemHeight: 20,
          textStyle: {
            color: "#fff", // 图例文字颜色
            fontSize: 16,
          },
          data: [
            {
              name: "男",
              icon:'image://data:image/png;base64,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'
            },
            {
              name: "女",
              icon:'image://data:image/png;base64,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'
            },
          ],
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
            show: true,
            lineStyle: {
              color: "rgba(0, 156, 255,0.3)",
            },
          },
          //坐标轴数据
          axisLabel: {
            show: true,
            rotate: 0,
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
