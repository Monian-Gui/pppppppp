<template>
  <div class="full-box" @click="close()">
    <div class="detail-modal" @click="$event.stopPropagation()">
      <Title style="width: 365px">项目信息</Title>
      <div class="base-box">
        <div class="info-list">
          <div class="item">
            <div class="name">项目名称:</div>
            <div class="content">{{ name }}</div>
          </div>
          <template v-if="data">
            <div class="item">
              <div class="name">规划总用地面积:</div>
              <div class="content">{{ data.areaGh }} m²</div>
            </div>
            <div class="item">
              <div class="name">总建筑面积:</div>
              <div class="content">{{ data.buildingArea }} m²</div>
            </div>
            <div class="item">
              <div class="name">高度:</div>
              <div class="content">{{ data.height }} m</div>
            </div>
            <div class="item">
              <div class="name">办公:</div>
              <div class="content">{{ data.areaWork }} m²</div>
            </div>
            <div class="item">
              <div class="name">商业:</div>
              <div class="content">{{ data.areaBusiness }} m²</div>
            </div>
            <div class="item">
              <div class="name">住宅:</div>
              <div class="content">{{ data.areaResidence }} m²</div>
            </div>
            <div class="item">
              <div class="name">容积率:</div>
              <div class="content">{{ data.plotRatio }}</div>
            </div>
            <div class="item">
              <div class="name">建筑密度:</div>
              <div class="content">{{ data.buildingDensity }}</div>
            </div>
            <div class="item">
              <div class="name">机动车位:</div>
              <div class="content">{{ data.parkingNum }}</div>
            </div>
            <div class="item">
              <div class="name">非机动车位:</div>
              <div class="content">{{ data.nonMotorizedNum }}</div>
            </div>
            <div class="item">
              <div class="name">用途:</div>
              <div class="content">{{ data.purpose }}</div>
            </div>
          </template>
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
import api from "@/api/ndApi/serve/land";
export default {
  data() {
    return {
      tipShow: false,
      data: null,
    };
  },
  props: ["name"],
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      api.data.getLandDetailInfoWithName(this.name).then((res) => {
        this.data = res.data.data;
        console.log(this.data);
      });
    },
    close() {
      this.$emit("close", "close");
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
  width: 500px;
  height: 561px;
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
    align-items: center;
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
    height: 300px;
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
