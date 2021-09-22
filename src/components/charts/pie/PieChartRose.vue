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
import { numberFormat } from "tools";
import config from "../js/chartConfig.js";
export default {
  props: {
    // id:图表唯一标识
    id: {
      type: String,
      default: "PieChart_g",
    },
    // chartData:图表数据
    chartData: {
      default() {
        return [
          { value: 100, name: "事件1" },
          { value: 80, name: "事件2" },
          { value: 60, name: "事件3" },
        ];
      },
    },
    // unit:单位
    unit: {
      type: String,
      default: "人",
    },
    // radius:饼图的半径
    radius: {
      type: Array,
      default() {
        return ["0%", "60%"];
      },
    },
    // center:定位
    center: {
      type: Array,
      default() {
        return ["20%", "50%"];
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
      default: false,
    },
    color: {
      // color:颜色组
      type: Array,
      default() {
        return config.color;
      },
    },
    sumLabel: {
      // sumLabel:显示总数的label，如总人数（默认为空，有值则在图表中心显示总数值）
      type: String,
      default: "",
    },
    titleShow: {
      default: false,
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
      handler() {
        if (this.myChart) {
          this.myChart.dispose();
        }
        this.info = "数据获取中...";
        if (this.chartData && this.chartData.length > 0) {
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
      let color = this.color;
      let num = 0,
        temp;
      chartData.map((item) => {
        num += parseInt(item.value);
      });
      // let legenddata = chartData.map((v) => v.name);
      temp = numberFormat(num);

      let series = [
        {
          name: this.name,
          type: "pie",
          radius: this.radius,
          center: this.center,
          roseType: this.roseType,
          // roseType: "radius",
          hoverAnimation: true,
          itemStyle: {
            normal: {
              color: (params) => {
                console.log(params);
                var colorList = [
                  {
                    c2: "#1D3AFF", //管理
                    c1: "#25C4FF",
                  },
                  {
                    c1: "#B4EC51", //操作
                    c2: "#00DCB9",
                  },
                  {
                    c1: " #FFD428", //实践
                    c2: "#FF6424",
                  },
                  {
                    c1: "#63E587", //操作
                    c2: "#5FE2E4",
                  },
                  {
                    c1: "#F9E59F", //操作
                    c2: "#CC9550",
                  },
                  {
                    c1: "#DBEB63", //操作
                    c2: "#0BBF03",
                  },
                ];
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorList[params.dataIndex].c1,
                  },
                  {
                    offset: 1,
                    color: colorList[params.dataIndex].c2,
                  },
                ]);
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
          label: {
            show: this.labelShow,
            position: this.labelPosition,
            alignTo: "edge",
            formatter: this.labelDetailVisible
              ? `{name|{b}}\n{count|{c} ${this.unit}}{count|({d}%)}`
              : "{name|{b}}  {d}%",
            // formatter: '{name|{b}}\n',
            // formatter: '{name|{b}}',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            offset: this.labelDetailVisible ? 0 : [0, -8],
            rich: {
              name: {
                fontSize: 12,
                color: "#fff",
                // padding:[0,0,10,0]
              },
              count: {
                fontSize: 10,
                color: "#ddd",
              },
            },
          },
          labelLine: {
            normal: {
              show: true,
            },
          },
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 1)",
            },
          },
          labelLayout: (params) => {
            var isLeft = params.labelRect.x < this.myChart.getWidth() / 2;
            var points = params.labelLinePoints;
            if (points) {
              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
            }
            return {
              labelLinePoints: points,
            };
          },
        },
      ];
      let legend = [
        {
          show: this.legendShow,
          type: this.legendType, //分页类型
          // orient: "horizontal",
          left: "50%",
          orient: "vertical",
          align: "left",
          top: "30%",
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 5,
          pageIconColor: "#fff", //翻页按钮的颜色。
          inactiveColor: "#909090d0", //图例关闭时的颜色
          pageIconInactiveColor: "#aaa", //翻页按钮不激活时（即翻页到头时）的颜色。
          pageIconSize: 12,
          pageTextStyle: {
            color: "#eee",
          },
          textStyle: {
            color: "#fff",
            fontSize: 12,
          },
          // data: legenddata.slice(0, 3),
          data: chartData,
          formatter: (name) => {
            let obj = chartData.find((v) => v.name == name);
            let pre = ((obj.value / num) * 100).toFixed(2);
            let result = `${name}  ${pre}%`;
            return result;
          },
          rich: {
            name: {
              fontSize: 12,
              color: "#fff",
              // padding:[0,0,10,0]
            },
            count: {
              fontSize: 10,
              color: "#ddd",
            },
          },
        },
      ];

      this.myChart.setOption({
        color,
        title: {
          show: this.titleShow,
          text: `${temp[0]}${temp[1]}`,
          subtext: `${this.unit}`,
          x: this.center[0],
          y: this.center[1],
          textAlign: "center",
          textVerticalAlign: "middle",
          itemGap: 5,
          padding: [-10, 0],
          textStyle: {
            color: "#fff",
            fontSize: 20,
          },
          subtextStyle: {
            color: "#ddd",
            fontSize: 15,
          },
        },
        textStyle: {
          fontFamily: config.fontFamily,
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}" + this.unit + "({d}%)",
          transitionDuration: 0, //解决屏幕抖动bug
          confine: true,
        },
        series,
        legend,
      });
      window.addEventListener("resize", this.resize);
      // 默认高亮
      // let index = 0; // 高亮索引
      // this.myChart.dispatchAction({
      //   type: "highlight",
      //   seriesIndex: index,
      //   dataIndex: index,
      // });
      // this.myChart.on("mouseover", (e) => {
      //   if (e.dataIndex != index) {
      //     this.myChart.dispatchAction({
      //       type: "downplay",
      //       seriesIndex: 0,
      //       dataIndex: index,
      //     });
      //   }
      // });
      // this.myChart.on("mouseout", (e) => {
      //   index = e.dataIndex;
      //   this.myChart.dispatchAction({
      //     type: "highlight",
      //     seriesIndex: 0,
      //     dataIndex: e.dataIndex,
      //   });
      // });
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
