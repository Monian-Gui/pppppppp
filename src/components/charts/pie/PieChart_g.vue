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
          { value: 20, name: "事件4" },
          { value: 10, name: "事件5" },
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
    radius2: {
      type: Array,
      default() {
        return ["45%", "43%"];
      },
    },
    // center:定位
    center: {
      type: Array,
      default() {
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
      // default: "outside",
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
      let dataLength = chartData.length;
      let dataLength2 = parseInt(dataLength / 2);
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
          hoverAnimation: true,
          itemStyle: {
            normal: {
              borderWidth: 3,
              textShadowColor: '(0, 0, 0, 0)',
              // borderRadius: this.borderRadius,
              borderColor: "rgba(19,31,47,0)",
            },
          },
          label: {
            show: this.labelShow,
            position: this.labelPosition,
            alignTo: "edge",
            formatter: this.labelDetailVisible
              ? `{name|{b}}\n{count|{c} ${this.unit}}{count|({d}%)}`
              : "\n{name|{b}} \n\n {name|{d}%}",
            // formatter: '{name|{b}}\n',  
            // formatter: '{name|{b}}',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            avoidLabelOverlap: false,
            textStyle:{
              textShadowColor: '(0, 0, 0, .3)'
            },
            offset: this.labelDetailVisible ? 0 : [0, -8],
            rich: {
              name: {
                fontSize: 12,
                color: "#fff",
                textShadowColor: '(0, 0, 0, 0)'
                // padding:[0,0,10,0]
              },
              count: {
                fontSize: 10,
                color: "#fff",
                textShadowColor: '(0, 0, 0, .3)'
              },
            },
          },
          labelLine: {
            normal: {
              show: true,
              length: 5, //折线
              length2: 10,
            },
          },
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0)",
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
        {
          type: "pie",
          radius: this.radius2,
          center: this.center,
          hoverAnimation: true,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55,
            },
            emphasis: {
              show: true,
            },
          },
          name: "",
          data: [
            {
              name: "",
              value: 0,
              itemStyle: {
                normal: {
                  color: "#0B4A6B",
                },
              },
            },
          ],
        },
      ];
      let legend = [
        {
          show: this.legendShow,
          type: this.legendType, //分页类型
          // orient: "horizontal",
          left: 0,
          orient: "vertical",
          align: "right",
          top: dataLength > 8 ? "20%" : "40%",
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 2,
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
          data: chartData.slice(0, dataLength2),
          formatter: (name) => {
            let newname = name.length > 5 ? `${name.slice(0, 5)}...` : name;
            let obj = chartData.find((v) => v.name == name);
            let pre = ((obj.value / num) * 100).toFixed(2);
            let result =
              dataLength > 8 ? `${newname} ${pre}%` : `\n${newname}  ${pre}%\n`;
            return result;
          },
          rich: {
            name: {
              fontSize: 12,
              color: "#fff",
              textShadowColor: '(0, 0, 0, .3)'
              // padding:[0,0,10,0]
            },
            count: {
              fontSize: 10,
              color: "#fff",
              textShadowColor: '(0, 0, 0, .3)'
            },
          },
        },
        {
          show: this.legendShow,
          type: this.legendType, //分页类型
          // orient: "horizontal",
          top: dataLength > 8 ? "20%" : "40%",
          right: 0,
          orient: "vertical",
          align: "left",
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 2,
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
            padding: [6, 0, 0, 0],
          },
          // data: legenddata.slice(3, 5),
          data: chartData.slice(dataLength2, dataLength),
          formatter: (name) => {
            let newname = name.length > 5 ? `${name.slice(0, 5)}...` : name;

            let obj = chartData.find((v) => v.name == name);
            let pre = ((obj.value / num) * 100).toFixed(2);
            let result =
              dataLength > 8 ? `${newname} ${pre}%` : `\n${newname}  ${pre}%\n`;
            return result;
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
