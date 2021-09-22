<template>
  <div class="module-contianer">
    <div class="panel-list">
      <div class="panel">
        <Title>产业结构</Title>
        <div style="height: calc((100vh - 308px) / 3); padding: 10px 0 0 0">
          <!-- <FunnelChart id="cyjg"></FunnelChart> -->
          <FunnelChart3D
            v-if="industrialStructure"
            id="cyjg"
            :neckObj="{ neckWidth: '10%', width: '50%' }"
            :chartData="industrialStructure"
          ></FunnelChart3D>
        </div>
        <Title>人才分析</Title>
        <div
          style="display: flex; width: 100%; height: calc((100vh - 308px) / 3)"
          v-if="talentAnalysis"
        >
          <div class="gl-chart-box" style="width: 30%; height: 100%">
            <PoloChartg
              id="jyzrs"
              name="总就业人数"
              titleShow
              radius="60"
              :count="Number(talentAnalysis[0].values)"
              unit="人"
              :deep="[0.6, 0.65]"
            ></PoloChartg>
          </div>
          <div class="num-block-list">
            <div class="num-block">
              <div class="block b1">{{ talentAnalysis[1].values }}</div>
              国家级高级人才(人)
            </div>
            <div class="num-block">
              <div class="block b2">{{ talentAnalysis[2].values }}</div>
              省级高级人才(人)
            </div>
            <div class="num-block">
              <div class="block b3">{{ talentAnalysis[3].values }}</div>
              市级高级人才(人)
            </div>
          </div>
        </div>
        <Title>人才需求学历分析</Title>
        <div class="item4">
          <img src="../../assets/img/rencaixuqiu.png" alt="" />
          <div class="text-box">
            <div class="text">功能区人才需求总数</div>
            <div class="num" v-if="talentDemandAnalysis">
              {{ talentDemandAnalysis.count }} <span>人</span>
            </div>
          </div>
        </div>
        <div
          style="height: calc((100vh - 308px) / 3); width: 100%"
          class="flex-wrap"
        >
          <div class="charts">
            <PieChartRose
              id="polo3"
              :radius="['30%', '45%']"
              :legendShow="true"
              :labelShow="false"
              legendType="plain"
              :chartData="talentDemands"
            />
          </div>
          <div class="charts">
            <wordcloud
              :data="xuelifxData"
              nameKey="name"
              valueKey="value"
              :color="colors3"
              :showTooltip="true"
              spiral="rectangular"
              :fontSize="[14, 20]"
              class="word-cloud"
              :rotate="{from:-15,to:15,numOfOrientation:5}"
            >
            </wordcloud>
          </div>
        </div>
      </div>
      <div class="panel">
        <!-- <Title>产业集中度分析</Title>
        <div style="height: 240px"></div> -->
        <Title>主导产业经济分析</Title>
        <div class="flex-box">
          <div>
            <Title style="margin-top: 5px" level="level2">金融产业</Title>
            <div class="item-list3">
              <div
                class="item3"
                v-for="(item, index) in LIJRAnalysis"
                :key="item.name"
              >
                <div class="num">{{ index + 1 }}</div>
                <div class="text-box">
                  <div class="text1">{{ item.name }}</div>
                  <div class="text2">{{ item.values }} {{ item.unit }}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Title style="margin-top: 5px" level="level2">商贸服务产业</Title>
            <div class="item-list3">
              <div
                class="item3"
                v-for="(item, index) in LISMAnalysis"
                :key="item.name"
              >
                <div class="num">{{ index + 1 }}</div>
                <div class="text-box">
                  <div class="text1">{{ item.name }}</div>
                  <div class="text2">{{ item.values }} {{ item.unit }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <Title>产业税收贡献度分析</Title>
        <div style="height: calc((100vh - 200px) / 3); display: flex">
          <div style="width: 25%; heigh: 100%">
            <PieChartpre
              v-if="cyssData"
              :id="'zdcyss'"
              :chartData="cyssData"
            ></PieChartpre>
          </div>
          <div style="width: 25%; heigh: 100%">
            <BarPictographic
              v-if="gxdzfData"
              :id="'gxdzf'"
              :chartData="gxdzfData"
            ></BarPictographic>
          </div>
          <div style="width: 25%; heigh: 100%">
            <PieChartpre
              v-if="jrcyssData"
              :id="'jrcyss'"
              :chartData="jrcyssData"
              :radius2="[40, 50]"
              :radius="[40, 50]"
              :colors="colors"
            ></PieChartpre>
          </div>
          <div style="width: 25%; heigh: 100%">
            <PieChartpre
              v-if="smfwcyData"
              :id="'smfwcy'"
              :chartData="smfwcyData"
              :radius2="[40, 50]"
              :radius="[40, 50]"
              :colors="colors"
            ></PieChartpre>
          </div>
        </div>
        <Title style="margin-top: 15px">产业经济对标</Title>
        <div style="height: calc((100vh - 200px) * .66)">
          <PyramidCharts :chartData="chartData"></PyramidCharts>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/ndApi/economy/industry";
import api2 from "@/api/ndApi/overview/overview";
import Wordcloud from "vue-wordcloud";
export default {
  data() {
    return {
      industrialStructure: null,
      talentAnalysis: null,
      talentDemandAnalysis: null,
      talentDemands: [],
      LIJRAnalysis: null,
      LISMAnalysis: null,
      industrialTaxAnalysis: null,
      // 产业税收贡献度分析
      cyssData: null,
      gxdzfData: null,
      smfwcyData: null,
      jrcyssData: null,
      colors: ["#213F66", "#213F66", "#25C4FF", "#1D3AFF"],
      colors2: [
        "#CCFFFF",
        "#99CCFF",
        "#66CCFF",
        "#CCFFFF",
        "#6699CC",
        "#66CCCC",
        "#CCCCFF",
        "#99CCCC",
        "#0099CC",
        "#CC9550",
        "#1D3AFF",
        "#1D3AFF",
        "#25C4FF",
        "#FFA400",
        "#FFE754",
      ],
      colors3: [
        "#CCFFCC",
        "#FFCC99",
        "#FFFFCC",
        "#CCFFFF",
        "#FFFF33",
        "#993333",
        "#99CCFF",
        "#009999",
        "#FF99CC",
        "#FFFFCC",
        "#CC3333",
      ],
      xuelifxData: [],
      chartData: {
        value: [
          {
            name: "交子公园金融产业区",
            value: [],
          },
          {
            name: "高新区",
            value: [],
          },
        ],
        yAxis: [],
      },

      cyssffData: {
        name: "",
        unit: "万",
        value: [
          {
            name: "数量1",
            data: [400, 200, 500, 300, 600],
            stack: "1",
          },
          {
            name: "数量2",
            data: [100, 50, 60, 80, 30],
          },
        ],
        xAxis: ["y1", "y2", "y3", "y4", "y5"],
      },
      cyzjzffData: {
        name: "",
        unit: "万",
        value: [
          {
            name: "数量1",
            data: [20, 30, 40, 50, 60],
            stack: "1",
          },
          {
            name: "数量2",
            data: [70, 50, 60, 80, 30],
          },
        ],
        xAxis: ["1月", "2月", "3月", "4月", "5月"],
      },
    };
  },
  components: {
    Wordcloud,
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      api2.data.getIndustrialStructure().then((res) => {
        console.log("产业结构", res.data.data);
        this.industrialStructure = res.data.data.map((el, i) => {
          return {
            name: el.name,
            y: Number(el.values),
            opacity: 1,
            color: this.colors2[i],
          };
        });
        console.log("cyjgData", this.industrialStructure);
      });
      api.data.getTalentAnalysis().then((res) => {
        console.log("人才分析", res.data.data);
        this.talentAnalysis = res.data.data;
      });
      api.data.getTalentDemandAnalysis().then((res) => {
        console.log("人才需求学历分析", res.data.data);
        this.talentDemandAnalysis = res.data.data;
        this.xuelifxData = this.talentDemandAnalysis.hjPosts.map((el) => {
          return {
            name: el,
            value: 1,
          };
        });
        this.talentDemands = this.talentDemandAnalysis.talentDemands.map(
          (el) => {
            return {
              name: el.name,
              value: el.values,
            };
          }
        );
      });
      api.data.getEconomicOfLIJRAnalysis().then((res) => {
        console.log("主导产业经济分析-金融产业", res.data.data);
        this.LIJRAnalysis = res.data.data;
      });
      api.data.getEconomicOfLISMAnalysis().then((res) => {
        console.log("主导产业经济分析-商贸服务产业", res.data.data);
        this.LISMAnalysis = res.data.data;
      });
      api.data.getIndustrialTaxAnalysis().then((res) => {
        console.log("产业税收贡献度分析", res.data.data);
        this.industrialTaxAnalysis = res.data.data;
        console.log(this.industrialTaxAnalysis);
        this.cyssData = {
          value: this.industrialTaxAnalysis[0].values,
          name: this.industrialTaxAnalysis[0].name,
        };
        this.gxdzfData = {
          value: [this.industrialTaxAnalysis[1].values],
          name: this.industrialTaxAnalysis[1].name,
          yAxis: ["y1"],
        };
        this.jrcyssData = {
          value: this.industrialTaxAnalysis[2].values,
          name: this.industrialTaxAnalysis[2].name,
        };
        this.smfwcyData = {
          value: this.industrialTaxAnalysis[3].values,
          name: this.industrialTaxAnalysis[3].name,
        };
      });
      api.data.getCompareIndustrialEconomic().then((res) => {
        console.log("产业经济对标", res.data.data);
        res.data.data.jzDatas.forEach((el) => {
          this.chartData.yAxis.push(el.name);
          this.chartData.value[0].value.push(el.values);
        });
        res.data.data.gxDatas.forEach((el) => {
          this.chartData.value[1].value.push(el.values);
        });
      });
    },
    loadBuildingMarker() {
      // loadBuildingMarker();
    },
  },
};
</script>
<style scoped lang="scss">
@import "../overview/overview.scss";
.module-contianer {
  height: calc(100vh - 100px);
}
.panel-list {
  .panel {
    width: 33.33%;
    justify-content: flex-start;
  }
}

