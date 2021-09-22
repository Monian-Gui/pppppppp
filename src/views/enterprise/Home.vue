<template>
  <div class="module-contianer">
    <!-- <div class="left-panel"> -->
    <Panel>
      <div class="top-title-box" style="height:100px">
        <div class="top-title" v-for="(v,i) in tagList" :key="i" @click="handleClick(v,i)"
          :class="active==i?'top-title-active':'top-title-defalt'">
          {{v.name}}
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>总览</Title>
        <div style="height:calc((100vh - 420px) / 2 )">
          <div class="title2">
            <img src="../../assets/img/qiye.png" />
            <div>企业总数</div>
            <div class="num" v-if="overview">{{ overview[0].values }}</div>
            <div>家</div>
          </div>
          <div style="height: 100%; display: flex;justify-content: space-between; flex-wrap: nowrap">
            <div style="width: 60%">
              <PieChartpre :id="'gaoqi'" :chartData="gqData"></PieChartpre>
            </div>
            <div style="width: 30%" class="text-box" v-if="overview">
              <div class="text">{{tagName}}数量</div>
              <div class="num">{{ overview[1].values }} 家</div>
              <div class="text">高新区占比</div>
              <div class="num">{{ overview[2].values }} <span>%</span></div>
            </div>
            <!-- <div style="width: 30%">
              <PieChartpre :id="'guishang'" :chartData="gsData"></PieChartpre>
            </div>
            <div style="width: 20%" class="text-box" v-if="overview">
              <div class="text">规上企业数量</div>
              <div class="num">{{ overview[3].values }} 家</div>
              <div class="text">高新区占比</div>
              <div class="num">{{ overview[4].values }} <span>%</span></div>
            </div> -->
          </div>
        </div>
      </div>
      <!-- <div class="gl-panel-item">
        <Title>{{tagName}}当季营收总览</Title>
        <div class="gl-chart-box">
          <div style="width: 100%; height: calc((100vh - 450px) / 3 );">
            <SupperChart id="gsys" :chartData="chartData" barWidth="15" :color="['#4ADBFF', '#ffa24b']" />
          </div>
        </div>
      </div> -->
      <div class="gl-panel-item">
        <Title>{{tagName}}营收排名</Title>
        <!-- <div class="gl-chart-box"> -->
        <div style="width: 100%; height: calc((100vh - 300px) / 2 );">
          <dv-scroll-board :config="config" style="width: 100%; height: 100%" />
        </div>
        <!-- </div> -->
      </div>
      <!-- </div> -->
    </Panel>
    <Panel type="right">
      <div class="gl-panel-item">
        <Title>{{tagName}}每月税收趋势</Title>
        <div class="gl-chart-box">
          <LineChartsg id="gsqy_tax" :chartData="gsqy_chartData" />
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>{{tagName}}每月营收趋势</Title>
        <div class="gl-chart-box">
          <LineChartsg id="gsqy_operating " :chartData="gsqy_operating_chartData" />
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>{{tagName}}每月税收趋势</Title>
        <div class="gl-chart-box">
          <LineChartsg id="zhzs_tax" :chartData="zhzs_tax_chartData" />
        </div>
      </div>
    </Panel>
    <!-- <div class="icon-list-bg"></div>
    <div class="icon-list">
      <div class="title">
        <div></div>
        图例 - - - - - - - - -
      </div>
      <div class="item" @click="select(1)" :class="{ selected: currentType == 1 }">
        <img src="../../assets/img/gaoqi.png" />高新技术企业
      </div>
      <div class="item" @click="select(2)" :class="{ selected: currentType == 2 }">
        <img src="../../assets/img/guishang.png" />规上企业
      </div>
    </div> -->
    <DetailModal v-if="showModal" :name="$store.state.companyName" @close="close()"></DetailModal>
  </div>
