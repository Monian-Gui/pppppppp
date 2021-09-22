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
      type: Array,
      default() {
        return [
          {
            value: 100,
            name: "目标",
            oriname: "意向",
            number: 98756,
            //color: ["rgba(29,211,137,0.8)", "rgba(29,211,137,0)"]
          },
          {
            value: 80,
            name: "方案率",
            oriname: "方案",
            number: 88756,
            // color: ["rgba(102,142,255,0.7)", "rgba(102,142,255,0)"]
          },
          {
            value: 60,
            name: "商務率",
            oriname: "商務",
            number: 78756,
            // color: ["rgba(255,198,82,0.6)", "rgba(255,198,82,0)"]
          },
          {
            value: 40,
            name: "成交率",
            oriname: "即將成交",
            number: 68756,
            // color: ["rgba(255,110,115,0.5)", "rgba(255,110,115,0)"]
          },
          {
            value: 20,
            name: "贏單率",
            oriname: "贏單",
            number: 58756,
            //  color: ["rgba(134,131,230,0.4)", "rgba(134,131,230,0)"]
          },
        ];
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
          top: 0,
          left: "0%",
          right: 20,
          bottom: 30,
          containLabel: true,
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
        if (this.chartData) {
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
      var data1 = [];
      var data2 = [];
      var colors = [
        "#1cd389",
        "#668eff",
        "#ffc751",
        "#ff6e73",
        "#8683e6",
        "#9692ff",
      ];
      for (var i = 0; i < this.chartData.length; i++) {
        var obj1 = {
          value: this.chartData[i].value,
          num: this.chartData[i].number,
          name: this.chartData[i].oriname,
        };

        var obj2 = {
          value: this.chartData[i].value,
          name: this.chartData[i].name,
          // itemStyle: {
          //   opacity: 0,
          //   normal: {
          //     color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          //       {
          //         offset: 0,
          //         color: this.chartData[i].color[1],
          //       },
          //       {
          //         offset: 1,
          //         color: this.chartData[i].color[0],
          //       },
          //     ]),
          //     borderWidth: 0,
          //     opacity: 1,
          //   },
          // },
        };
        data1.push(obj1);
        data2.push(obj2);
      }

      let seriesArr = [
        {
          top: 0,
          type: "funnel",
          height: "200",
          gap: 6,
          minSize: 100,
          left: "20%",
          width: "40%",
          label: {
            show: true,
            position: "right",
            fontSize: "14",
            color: "#fff",
            formatter: function (d) {
              var ins = d.name + "{aa|}    " + d.data.num + "件";
              return ins;
            },
            rich: {
              aa: {
                padding: [8, 0, 6, 0],
              },
            },
          },
          labelLine: {
            // 标签的视觉引导线样式
            normal: {
              show: true, // 是否显示引导线
              length: 30, // 视觉引导线第一段的长度。
            },
          },
          data: data1,
        },
        {
          top: 0,
          type: "funnel",
          height: "200",
          gap: 6,
          minSize: 100,
          left: "20%",
          width: "40%",
          z: 2,
          label: {
            normal: {
              show: false,
              color: "#fff",
              position: "right",
              formatter: function (d) {
                console.log(d);
                var ins = d.name + "\n" + d.percent + "%";
                // var ins = "{aa|" + d.name + "}\n{bb|" + d.percent + "%}";
                return ins;
              },
              rich: {
                aa: {
                  align: "center",
                  color: "#fff",
                  fontSize: "12",
                  lineHeight: "30",
                },
                bb: {
                  align: "center",
                  color: "#fff",
                  fontSize: "22",
                },
              },
            },
          },
          labelLine: {
            show: false,
            type: "dashed",
          },
          data: data2,
        },
      ];

      this.myChart.setOption({
        // grid: this.grid,
        color: colors,
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
