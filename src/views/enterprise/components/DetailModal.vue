<template>
  <div class="full-box" @click="close()">
    <div class="detail-modal" @click="$event.stopPropagation()">
      <Title style="width: 365px">企业资质</Title>
      <div class="base-box">
        <div class="info-list">
          <div class="item">
            <div class="name">企业名称:</div>
            <div class="content">{{ name }}</div>
          </div>
          <div class="item">
            <div class="name">统一社会信用代码:</div>
            <div class="content">{{companyInfo.unifiedCreditCode||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">法人代表:</div>
            <div class="content">{{companyInfo.legalPerson||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">公司类型:</div>
            <div class="content">{{companyInfo.companyType||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">行业:</div>
            <div class="content">{{companyInfo.cateOne||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">注册时间:</div>
            <div class="content">{{companyInfo.approvalDate||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">注册地址:</div>
            <div class="content">{{companyInfo.registerDepartment||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">企业员工数:</div>
            <div class="content">{{companyInfo.staffSize||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">税务评级:</div>
            <div class="content">{{companyInfo.creditRating||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">企业营收:</div>
            <div class="content">{{companyInfo.enterpriseRevenue||"-"}}</div>
          </div>
          <div class="item">
            <div class="name">企业融资:</div>
            <div class="content">{{companyInfo.entFinal||"-"}}万元</div>
          </div>
        </div>
        <div class="chart-box">
          <div style="position: absolute; width: 330px; height: 280px">
            <RadarChart :chartData="chartData"></RadarChart>
          </div>
          <div class="other-box">
            <div>
              <LoopPercent
                id="kl1"
                :chartData="chartData1"
                :diy="false"
              ></LoopPercent>
            </div>
            <div>
              <LoopPercent
                id="kl2"
                :chartData="chartData2"
                :diy="false"
              ></LoopPercent>
            </div>
            <div>
              <LoopPercent
                id="kl3"
                :chartData="chartData3"
                :diy="false"
              ></LoopPercent>
            </div>
            <div>
              <LoopPercent
                id="kl4"
                :chartData="chartData4"
                :diy="false"
              ></LoopPercent>
            </div>
            <div>
              <LoopPercent
                id="kl5"
                :chartData="chartData5"
                :diy="false"
              ></LoopPercent>
            </div>
          </div>
          <div class="score-box">
            <div class="text">综合评分</div>
            <div class="score">{{avgScore||"-"}}</div>
          </div>
        </div>
      </div>
      <img
        @click="close()"
        class="close-btn"
        src="../../../assets/img/close.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import api from "@/api/ndApi/enterprise/home";

export default {
  data() {
    return {
      tipShow: false,
      chartData: {
        data: [{ value: [], name: "综合评分" }],
        indicator: [
          { name: "企业资质", unit: "分", min: 0, max: 100 },
          { name: "经营行为", unit: "分", min: 0, max: 100 },
          { name: "关联关系", unit: "分", min: 0, max: 100 },
          { name: "涉诉行为", unit: "分", min: 0, max: 100 },
          { name: "经营风险", unit: "分", min: 0, max: 100 },
        ],
      },
      chartData1: {
        insideLabel: "企业资质(分)",
        middleLabel: "",
        value: 0,
      },
      chartData2: {
        insideLabel: "经营行为(分)",
        middleLabel: "",
        value: 0,
      },
      chartData3: {
        insideLabel: "关联关系(分)",
        middleLabel: "",
        value: 0,
      },
      chartData4: {
        insideLabel: "涉诉行为(分)",
        middleLabel: "",
        value: 0,
      },
      chartData5: {
        insideLabel: "经营风险(分)",
        middleLabel: "",
        value: 0,
      },
      avgScore:0,
      companyInfo:{
        unifiedCreditCode:null,
        companyType:null,
        legalPerson:null,
        cateOne:null,
        approvalDate:null,
        registerDepartment:null,
        staffSize:null,
        creditRating:null,
      },
    };
  },
  props: ["name"],
  created() {
    this.loadData();
  },
  methods: {
    close() {
      this.$emit("close", "close");
    },
    loadData() {
      let data = {
        companyName:this.name
      }
      api.data.getEnterpriseBaseScoreInfos(this.name).then((res) => {
        console.log("", res.data.data);
        const resData = res.data.data
        this.avgScore = resData.avgScore.toFixed(2)
        this.chartData.data[0].value=[resData.baseScore,resData.behaviorScore,resData.correlationScore,resData.litigationScore,resData.riskScore]
        this.chartData1.value = resData.baseScore
        this.chartData2.value = resData.behaviorScore
        this.chartData3.value = resData.correlationScore
        this.chartData4.value = resData.litigationScore
        this.chartData5.value = resData.riskScore
      });
      api.data.getEnterpriseDetailInfoApis(data).then((res) => {
        console.log("资质分", res.data.data);
        const resData = res.data.data
        this.companyInfo = resData
   
      });
    },
    test(event) {
      event.stopPropagation();
    },
  },
};
</script>

<style lang="scss" scoped>
.full-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: all;
}

.detail-modal {
  width: 934px;
  height: 55vh;
  background: rgba(0, 17, 31, 0.7);
  border: 1px solid #006e86;
  padding: 12px;
  position: relative;
  .close-btn {
    position: absolute;
    top: 13px;
    right: 0;
    width: 25px;
    cursor: pointer;
  }
}

.base-box {
  display: flex;
  justify-content: space-between;
  padding: 30px 20px;
  height: calc(100% - 85px);
}

.info-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .item {
    display: flex;
    // margin-top: 8px;
    .name {
      color: #60c4ff;
      font-weight: bold;
      width: 150px;
    }
    .content {
      font-weight: bold;
      color: #def6ff;
    }
  }
}

.chart-box {
  position: absolute;
  top: 40px;
  right: 0;
  flex-grow: 1;
  height: 561px;
  width: 500px;
  .other-box {
    width: 100%;
    height: 320px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    position: absolute;
    bottom: 0;
    > div {
      width: 33%;
      height: 150px;
    }
  }
}

.score-box {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 30px;
  top: 110px;
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
</style>
