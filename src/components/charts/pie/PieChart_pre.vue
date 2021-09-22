<template>
  <div v-if="show"  class="echat">
    <div :id="id" style="width:100%;height:100%"></div>
    <div class="titles" v-html="chartData.name"></div>
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
      default() {
        return { value: 50, name: "贡献度" };
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
      default() {
        return [50, 70];
      },
    },
    radius2: {
      type: Array,
      default() {
        return [55, 65];
      },
    },
    colors: {
      type: Array,
      default() {
        return ["#1D3AFF", "#25C4FF","#FFA400","#FFE754"];
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
        console.log(e)
        if (this.myChart) {
          this.myChart.dispose();
        }
        this.info = "数据获取中...";
        if (this.chartData || this.chartData.length > 0) {
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
  mounted(){
    let str =this.chartData.name.length>4?this.chartData.name.slice(0,4)+"\n"+this.chartData.name.slice(4,this.chartData.name.length):this.chartData.name
    this.chartData.name = "<div style='text-align:center;'>"+str+"</div>"
  },
  methods: {
    initEchart() {
      let myChart = document.getElementById(this.id);
      this.myChart = this.$echarts.init(myChart);
      let chartData = JSON.parse(JSON.stringify(this.chartData));
      let color = this.color;
      // let num = 0,
      //   temp;
      // chartData.map((item) => {
      //   num += parseInt(item.value);
      // });
      // // let legenddata = chartData.map((v) => v.name);
      // temp = numberFormat(num);

      let series = [
        {
          name: "面积模式",
          type: "pie",
          radius: this.radius,
          center: ["50%", "50%"],
          data: [
            {
              value: parseInt(chartData.value),
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: this.colors[0],
                  },
                  {
                    offset: 1,
                    color: this.colors[1],
                  },
                ]),
              },
              label: {
                color: "rgba(255,255,255,.45)",
                fontSize: 14,
                show:false,
                formatter: "完成梳理部门\n{a|34}个",
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: 20,
                    lineHeight: 30,
                  },
                },
              },
            },
            {
              value: parseInt(100-chartData.value),
              itemStyle: {
                color: "transparent",
              },
            },
          ],
        },
        {
          name: "面积模式",
          type: "pie",
          radius: this.radius2,
          center: ["50%", "50%"],
          data: [
            {
              value: parseInt(chartData.value),
              itemStyle: {
                color: "transparent",
              },
            },
            {
              value: parseInt(100-chartData.value),
              name: "rose2",
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: this.colors[2],
                  },
                  {
                    offset: 1,
                    color: this.colors[3],
                  },
                ]),
              },
              label: {
                show:false,
                color: "rgba(255,255,255,.45)",
                fontSize: 14,
                formatter: "部门总量\n{a|52}个",
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: 20,
                    lineHeight: 30,
                  },
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
          x: "center",
          y: "bottom",
          data: ["rose3", "rose5", "rose6", "rose7", "rose8"],
          formatter: () => {
            // let obj = chartData.find((v) => v.name == name);
            // if (name.length > 6) {
            //   return name.substring(0, 6) + '...'
            // } else {
            //   return name
            // }
            // let str = name +result+"%"
            // return result;
          },
        },
      ];

      this.myChart.setOption({
        color,
        title: {
          show: this.titleShow,
          text: chartData.value+"%",
          // subtext: chartData.name,
          x: "center",
          y: "center",
          textStyle: {
            color: "#fff",
            fontSize: 20,
            fontWeight: "normal",
          },
          subtextStyle: {
            color: "rgba(255,255,255,.45)",
            fontSize: 12,
            fontWeight: "normal",
          },
        },
        calculable: true,
        textStyle: {
          fontFamily: config.fontFamily,
        },
        tooltip: {
          show:false,
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
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
  position: relative;
  .titles{
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
  color: #454849;
  font-size: 16px;
  .myicon {
    font-size: 42px;
  }
  .info {
    margin-top: -2px;
  }
}
</style>
