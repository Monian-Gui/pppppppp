<template>
  <div class="module-contianer">
    <div class="top" v-if="analysis">
      <DataBox>
        <div class="item item2">
          <div class="num">{{ analysis[0].values }}</div>
          <div class="title">企业总数(家)</div>
        </div>
        <img src="../../assets/img/databox1.png" alt="" />
      </DataBox>
      <DataBox>
        <div class="item">
          <div class="num">{{ analysis[1].values }}</div>
          <div>全口径税收 (亿元)</div>
        </div>
        <div class="item">
          <div class="num">{{ analysis[2].values }}</div>
          <div>亩均税收 (亿元)</div>
        </div>
        <img src="../../assets/img/databox2.png" alt="" />
      </DataBox>
      <DataBox>
        <div class="item">
          <div class="num">{{ analysis[3].values }}</div>
          <div>产业增加值 (亿元)</div>
        </div>
        <div class="item">
          <div class="num">{{ analysis[4].values }}</div>
          <div>亩均增加值 (亿元)</div>
        </div>
        <img src="../../assets/img/databox3.png" alt="" />
      </DataBox>
      <DataBox>
        <div class="item item2">
          <div class="num">{{ analysis[5].values }}</div>
          <div class="title">社会消费品零售总额 (亿元)</div>
        </div>
        <img src="../../assets/img/databox4.png" alt="" />
      </DataBox>
    </div>
    <div class="left panel">
      <Title>产业载体总览</Title>
      <div class="num-box" style="width: 100%" v-if="overview">
        <div class="chart-box50">
          <PoloChart
            id="polo1"
            name="商业楼宇数量"
            titleShow
            color="#54F2FF"
            radius="60"
            :count="overview[0].values"
            unit="个"
            :deep="[0.8, 0.83]"
          ></PoloChart>
        </div>
        <div class="chart-box50">
          <PoloChart
            id="polo2"
            name="商场数量"
            titleShow
            color="#54F2FF"
            radius="60"
            :count="overview[1].values"
            unit="个"
            :deep="[0.8, 0.83]"
          ></PoloChart>
        </div>
        <div class="chart-box50">
          <PoloChart
            id="polo3"
            name="亿元楼宇数量"
            titleShow
            color="#10E5AE"
            radius="60"
            :count="overview[2].values"
            unit="个"
            :deep="[0.8, 0.83]"
          ></PoloChart>
        </div>
        <div class="chart-box50">
          <PoloChart
            id="polo4"
            name="平均租金"
            titleShow
            color="#10E5AE"
            radius="60"
            :count="overview[3].values"
            unit="元/㎡"
            :deep="[0.8, 0.83]"
          ></PoloChart>
        </div>
        <div class="chart-box50">
          <PoloChart
            id="polo5"
            name="平均入驻率"
            titleShow
            color="#FFEF63"
            radius="60"
            :count="overview[4].values"
            unit="%"
            :deep="[0.8, 0.83]"
          ></PoloChart>
        </div>
        <div class="chart-box50">
          <PoloChart
            id="polo6"
            name="平均入区率"
            titleShow
            color="#FFEF63"
            radius="60"
            :count="overview[5].values"
            unit="%"
            :deep="[0.8, 0.83]"
          ></PoloChart>
        </div>
      </div>
    </div>

    <div class="right panel">
      <Title>客流活力分析</Title>
      <div class="title2">
        <img src="../../assets/img/zkl.png" />
        <div>日均客流</div>
        <div class="num" v-if="commercialFlow">
          {{ commercialFlow.total }}
        </div>
      </div>
      <!-- 白天客流、夜间客流、工作日客流、周末客流 -->
      <div
        class="gl-chart-box"
        style="height: calc((90vh - 300px) / 2); display: flex; flex-wrap: wrap"
        v-if="commercialFlow"
      >
        <div style="width: 50%; height: 50%">
          <LoopPercent
            id="kl1"
            :radius="65"
            :chartData="{
              insideLabel: '白天客流',
              value: commercialFlow.day,
              value1: commercialFlow.total,
            }"
          ></LoopPercent>
        </div>
        <div style="width: 50%; height: 50%">
          <LoopPercent
            id="kl2"
            :radius="65"
            :chartData="{
              insideLabel: '夜间客流',
              value: commercialFlow.night,
              value1: commercialFlow.total,
            }"
          ></LoopPercent>
        </div>
        <div style="width: 50%; height: 50%">
          <LoopPercent
            id="kl3"
            :radius="65"
            :chartData="{
              insideLabel: '工作日客流',
              value: commercialFlow.workday,
              value1: commercialFlow.total,
            }"
          ></LoopPercent>
        </div>
        <div style="width: 50%; height: 50%">
          <LoopPercent
            id="kl4"
            :radius="65"
            :chartData="{
              insideLabel: '周末客流',
              value: commercialFlow.weekend,
              value1: commercialFlow.total,
            }"
          ></LoopPercent>
        </div>
      </div>
      <div style="margin-top:10px">
      <Title>客流画像分析</Title>
      <div class="gl-chart-box" style="height: calc((90vh - 300px) / 2)">
        <PyramidChartg></PyramidChartg>
      </div>
        
      </div>
    </div>
    <div class="btn-box">
      <div
        style="margin-bottom: 8px; width: 100%; text-align: center"
        v-for="item in btnList"
        :key="item"
        @click="btnActive = item"
      >
        <GradualBtn
          style="width: 100%"
          size="mini"
          fontSize="15px"
          :shadow="btnActive == item"
          :color="btnActive == item ? '#38a7d1' : '#235783'"
        >
          {{ item }}
        </GradualBtn>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/ndApi/economy/home";
