<template>
  <div class="module-contianer">
    <BuildingList></BuildingList>
    <div class="panel-list">
      <div class="panel left-panel">
        <Title>楼宇画像</Title>
        <div
          style="
            position: relative;
            margin-top: 15px;
            height: calc((100vh - 215px) / 3);
          "
        >
          <div v-if="radarChartData" style="width: 90%; height: 100%">
            <RadarChart :chartData="radarChartData"></RadarChart>
          </div>
          <div class="score-box">
            <div class="text">综合评分</div>
            <div class="score">{{ score }}</div>
          </div>
        </div>
        <Title>产业情况</Title>
        <div class="item-list" style="height: calc((100vh - 215px) / 3)">
          <div class="item" v-for="item in industrySituation" :key="item.name">
            <img src="../../assets/img/qingkuang.png" alt="" />
            <div class="text-box">
              <div class="text1">{{ item.name }}</div>
              <div class="text2">
                {{ item.values }}<span> {{ item.unit }}</span>
              </div>
            </div>
          </div>
          <!-- <div class="item" style="width: 45%">
            <img src="../../assets/img/qingkuang.png" alt="" />
            <div class="text-box">
              <div class="text1">外资利用规模</div>
              <div class="text2">30<span>%</span></div>
            </div>
          </div>
          <div class="item">
            <img src="../../assets/img/qingkuang.png" alt="" />
            <div class="text-box">
              <div class="text1">楼宇税收</div>
              <div class="text2">623.24<span>亿元</span></div>
            </div>
          </div>
          <div class="item" style="width: 45%">
            <img src="../../assets/img/qingkuang.png" alt="" />
            <div class="text-box">
              <div class="text1">亿元楼宇</div>
              <div class="text2">是</div>
            </div>
          </div> -->
        </div>

        <Title>行业分布</Title>
        <div style="height: calc((100vh - 215px) / 3); padding: 20px 0 0 0">
          <FunnelChart3D
            id="cyjg"
            :chartData="industrialStructure"
            :neckObj="{ neckWidth: '20%', width: '60%' }"
            :unit="'家'"
          ></FunnelChart3D>
        </div>
      </div>
      <div class="panel mid-panel">
        <Title style="width: 390px">基础设施</Title>
        <div class="base-box" v-if="baseInfo">
          <img :src="imgUrl" alt="" />
          <!-- <img :src="baseInfo.picUrl != null ? baseInfo.picUrl : ''" alt="" /> -->
          <div class="info-list">
            <div class="item">
              <div class="name">楼宇名称:</div>
              <div class="content">{{ baseInfo.name||"-" }}</div>
            </div>
            <div class="item">
              <div class="name">物业公司:</div>
              <div class="content">{{ baseInfo.propertyCompany||"-" }}</div>
            </div>
            <div class="item">
              <div class="name">停车位:</div>
              <div class="content">{{ baseInfo.parkingCount||"-" }} 个</div>
            </div>
            <div class="item">
              <div class="name">入住企业数:</div>
              <div class="content">{{ baseInfo.entCount||"-" }} 家</div>
            </div>
            <div class="item">
              <div class="name">楼宇性质:</div>
              <div class="content">{{ baseInfo.propertyType||"-" }}</div>
            </div>
            <div class="item">
              <div class="name">楼宇等级:</div>
              <div class="content">{{ baseInfo.level||"-" }}</div>
            </div>
            <div class="item">
              <div class="name">楼宇位置:</div>
              <div class="content">{{ baseInfo.address||"-" }}</div>
            </div>
            <div class="item">
              <div class="name">楼宇面积:</div>
              <div class="content">{{ baseInfo.standardFloorArea ||"-"}}</div>
            </div>
            <div class="item">
              <div class="name">楼层数:</div>
              <div class="content">{{ baseInfo.floorNumbers||"-" }} 层</div>
            </div>
          </div>
        </div>
        <Title style="width: 390px">企业影响</Title>
        <div class="item-list2" v-if="enterpriseInfluence">
          <div class="item">
            <div class="title">上市企业数量</div>
            <div class="num">
              {{ enterpriseInfluence[0].values }} <span>个</span>
            </div>
            <div class="datanone" v-if="sslist.length == 0">
              <img src="../../assets/img/datanone.png" alt="" />
            </div>
            <vue-seamless-scroll v-else :data="sslist" class="seamless-warp">
              <ul>
                <li
                  v-for="(item, index) in sslist"
                  :key="index"
                  :class="{ isactive: index % 2 == 0 }"
                >
                  <span class="index" v-text="index + 1"></span>
                  <span class="title22" v-text="item"></span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
          <div class="item">
            <div class="title">高新科技企业数量</div>
            <div class="num">
              {{ enterpriseInfluence[1].values }} <span>个</span>
            </div>
            <div class="datanone" v-if="gqlist.length == 0">
              <img src="../../assets/img/datanone.png" alt="" />
            </div>
            <vue-seamless-scroll v-else :data="gqlist" class="seamless-warp">
              <ul>
                <li
                  v-for="(item, index) in gqlist"
                  :key="index"
                  :class="{ isactive: index % 2 == 0 }"
                >
                  <span class="index" v-text="index + 1"></span>
                  <span class="title22" v-text="item"></span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
          <div class="item">
            <div class="title">规上企业数量</div>
            <div class="num">
              {{ enterpriseInfluence[2].values }} <span>个</span>
            </div>
            <div class="datanone" v-if="gslist.length == 0">
              <img src="../../assets/img/datanone.png" alt="" />
            </div>
            <vue-seamless-scroll v-else :data="gslist" class="seamless-warp">
              <ul>
                <li
                  v-for="(item, index) in gslist"
                  :key="index"
                  :class="{ isactive: index % 2 == 0 }"
                >
                  <span class="index" v-text="index + 1"></span>
                  <span class="title22" v-text="item"></span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
        </div>
        <div style="height: 120px"></div>
      </div>
      <div class="panel right-panel">
        <Title>经营情况</Title>
        <div
          v-if="operation"
          style="display: flex; flex-wrap: wrap; width: 100%; height: calc((100vh - 200px ) / 2)"
        >
          <div style="width: 50%; height: 50%">
            <LoopPercent
              id="jy1"
              :radius="55"
              :chartData="{
                insideLabel: '写字楼使用率',
                value: operation[0].values||0,
                value1: 100,
              }"
            ></LoopPercent>
          </div>
          <div style="width: 50%; height: 50%">
            <LoopPercent
              id="jy2"
              :radius="55"
              :chartData="{
                insideLabel: '商业使用率',
                value: operation[1].values||0,
                value1: 100,
              }"
            ></LoopPercent>
          </div>
          <div style="width: 50%; height: 50%">
            <LoopPercent
              id="jy3"
              :radius="55"
              :chartData="{
                insideLabel: '平均月租金',
                value: operation[2].values||0,
                value1: 100,
              }"
            ></LoopPercent>
          </div>
          <div style="width: 50%; height: 50%">
            <LoopPercent
              id="jy4"
              :radius="55"
              :chartData="{
                insideLabel: '入区率（高新区属地注册率）',
                value: operation[3].values||0,
                value1: 100,
              }"
            ></LoopPercent>
          </div>
        </div>
        <Title>区内楼宇经济指标排名</Title>
        <div style="height: calc((100vh - 200px ) / 2)">
          <SupperChart
            :chartData="chartData"
            barWidth="15"
            :color="['#4ADBFF', '#ffa24b']"
          />
        </div>
        <!-- <div class="item-list3">
          <div class="item-with-img-box">
            <div class="item-with-img-bg"></div>
            <div class="item-with-img">
              <img src="../../assets/img/jiaotong.png" alt="" />
              <div class="title">交通配套信息</div>
              <div class="num">暂无相关数据</div>
            </div>
          </div>
          <div class="item-with-img-box">
            <div class="item-with-img-bg"></div>
            <div class="item-with-img">
              <img src="../../assets/img/zhengwu.png" alt="" />
              <div class="title">政务服务配套</div>
              <div class="num">暂无相关数据</div>
            </div>
          </div>
          <div class="item-with-img-box">
            <div class="item-with-img-bg"></div>
            <div class="item-with-img">
              <img src="../../assets/img/shangwu.png" alt="" />
              <div class="title">商务配套信息</div>
              <div class="num">暂无相关数据</div>
            </div>
          </div>
          <div class="item-with-img-box">
            <div class="item-with-img-bg"></div>
            <div class="item-with-img">
              <img src="../../assets/img/canyin.png" alt="" />
              <div class="title">餐饮配套信息</div>
              <div class="num">暂无相关数据</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import BuildingList from "./components/BuildingList.vue";
