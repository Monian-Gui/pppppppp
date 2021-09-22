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
import Highcharts from "highcharts";
// import VueHighCharts from 'vue-highcharts';
import Highcharts3D from "highcharts/highcharts-3d";
import funnel3d from "highcharts/modules/funnel3d";
import cylinder from "highcharts/modules/cylinder";
Highcharts3D(Highcharts);
funnel3d(Highcharts);
cylinder(Highcharts);
export default {
  props: {
    chartData: {
      type: Array,
      default() {
        return [
          { name: "金融", y: 6800, color: "#4700FF", opacity: 1 },
          { name: "商贸", y: 8000, color: "#2A89FF", opacity: 1 },
          { name: "其他", y: 8900, color: "#FEB000", opacity: 1 },
        ];
      },
    },
    id: {
      type: String,
      default: "pyramid",
    },
    unit: {
      type: String,
      default: "%",
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
          right: "50%",
          bottom: 30,
          containLabel: true,
        };
      },
    },
    neckObj: {
      default() {
        return {
          neckWidth: "10%",
          width: "50%",
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
            this.init();
          }, 1000);
        } else {
          this.show = false;
          this.info = "暂无数据";
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // this.init()
  },
  methods: {
    // 绘制图表
    initEchart() {
      let myChart = document.getElementById(this.id);
      this.myChart = this.$echarts.init(myChart);
      let unit = this.unit
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
          left: "0%",
          width: "60%",
          label: {
            show: true,
            position: "right",
            fontSize: "14",
            color: "#fff",
            formatter: function (d) {
              var ins = d.name + "{aa|}    " + d.data.num + unit;
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
          left: "0%",
          width: "40%",
          z: 2,
          label: {
            normal: {
              show: false,
              color: "#fff",
              position: "right",
              formatter: function (d) {
                console.log(d);
                var ins = d.name + "\n" + d.percent + unit;
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
    init() {
      let chartData = this.chartData;
      let lengthNum = chartData.length;
      let num = 0;
      let unit = this.unit;
      chartData.forEach((v) => {
        num += v.y;
      });
      let newchartData = chartData.map((v) => {
        return [
          v,
          {
            name: "金融",
            y: parseInt((num / lengthNum) * 0.5),
            color: "#4700FF",
            opacity: 0,
          },
        ];
      });
      let newchartDatas = newchartData.reduce((cur, pre) => cur.concat(pre));
      let myChart = document.getElementById(this.id);
      Highcharts.chart(myChart, {
        chart: {
          type: "funnel3d",
          backgroundColor: "transparent",
          options3d: {
            enabled: true,
            alpha: -10,
            depth: 200,
            viewDistance: 30,
          },
          marginTop: 50,
          marginRight: 150,
        },
        credits: {
          enabled: false,
        },

        title: {
          text: "",
        },

        plotOptions: {
          column: {
            groupZPadding: 0,
          },
          series: {
            // 数据标签
            dataLabels: {
              connectorWidth: 0,
              distance: 0,
              enabled: true,
              y: 0,
              allowOverlap:true,
              // format: "---<b>{point.name}</b> {point.y:,.1f}%",
              formatter: function () {
                if (this.point.opacity) {
                  return (
                    "- - - - - - - - - " +
                    this.point.name +
                    "   " +
                    this.y + unit
                  );
                } else {
                  return "";
                }
              },
              fontSize: 18,
              color: "#A5CCF4",
              x: 20,
            },
            // 漏斗脖子大小
            neckWidth: this.neckObj.neckWidth,
            neckHeight: "0%",
            // ...
            width: this.neckObj.width,
            height: "100%",
            groupPadding: 10,
          },
        },
        series: [
          {
            borderColor: "#fff",
            data: newchartDatas,
          },
        ],
      });
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