</template>
<script>
  import DetailModal from "./components/DetailModal.vue";
  import api from "@/api/ndApi/enterprise/home";
  import {
    addClusterLayer,
    removeGeneralLayer,
    flyALittle
  } from "mapfunc";
  export default {
    data() {
      return {
        overview: null,
        currentType: 0,
        active: 0,
        tagList: [],
        currentYear: new Date().getFullYear(),
        gsqy_chartData: {
          xAxis: [],
          data: [],
          name: "税收贡献增长",
          unit: "万元"
        },
        gsqy_operating_chartData: {
          xAxis: [],
          data: [],
          name: "营业收入增长",
          unit: "万元"

        },
        zhzs_tax_chartData: {
          xAxis: [],
          data: [],
          name: "税收贡献增长",
          unit: "万元"
        },
        chartData: {
          unit: "单位：千元",
          name: "营收总览",
          value: [{
              name: "当季",
              data: []
            },
            {
              name: "上年同期",
              data: []
            },
          ],
          xAxis: [],
        },
        gsData: {
          value: 20,
          name: "规上企业占比",
        },
        gqData: {
          value: 30,
          name: "",
        },
        gaoqiData: {
          xAxis: ["3月", "4月", "5月", "6月"],
          data: [10, 20, 50, 10],
        },
        tagType: 1,
        tagName: "规上企业",
        colors: ["#4332FF", "#4332FF", "#02CFF9", "#02CFF9"],
        guisData: {
          name: "",
          unit: "万",
          value: [{
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
        showModal: false,
        config: {},
      };
    },
    watch: {
      "$store.state.companyName": {
        handler(e) {
          if (e != "") this.openModal();
        },
        deep: true,
      },
      // tagType
    },
    components: {
      DetailModal,
    },
    mounted() {
      this.getImportantEnterprises();
      this.getEnterpriseTagLists();
      flyALittle();
      this.loadData();
      // console.log(this.$store.state.companyName);
    },
    methods: {
      handleClick(v, i) {
        this.active = i
        this.tagType = v.values
        this.tagName = v.name
        this.getImportantEnterprises();
        this.loadData()
      },
      loadData() {
        api.data.getEnterpriseOverviewNew({
          tagType: this.tagType
        }).then((res) => {
          console.log("企业总览", res.data.data);
          this.overview = res.data.data;
          this.gqData.value = this.overview[2].values;
          this.gqData.name = this.overview[1].name;
          // this.gsData.value = this.overview[4].values;
        });
        // api.data.getRevenueOverview(this.currentYear,this.tagType).then((res) => {
        //   console.log("规上企业当季度营收总览", res.data.data);
        //   res.data.data.djCounts.forEach((el) => {
        //     this.chartData.xAxis.push(el.xvalue);
        //     this.chartData.value[0].data.push(el.yvalue);
        //   });
        //   res.data.data.tnDjCounts.forEach((el) => {
        //     this.chartData.value[1].data.push(el.yvalue);
        //   });
        //   console.log("chartData", this.chartData);
        // });
        api.data.getRevenueRanking(this.currentYear, this.tagType).then((res) => {
          const data = res.data.data;
          console.log(data);
          if (data) {
            let config = {
              data: [],
              oddRowBGC: "#003B5133",
              evenRowBGC: "#0982a655",
              header: ["排名", "企业名称", "营收(千元)"],
              columnWidth: [80, 300, 100],
              headerBGC: "#00BAFF77",
              carousel: "page",
              waitTime: 5000,
              rowNum: 5,
            };
            data.forEach((item) => {
              config.data.push([data.indexOf(item) + 1, item.name, item.amonut]);
            });
            this.config = config;
            this.$forceUpdate();
          }
        });
        //1.归上企业每月税收趋势--
        api.data.getEnterpriseFinanceWithType(1, this.currentYear, {
          tagType: this.tagType
        }).then((res) => {
          const data = res.data.data;
          console.log(data, this.tagName + "每月税收趋势");
          this.gsqy_chartData = this.$options.data().gsqy_chartData
          if (data) {
            this.gsqy_chartData.unit = data[0].unit
            data.forEach(v => {
              this.gsqy_chartData.xAxis.push(v.name + "月")
              this.gsqy_chartData.data.push(v.values)
            })
            this.$forceUpdate();
          }
        });
        // 2.归上企业每月营收趋势
        api.data.getEnterpriseFinanceWithType(2, this.currentYear, {
          tagType: this.tagType
        }).then((res) => {
          const data = res.data.data;
          console.log(data, this.tagName + "每月营收趋势");
          this.gsqy_operating_chartData = this.$options.data().gsqy_operating_chartData
          if (data) {
            this.gsqy_operating_chartData.unit = data[0].unit
            data.forEach(v => {
              this.gsqy_operating_chartData.xAxis.push(v.name + "月")
              this.gsqy_operating_chartData.data.push(v.values)
            })
            this.$forceUpdate();
          }
        });
        // 3.综合治税企业每月税收趋势
        api.data.getEnterpriseFinanceWithType(3, this.currentYear, {
          tagType: this.tagType
        }).then((res) => {
          const data = res.data.data;
          console.log(data, this.tagName + "每月税收趋势");
          this.zhzs_tax_chartData = this.$options.data().zhzs_tax_chartData
          if (data) {
            this.zhzs_tax_chartData.unit = data[0].unit
            data.forEach(v => {
              this.zhzs_tax_chartData.xAxis.push(v.name + "月")
              this.zhzs_tax_chartData.data.push(v.values)
            })
            this.$forceUpdate();
          }
        });
      },
      getImportantEnterprises() {
        api.data.getImportantEnterprises(this.tagType).then((res) => {
          console.log(res.data.data);
          removeGeneralLayer();
          addClusterLayer({
            data: res.data.data,
            entType: this.tagType
          });
        });
      },
      getEnterpriseTagLists() {
        api.data.getEnterpriseTagLists().then((res) => {
          console.log(res.data.data);
          let data = res.data.data
          this.tagList = data
        });
      },
      openModal() {
        // this.$store.state.companyName
        this.showModal = true;
      },
      close() {
        this.showModal = false;
        this.$store.commit("setName", "");
      },
      test(event) {
        console.log(event);
      },
      select(type) {
        console.log(type);
        if (this.currentType == type) this.currentType = 0;
        else this.currentType = type;
        this.getImportantEnterprises();
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import "../overview/overview.scss";

  .top-title-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;

    .top-title {
      width: calc(30% - 20px);
      height: 40px;
      line-height: 45px;
      margin: 5px 5px;
      cursor: pointer;
      text-align: center;
      padding: 0 10px;
      border-radius: 0px;
      font-size: 15px;

    }

    .top-title-defalt {
      background-image: radial-gradient(50% 180%, rgb(0, 7, 51) 40%, rgb(35, 87, 131) 100%);
      color: rgb(135, 187, 231);
      border: 1px solid rgb(65, 117, 161);
    }

    .top-title-active {
      background-image: radial-gradient(50% 180%, rgb(0, 87, 129) 40%, rgb(56, 167, 209) 100%);
      color: rgb(156, 255, 255);
      border: 1px solid rgb(156, 255, 255);
      box-shadow: rgb(156 255 255) 0px 0px 8px;
    }
  }

  .left-panel {
    position: absolute;
    left: 0;
    width: 580px;
    height: 100%;
    background: rgba(0, 18, 38, 0.84);
    padding: 30px 15px;
    box-sizing: border-box;
  }

  .right-panel {
    position: absolute;
    right: 0;
    width: 580px;
    height: 100%;
    background: rgba(0, 18, 38, 0.84);
    padding: 30px 15px;
    box-sizing: border-box;
  }

  .text-box {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .text {
      margin-top: 10px;
      font-size: 13px;
      color: #dadfff;
    }

    .num {
      font-size: 22px;

      span {
        font-size: 13px;
      }
    }
  }

  // .flex-wrap {
  //   display: flex;
  //   & > div {
  //     width: 50%;
  //     height: 100%;
  //   }
  // }
  .title2 {
    margin: 30px 0 0 30px;
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

  .icon-list-bg {
    width: 232px;
    height: 150px;
    background: rgba(0, 18, 38, 0.9);
    filter: blur(10px);
    position: fixed;
    bottom: 0;
    right: 25%;
    pointer-events: auto;
  }

  .icon-list {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 232px;
    // height: 257px;
    box-sizing: border-box;
    padding: 35px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    right: 25%;

    .title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      &::after {
        content: "";
        width: 8px;
        height: 8px;
        border: 2px solid #1890ff;
        border-radius: 50%;
        position: absolute;
        right: 0;
      }

      &::before {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        background: #1890ff;
        // border: 1px solid #1890ff;
        border-radius: 50%;
        left: -15px;
      }

      // >div {
      //   width: 10px;
      //   height: 10px;
      //   background: #1890ff;
      //   border-radius: 50%;
      //   margin-right: 10px;
      // }
    }

    .item {
      display: flex;
      align-items: center;
      color: #fff;
      margin-left: 15px;
      cursor: pointer;
      pointer-events: auto;

      img {
        width: 30px;
        margin-right: 10px;
      }
    }
  }
</style>