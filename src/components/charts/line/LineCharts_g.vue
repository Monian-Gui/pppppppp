<template>
  <div v-if="show" class="echat">
    <div :id="id" style="width: 100%; height: 100%"></div>
  </div>
  <div v-else class="echat-err">
    <i v-if="info == '暂无数据'" class="iconfont icon-zanwutubiaoshuju myicon"></i>
    <div class="info">{{ info }}</div>
  </div>
</template>
<script>
  // import { numberFormat } from "tools";
  import config from "../js/chartConfig.js";
  // import echarts from "echarts"
  export default {
    props: {
      // id:图表唯一标识
      id: {
        type: String,
        default: "PieChart_pre",
      },
      // chartData:图表数据
      chartData: {
        default () {
          return {
            xAxis: ["3月", "4月", "5月", "6月"],
            data: [10, 20, 30, 40],
            name: ""
          };
        },
      },
      // unit:单位
      unit: {
        type: String,
        default: "贡献度",
      },
      // radius:饼图的半径
      radius: {
        type: Array,
        default () {
          return [50, 70];
        },
      },
      radius2: {
        type: Array,
        default () {
          return [60, 65];
        },
      },
      colors: {
        type: Array,
        default () {
          return ["#1D3AFF", "#25C4FF", "#FFA400", "#FFE754"];
        },
      },
      // center:定位
      center: {
        type: Array,
        default () {
          return ["50%", "60%"];
        },
      },
      // borderRadius:边框圆角
      borderRadius: {
        type: Number,
        default: 0,
      },
      roseType: {
        //  是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
        // 'radius' 扇区圆心角展现数据的百分比，半径展现数据的大小。
        // 'area' 所有扇区圆心角相同，仅通过半径展现数据大小。
        default: false,
      },
      labelShow: {
        default: true,
      },

      labelPosition: {
        // 'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。
        // 'inside'饼图扇区内部。
        // 'center'在饼图中心位置。见圆环图示例
        type: String,
        default: "outside",
      },
      legendType: {
        // 'plain'：普通图例。缺省就是普通图例。
        //'scroll'：可滚动翻页的图例。当图例数量较多时可以使用。
        type: String,
        default: "plain",
      },
      legendShow: {
        default: true,
      },
      color: {
        // color:颜色组
        type: Array,
        default () {
          return config.color;
        },
      },
      sumLabel: {
        // sumLabel:显示总数的label，如总人数（默认为空，有值则在图表中心显示总数值）
        type: String,
        default: "",
      },
      titleShow: {
        default: true,
      },
      name: {
        // sumLabel:显示总数的label，如总人数（默认为空，有值则在图表中心显示总数值）
        type: String,
        default: "事件类型",
      },
      labelDetailVisible: {
        // label是否显示详细信息
        type: Boolean,
        default: false,
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
      //     if (val) {
      //       this.initEchart()
      //     }
      //   },
      //   deep: true
      // }
      chartData: {
        handler(e) {
          console.log(e);
          if (this.myChart) {
            this.myChart.dispose();
          }
          this.info = "数据获取中...";
          if (this.chartData.xAxis.length > 0) {
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
      initEchart() {
        let myChart = document.getElementById(this.id);
        this.myChart = this.$echarts.init(myChart);
        let chartData = JSON.parse(JSON.stringify(this.chartData));
        //   let color = this.color;
        console.log(chartData)
        let series = [{
          name: chartData.name,
          type: "line",
          stack: "总量",
          data: chartData.data,
          symbol: "none",
          lineStyle: {
            normal: {
              width: 2,
              color: {
                type: "linear",
                colorStops: [{
                    offset: 0,
                    color: "rgba(62, 207, 227, 1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(62, 207, 227, 1)", // 100% 处的颜色
                  },
                ],
                globalCoord: false, // 缺省为 false
              },
              shadowColor: "rgba(72,216,191, 0.3)",
              shadowBlur: 10,
              shadowOffsetY: 20,
            },
          },
          itemStyle: {
            normal: {
              color: "#fff",
              borderWidth: 2,
              /*shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 100,*/
              borderColor: "#A9F387",
            },
          },
          areaStyle: {
            normal: {
              color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "rgba(67, 221, 234, 0.8)"
                },
                {
                  offset: 0.5,
                  color: "rgba(67, 221, 234, 0.5)"
                },
                {
                  offset: 1,
                  color: "rgba(67, 221, 234, 0.2)"
                }
              ])
            }
          }, //填充区域样式
          smooth: true,
        }, ];
        // let legend = {
        //   show: true,
        //   x: 20,
        //   y: 10,
        //   itemHeight: 12,
        //   itemWidth: 24,
        //   data: [chartData.name],
        //   textStyle: {
        //     color: 'rgb(67, 221, 234)'
        //   },
        //   borderColor: 'yellow',
        //   icon: 'circle',
        // };

        this.myChart.setOption({
          tooltip: {
            trigger: "axis",
          },
          xAxis: [{
            type: "category",
            data: chartData.xAxis,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#DADFFF",
              },
            },
          }, ],
          grid: {
            left: 60,
            // right: '10',ss
            top:70,
            bottom: '30', //left,right,bottom,为容器距离外侧包含块的距离
            // containLabel: true
            // x: 0,
            // y: 20,
            // x2: 0,
            // y2: 30 //x,y代表纵坐标的左上角距离容器的大小     ---x2,y2代表横坐标的右下角距离容器的大小
          },
          title: {
            subtext: '('+chartData.unit+")",
            left: 25,
            top: 30,
            subtextStyle: {
              color: '#fff',
            },
          },
          yAxis: [{
            type: "value",
            splitNumber: 4,
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#DDD",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DADFFF",
              },
              symbol:["none","arrow"],
              symbolOffset:10,
              // symbolSize:[30]
            },
            nameTextStyle: {
              color: "#999",
            },
            splitArea: {
              show: false,
            },
          }, ],
          color: ['#1DD6CF', '#ED8DD0'],
          series,
          legend: {
            show: true,
            x: 30,
            y: 10,
            itemHeight: 12,
            itemWidth: 24,
            data: [chartData.name],
            textStyle: {
              color: '#fff'
            },
            itemStyle: {
              color: 'rgb(67, 221, 234)',
              borderColor: 'yellow',
              borderWidth: 0
            },
            icon: 'rect',
          },
        });
        window.addEventListener("resize", this.resize);
      },
      resize() {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(() => {
          this.myChart.resize();
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