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
    id: {
      type: String,
      default: "Radar",
    },
    chartData: {
      type: Object,
      default() {
        return {
          data: [{ value: [90, 60, 70, 85, 55], name: "" }],
          indicator: [
            { name: "属性1", unit: "人", min: 0, max: 100 },
            { name: "属性2", unit: "m²", min: 0, max: 100 },
            { name: "属性3", unit: "km²", min: 0, max: 100 },
            { name: "属性4", unit: "m²", min: 0, max: 100 },
            { name: "属性5", unit: "m²", min: 0, max: 100 },
          ],
        };
      },
    },

    color: {
      type: Array,
      default() {
        return [
          "#4ADBFF",
          "#4BFFD1",
          "#C6FF4B",
          "#FFA24B",
          "#BF4BFF",
          "#4BFCFF",
          "#4BFF50",
          "#FFE84B",
          "#FF624B",
          "#1CFFA2",
        ];
      },
    },
    opacity: {
      type: Number,
      default: 0.5,
    },
    shape: {
      type: String,
      default: "polygon", // 雷达图绘制类型，支持 'polygon' 和 'circle'。
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
    //       setTimeout(() => {
    //         this.initEchart()
    //       }, 400)
    //       this.resize()
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
          this.chartData.data &&
          this.chartData.data.length > 0
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
    initEchart() {
      this.myChart = this.$echarts.init(document.getElementById(this.id));
      const chartData = this.chartData.data;
      const indicator = this.chartData.indicator;
      console.log(chartData);
      const series = [
        {
          type: "radar",
          data: chartData,
          areaStyle: {
            shadowBlur: 10,
            shadowColor: "rgb(0, 0, 0,0.5)",
            opacity: this.opacity,
          },
          tooltip: {
            formatter: (params) => {
              console.log(params);
              let res = `<p><b>${params.name}</b></p>`;
              indicator.forEach((item,index) => {
                res += `<p>${item.name}:${params.value[index]}${item.unit}</p>`;
              });
              return res;
            },
          },
        },
      ];

      this.myChart.setOption({
        color: this.color,
        textStyle: {
          fontFamily: "ShangShouRunHeiTi-2",
        },
        tooltip: {
          trigger: "item",
        },
        // grid: {
        //   // 控制图的大小，调整下面这些值就可以，
        //   x: 40,
        //   x2: 100,
        //   y2: 150, // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        // },
        radar: {
          shape: this.shape,
          center: ["40%", "50%"],
          // 圆中心坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
          radius: "50%",
          // 圆的半径，数组的第一项是内半径，第二项是外半径。
          startAngle: 90,
          name: {
            textStyle: {
              color: "#fff",
              fontSize: 12,
            },
          },
          indicator: indicator,
        },
        series,
      });

      window.addEventListener("resize", this.resize);
    },
    resize() {
      let _this = this;
      if (_this.resizeTimer) {
        clearTimeout(_this.resizeTimer);
      }
      _this.resizeTimer = setTimeout(function () {
        _this.myChart.resize();
      }, 400);
    },
  },

  beforeDestroy() {
    if (this.myChart) {
      this.myChart.clear();
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