.num-block-list {
  display: flex;
  justify-content: flex-end;
  .num-block {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-right: 15px;
    font-size: 14px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.block {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;

  &.b1 {
    background-image: url("../../assets/img/pt2.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  &.b2 {
    background-image: url("../../assets/img/pt4.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  &.b3 {
    background-image: url("../../assets/img/pt1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
.flex-box {
  height: calc(100vh - 300px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  & > div {
    width: 100%;
  }
  .item-list3 {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    height: 50%;
    .item3 {
      width: 48%;
      display: flex;
      align-items: center;
      min-height: 50px;
      height: 20%;
      background: rgba(75, 213, 255, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(75, 213, 255, 0.2);
      position: relative;
      margin-top: 35px;
      .num {
        color: #ffeeab;
        font-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
      }
      .text-box {
        position: absolute;
        right: 13px;
        width: 210px;
        height: 85%;
        background: #021f42;
        border-radius: 4px;
        border: 1px solid rgba(75, 213, 255, 0.76);
        .text1 {
          color: #ffffff;
          margin-left: 23px;
        }
        .text2 {
          color: #ffd942;
          margin-left: 23px;
        }
      }
    }
  }
}

.item4 {
  display: flex;
  align-items: center;
  margin-top: 15px;
  img {
    width: 46px;
  }
  .text-box {
    // width: 70%;
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    margin-left: 15px;
    .num {
      font-size: 20px;
      color: #75fbfd;
      font-weight: 500;
      margin-left: 15px;
      span {
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
.flex-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  & > div:first-child {
    width: 50%;
    height: 100%;
  }
  & > div:last-child {
    width: 50%;
    // border-radius: 50%;
    height: 100%;
    // background-color: #fff;
    .word-cloud{
      height: 100%;
    }
  }
}
</style>