import api from "@/api/ndApi/economy/building";
import base from "@/api/ndApi/base";
export default {
  components: {
    BuildingList,
  },
  data() {
    return {
      baseInfo: null,
      radarChartData: null,
      buildingName: null,
      score: null,
      industrySituation: null,
      industrialStructure: null,
      chartData: {
        unit: "排名",
        name: "",
        data: [],
        xAxis: [],
      },
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

      operation: null,
      enterpriseInfluence: null,
      financialsData: [],
      sslist: [],
      gqlist: [],
      gslist: [],
      imgUrl: null,
    };
  },
  mounted() {
    this.buildingName = this.$route.query.name;
  },
  watch: {
    $route() {
      this.buildingName = this.$route.query.name;
    },
    buildingName() {
      this.getBuildingData();
    },
  },
  methods: {
    getBuildingData() {
      console.log(this.buildingName);
      if (typeof this.buildingName == "undefined" || this.buildingName == null)
        return;
      api.data.getBuildingBaseInfo(this.buildingName).then((res) => {
        console.log("基础情况", res.data.data);
        this.baseInfo = res.data.data;
        this.imgUrl = base.liantong + this.baseInfo.picUrl;
      });
      api.data.getIndustrySituation(this.buildingName).then((res) => {
        console.log("产业情况", res.data.data);
        this.industrySituation = res.data.data;
      });
      api.data.getIndustryStructrue(this.buildingName).then((res) => {
        console.log("行业分布", res.data.data);
        this.industrialStructure = res.data.data.map((el, i) => {
          return {
            name: el.name,
            y: parseFloat(el.values),
            opacity: 1,
            color: this.colors2[i],
          };
        });
        // this.industrialStructure = res.data.data;
        console.log(this.industrialStructure);
      });
      api.data.getBuildingPortrait(this.buildingName).then((res) => {
        console.log("楼宇画像", res.data.data);
        // this.radarChartData = res.data.data;
        let data = {
          data: [{ value: [] }],
          indicator: [],
        };
        this.score = res.data.data[0].values;
        for (let index = 1; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          data.data[0].value.push(element.values);
          data.indicator.push(element);
        }
        this.radarChartData = data;
      });
      api.data.getEnterpriseInfluence(this.buildingName).then((res) => {
        console.log("企业影响", res.data.data);
        this.enterpriseInfluence = res.data.data;
        this.sslist = this.enterpriseInfluence[0].enterpriseLists;
        this.gqlist = this.enterpriseInfluence[1].enterpriseLists;
        this.gslist = this.enterpriseInfluence[2].enterpriseLists;
      });
      api.data.getOperation(this.buildingName).then((res) => {
        console.log("经营情况", res.data.data);
        this.operation = res.data.data;
      });
      api.data.getBuildingRankingInfos(this.buildingName).then((res) => {
        console.log("经济指标排名", res.data.data);
        this.chartData.xAxis = [];
        this.chartData.data = [];
        res.data.data.forEach((el) => {
          this.chartData.xAxis.push(el.name);
          this.chartData.data.push(el.values);
        });
      });
      // api.data.getIndustryStructrue(this.buildingName).then((res) => {
      //   console.log("产业结构", res.data.data);
      // });
      // api.data.getSupportingConditions(this.buildingName).then((res) => {
      //   console.log("配套情况", res.data.data);
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../overview/overview.scss";
.module-contianer {
  height: calc(100vh - 100px);
}
.panel-list {
  justify-content: space-between;
}

.panel {
  height: 100%;
  padding: 30px 15px;
  box-sizing: border-box;
}

.left-panel {
  width: 23.7% !important;
}

.right-panel {
  width: 23.7% !important;
}

.mid-panel {
  width: 49.8% !important;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px 0;

  .item {
    display: flex;
    align-items: center;
    width: 50%;
    margin-top: 10px;
    img {
      width: 35%;
      box-shadow: 0px 0px 45px 12px #02172b;
    }

    .text-box {
      margin-left: 15px;
      .text1 {
        font-size: 13px;
        font-weight: 400;
        color: #dadfff;
      }
      .text2 {
        margin-top: 5px;
        font-size: 21px;
        font-weight: 500;
        color: #ffffff;
        line-height: 22px;
        text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.27);
        background: linear-gradient(180deg, #f0f7ff 0%, #5c8acd 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        span {
          font-size: 15px;
        }
      }
    }
  }
}

.base-box {
  display: flex;
  justify-content: flex-start;
  padding: 0 12px 12px 12px;
  margin-top: 15px;
  height: calc((100vh - 150px) / 3);
  img {
    width: 430px;
    height: 324px;
    // border: 1px solid #ccc;
  }
}

.info-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 30px;
  .item {
    display: flex;
    // margin-top: 8px;
    .name {
      color: #60c4ff;
      font-weight: bold;
      width: 100px;
    }
    .content {
      font-weight: bold;
      color: #def6ff;
    }
  }
}

.item-list2 {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  height: calc((100vh - 150px) / 3);
  width: 100%;
  .item {
    background-image: url("../../assets/img/yingxiang2.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    min-width: 284px;
    width: calc((100% - 30px) / 3);
    height: 100%;
    // height: calc((100vh - 150px) / 3);
    position: relative;
    .title {
      position: absolute;
      top: 20%;
      left: 37%;
      font-size: 20px;
      font-weight: 400;
      color: #c9ecf5;
    }
    .num {
      position: absolute;
      top: 30%;
      left: 37%;
      font-size: 30px;
      color: #ffeeab;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 156px;
      span {
        font-size: 13px;
        color: #a3d2de;
      }
    }
  }
}

.title2 {
  margin: 30px;
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
    margin: 0 10px;
  }
}

.item-list3 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
  .item-with-img-box {
    margin-top: 10px;

    .item-with-img-bg {
      position: absolute;
    }
  }
  .num {
    font-size: 16px;
  }
}

.score-box {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 95px;
  .text {
    font-size: 14px;
    font-weight: 400;
    color: #dadfff;
  }
  .score {
    font-weight: 300;
    color: #ffd500;
    font-size: 40px;
  }
}

.seamless-warp {
  height: 53%;
  overflow: hidden;
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: calc(100% - 4px);
  ul {
    width: 100%;
    & > li {
      height: 40px;
      line-height: 40px;
      background: rgba(36, 63, 83, 0.7);
      opacity: 0.8;
      padding-left: 10px;
    }
    .isactive {
      background-color: rgba(16, 43, 58, 0.5);
    }
    .title22 {
      display: inline-block;
      text-indent: 1em;
      font-size: 12px !important;
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
.datanone {
  width: 100%;
  height: 100%;
  position: relative;
  // background-color: #fff;
  & > img {
    width: 70px;
    height: 70px;
    position: absolute;
    left: 0;
    right: 0;
    top: 45%;
    bottom: 0;
    margin: auto;
  }
}
</style>