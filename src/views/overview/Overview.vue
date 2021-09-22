<template>
  <div class="module-contianer">
    <div class="map-bg">
      <div class="by"></div>
    </div>
    <div class="panel-list">
      <div class="panel">
        <Title>地理概况</Title>
        <div class="item-box">
          <div class="item" v-for="item in geography" :key="item.name">
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <div class="map-zone">
          <img src="../../assets/img/map.png" alt="" />
        </div>
        <Title>基础设施</Title>
        <Title level="level2">公服配套优势</Title>
        <div class="round-list">
          <div
            class="round"
            :style="item.bg"
            v-for="item in publicServiceSupporting"
            :key="item.name"
          >
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="panel" style="height: 115px; position: relative; padding: 0">
        <div class="text-bg">
          新兴世界城市金融CBD核心区<br />世界知名公园式商圈样板区
        </div>
      </div>
      <div class="panel text-panel">
        <Title>产业发展</Title>
        <Title level="level2">产业结构</Title>
        <div class="gl-chart-box" style="margin: 0">
          <PieChartg
            id="polo3"
            :chartData="industrialStructure"
            :radius="['45%', '60%']"
            legendType="scroll"
          />
        </div>
        <Title level="level2">典型载体</Title>
        <div class="item-box item-box2">
          <div
            class="item item33"
            v-for="item in typicalCarrier"
            :key="item.name + item.values"
          >
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">企业概况</Title>
        <div class="item-box">
          <div class="item" v-for="item in enterpriseProfile" :key="item.name">
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <Title level="level2">税收</Title>
        <div class="item-box">
          <div class="item item50" v-for="item in taxRevenue" :key="item.name">
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <Title>客流活力</Title>
        <div class="item-box">
          <!-- <div
            class="item"
            style="width: 50%"
            v-for="item in passengerVolume"
            :key="item.name"
          >
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div> -->
          <div class="item item50">
            <div>工作日客流</div>
            <div class="num">{{ workday }} <span>人次</span></div>
          </div>
          <div class="item item50">
            <div>周末客流</div>
            <div class="num">{{ weekend }} <span>人次</span></div>
          </div>
        </div>

        <Title style="margin-top: 15px">职住人口</Title>
        <div class="item-box">
          <!-- <div class="item" v-for="item in population" :key="item.name">
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div> -->
          <div class="item item50">
            <div>就业</div>
            <div class="num">{{ workNum }} <span>人</span></div>
          </div>
          <div class="item item50">
            <div>居住</div>
            <div class="num">{{ resNum }} <span>人</span></div>
          </div>
        </div>
        <Title style="margin-top: 15px">商业发展</Title>
        <div class="item-with-img-box" style="margin-top: 15px">
          <div class="item-with-img-bg"></div>
          <div class="item-with-img">
            <img src="../../assets/img/zhaoshang.png" alt="" />
            <div class="title">购物中心数量</div>
            <div class="num">8 <span>个</span></div>
          </div>
        </div>

        <Title level="level2">店铺结构</Title>
        <div style="height: 200px; display: flex; align-items: center">
          <div class="gl-chart-box" style="width: 100%">
            <PieChartg
              id="dpzs"
              :chartData="shopCategoryrate"
              :legendType="null"
              :legendShow="true"
              :labelShow="false"
              :unit="'店铺总数'"
              :titleShow="true"
              :radius="['40%', '55%']"
            />
          </div>
        </div>
        <Title level="level2">签约业态结构</Title>
        <div style="height: 200px; display: flex; align-items: center">
          <div class="gl-chart-box" style="width: 100%">
            <PieChartg
              id="syxms"
              :chartData="contract"
              :legendType="null"
              :legendShow="true"
              :labelShow="false"
              :unit="'商业项目数'"
              :titleShow="true"
              :radius="['40%', '55%']"
            />
          </div>
        </div>
      </div>
      <div class="panel panel4">
        <Title>招商引资</Title>
        <Title level="level2">已入驻代表金融机构</Title>

        <div style="height: 180px; width: 380px">
          <vue-seamless-scroll
            :data="financialsData"
            class="seamless-warp"
            :class-option="defaultOption"
          >
            <ul class="item">
              <li
                v-for="(item, index) in financialsData"
                :key="index"
                :class="{ isactive: item?index % 2 == 0:true }"
              >
                <span :class="{index:item?true:false }" v-text="item?index + 1:''"></span>
                <span class="title" v-text="item"></span>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>

        <Title level="level2">重要商业项目</Title>
        <div style="height: 180px; width: 380px">
          <vue-seamless-scroll :data="projectsData"  :class-option="defaultOption2" class="seamless-warp">
            <ul class="item">
              <li
                v-for="(item, index) in projectsData"
                :key="index"
                :class="{ isactive: item?index % 2 == 0:true }"
              >
                <span :class="{index:item?true:false }" v-text="item?index + 1:''"></span>
                <span class="title" v-text="item"></span>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
        <div class="item-with-img-box">
          <div class="item-with-img-bg"></div>
          <div class="item-with-img">
            <img src="../../assets/img/zhaoshang.png" alt="" />
            <div class="title">招商引资金额</div>
            <div class="num">
              {{ attractInvestment.amount }} <span>亿元</span>
            </div>
          </div>
        </div>
        <Title level="level2">最新招商项目</Title>
        <div class="item-box item-box2">
          <div
            class="item item100"
            v-for="item in newProjects"
            :key="item.name"
          >
            <div>{{ item.name }}</div>
            <div class="num">
              {{ item.values }} <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./overview.scss";