import api2 from "@/api/ndApi/overview/overview";
import DataBox from "./components/DataBox.vue";
import {
  addCircleLayer,
  addHeatLayer,
  removeLayerById,
  removeGeneralLayer,
} from "mapfunc";

export default {
  components: {
    DataBox,
  },
  data() {
    return {
      btnActive: "商圈分布",
      btnList: ["商圈分布", "楼宇分布", "楼宇税收热力", "楼宇企业热力"],
      commercialFlow: null,
      mapLayer: {
        point: {
          2016: null,
          2021: null,
        },
        count: null,
        add: null,
        sub: null,
      },
      analysis: null,
      overview: null,
    };
  },

  watch: {
    btnActive: {
      handler(val) {
        removeGeneralLayer();
        removeLayerById(['circle_layer_label'])
        switch (val) {
          case "楼宇企业热力":
            this.loadTDAnalysis(1);
            break;
          case "楼宇税收热力":
            this.loadTDAnalysis(2);
            break;
          case "楼宇分布":
            this.loadBuildingMarker();
            break;
          case "商圈分布":
            this.loadBussinessMarker();
            break;
          default:
            break;
        }
      },
      immediate: true,
    },
    "$store.state.companyName": {
      handler(e) {
        if (e != "") this.gotoBuildingPage();
      },
      deep: true,
    },
  },
  created() {
    this.loadData();
  },
  beforeDestroy() {
    window.map.off("click", "circle_layer", this.clickHandle);
    window.map.off("click", "circle_layer_symbol", this.clickHandle);
    removeLayerById([
      "circle_layer_ripple",
      "circle_layer_label",
      "symbol",
      "project_line",
      "project_symbol",
      "project",
    ]);
  },
  methods: {
    loadData() {
      api.data.getIndustrialCarriersOverView().then((res) => {
        console.log("产业载体总览", res.data.data);
        this.overview = res.data.data.map((el) => {
          return {
            name: el.name,
            values: Number(el.values),
            unit: el.unit,
          };
        });
      });
      api.data.getIndustryAnalysis().then((res) => {
        console.log("产业指标", res.data.data);
        this.analysis = res.data.data;
      });
      api2.data.getCommercialFlow().then((res) => {
        console.log("fy-客流活力", res.data.data);
        this.commercialFlow = res.data.data;
        this.commercialFlow["total"] =
          (this.commercialFlow.weekend + this.commercialFlow.workday) / 2;
        this.commercialFlow["day"] =
          (this.commercialFlow.workdayDay + this.commercialFlow.weekendDay) / 2;
        this.commercialFlow["night"] =
          (this.commercialFlow.workdayNight +
            this.commercialFlow.weekendNight) /
          2;
      });
    },
    loadTDAnalysis(analysisType) {
      api.data.getTDAnalysis(analysisType).then((res) => {
        console.log(res.data.data);
        addHeatLayer({
          data: res.data.data,
          multiple: 1,
          radius: [7, 10, 10, 15, 15, 60],
          intensity: [7, 1, 10, 4, 15, 10],
        });
      });
    },
    loadBuildingMarker() {
      api.data.getTDAnalysis(0).then((res) => {
        console.log("楼宇分布", res.data.data);
        addCircleLayer({
          data: res.data.data,
          isBuilding: true,
          entType: 1,
        });
      });
    },
    loadBussinessMarker() {
      api.data.getBusinessDistrictAnalysis().then((res) => {
        console.log("商圈分布", res.data.data);
        addCircleLayer({
          data: res.data.data,
          entType: 0,
        });
      });
    },
    gotoBuildingPage() {
      this.$router.push(
        `/economy/building?name=${this.$store.state.companyName}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.module-contianer {
  position: relative;
  padding: 20px;
}
.top {
  position: relative;
  width: 100%;
  height: 10vh;
  display: flex;
  > div {
    flex-grow: 1;
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px 30px;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
    img {
      width: 80px;
      height: 34px;
      position: absolute;
      right: 30px;
    }
    .item {
      display: flex;
      flex-direction: column;
      font-size: 20px;
      color: #dadfff;
      margin-right: 40px;
      .num {
        font-size: 42px;
        color: #f0f1ff;
      }
      .text {
      }
    }
  }
}

.panel {
  box-sizing: border-box;
  background: linear-gradient(
    270deg,
    rgba(0, 18, 38, 0) 0%,
    rgba(40, 57, 84, 0.76) 31%,
    rgba(0, 21, 41, 0.3) 100%
  );
  width: 480px;
  padding: 30px;

  .num-box {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
  }
  .chart-box50 {
    margin-right: 50px;
    width: 38%;
    height: calc((90vh - 210px )/ 3);
  }
}

.left {
  // margin-top: 20px;
  position: absolute;
  left: 0;
  height: 90vh;
}

.right {
  // margin-top: 20px;
  position: absolute;
  right: 0;
  height: 90vh;
}
.title2 {
  margin: 25px 0 15px 30px;
  font-size: 18px;
  color: #abfbff;
  line-height: 25px;
  display: flex;
  align-items: center;
  img {
    width: 21px;
    margin-right: 8px;
  }
  .num {
    color: #ffd500;
    font-size: 24px;
    margin-left: 10px;
  }
}

.flex-box {
  display: flex;
}
.btn-box {
  position: relative;
  left: 480px;
  top: 20px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  align-items: center;
  pointer-events: auto;
}
.left-panel {
  height: 98%;
}
.gl-panel-item {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