.left-panel {
  background: none;
  padding: 10px 10px 5px 20px;
}
.right-panel {
  background: none;
  padding: 10px 20px 5px 10px;
}
.seamless-warp {
  height: 100%;
  overflow: hidden;
  .item {
    width: 100%;
    & > li {
      height: 40px;
      line-height: 40px;
      background: rgba(36, 63, 83, 0.7);
      opacity: 0.7;
      padding-left: 10px;
    }
    .isactive {
      background-color: rgba(16, 43, 58, 0.5);
    }
    .title {
      display: inline-block;
      text-indent: 1em;
      font-size: 14px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #dfe5e8;
    }
    .index {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      background: #00b48f;
      border-radius: 2px;
      text-align: center;
    }
  }
}
</style>

<script>
// import store from '@/store'
import api from "@/api/ndApi/overview/overview";
export default {
  data() {
    return {
      geography: [],
      facilitiesOverview: [],
      publicServiceSupporting: [],
      passengerVolume: [],
      population: [],
      attractInvestment: {},
      typicalCarrier: [],
      enterpriseProfile: [],
      taxRevenue: [],
      // loaded: false,
      newProjects: [],
      financialsData: [],
      financials: {
        data: [""],
        oddRowBGC: "#003B5133",
        evenRowBGC: "#0982a655",
        columnWidth: [1],

        // align:[2],
        index: true,
      },
      projects: {
        data: [""],
        oddRowBGC: "#003B5133",
        evenRowBGC: "#0982a655",
        columnWidth: [45],
        index: true,
      },
      workday: null,
      weekend: null,
      workNum: null,
      resNum: null,
      shopCategoryrate: [],
      contract: [],
      projectsData: [],
      industrialStructure: [],
    };
  },
  computed: {
    defaultOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    defaultOption2() {
      return {
        step: 0.8, // 数值越大速度滚动越快
        limitMoveNum: 3, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
      };
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      api.data.getAttractInvestment().then((res) => {
        console.log("招商引资", res.data.data);
        this.attractInvestment = res.data.data;
        this.newProjects = this.attractInvestment.newProjects;
        this.financialsData = this.attractInvestment.financials;
        this.financialsData.push("","")
        this.projectsData = this.attractInvestment.projects;
        this.projectsData.push("","")
      });
      api.data.getBusinessDistricts().then((res) => {
        console.log("商业发展", res.data.data);
      });
      api.data.getEnterpriseProfile().then((res) => {
        console.log("企业概况", res.data.data);
        this.enterpriseProfile = res.data.data;
      });
      api.data.getFacilitiesOverview().then((res) => {
        console.log("设施总览", res.data.data);
        this.facilitiesOverview = res.data.data;
      });
      api.data.getGeography().then((res) => {
        console.log("地理概况", res.data.data);
        this.geography = res.data.data;
      });
      api.data.getIndustrialStructure().then((res) => {
        console.log("产业结构", res.data.data);
        this.industrialStructure = res.data.data.map((el) => {
          return {
            value: el.values,
            name: el.name,
          };
        });
      });
      // api.data.getPassengerVolume().then((res) => {
      //   console.log("客流活力", res.data.data);
      //   this.passengerVolume = res.data.data;
      // });
      // api.data.getPopulation().then((res) => {
      //   console.log("职住人口", res.data.data);
      //   this.population = res.data.data;
      // });
      api.data.getCommercialFlow().then((res) => {
        console.log("fy-客流活力", res.data.data);
        this.workday = res.data.data.workday;
        this.weekend = res.data.data.weekend;
      });
      api.data.getWorkToResidence().then((res) => {
        console.log("fy-职住人口", res.data.data);
        this.workNum = res.data.data.workNum;
        this.resNum = res.data.data.resNum;
      });
      api.data.getShopCategoryrate().then((res) => {
        console.log("fy-店铺结构", res.data.data);
        this.shopCategoryrate = res.data.data.map((el) => {
          return {
            value: el.count,
            name: el.type,
          };
        });
        console.log(this.shopCategoryrate);
      });
      api.data.getContract().then((res) => {
        console.log("fy-商业项目签约业态", res.data.data);
        this.contract = res.data.data.map((el) => {
          return {
            value: el.count,
            name: el.type,
          };
        });
      });

      api.data.getPublicServiceSupporting().then((res) => {
        console.log("公服配套优势", res.data.data);
        this.publicServiceSupporting = res.data.data;
        this.publicServiceSupporting[0]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt3.png") + `)`,
        };
        this.publicServiceSupporting[1]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt2.png") + `)`,
        };
        this.publicServiceSupporting[2]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt4.png") + `)`,
        };
        this.publicServiceSupporting[3]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt1.png") + `)`,
        };
        this.publicServiceSupporting[4]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt4.png") + `)`,
        };
        this.publicServiceSupporting[5]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt1.png") + `)`,
        };
        this.publicServiceSupporting[6]["bg"] = {
          "background-image":
            `url(` + require("../../assets/img/pt3.png") + `)`,
        };
      });
      api.data.getTaxRevenue().then((res) => {
        console.log("税收", res.data.data);
        this.taxRevenue = res.data.data;
      });
      api.data.getTypicalCarrier().then((res) => {
        console.log("典型载体", res.data.data);
        this.typicalCarrier = res.data.data;
      });
    },
  },
};
</script>