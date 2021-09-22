<template>
  <div class="building-list" :class="{ hide: isHide }">
    <img
      class="building-list-btn"
      src="../../../assets/img/building-list-btn.png"
      alt=""
      @click="isHide = !isHide"
    />
    <!-- <div class="search-box">
      <input type="text" v-model="keyword" placeholder="输入楼宇名进行搜索" />
      <div class="btn">搜索</div>
    </div> -->
    <div class="build-name-list">
      <div
        class="item-box"
        v-for="(building, index) in buildingList"
        :key="building.name"
        @click="goto(building.name)"
      >
        <div class="index">{{ index+1 }}</div>
        <div>{{ building.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/ndApi/economy/building";
export default {
  data() {
    return {
      keyword: "",
      isHide: true,
      buildingList: [],
    };
  },
  created() {
    this.getBuildingInfos();
  },
  methods: {
    getBuildingInfos() {
      api.data.getBuildingInfos().then((res) => {
        // console.log(res.data.data.records);
        this.buildingList = res.data.data.records;
        if (typeof this.$route.query.name == "undefined")
          this.goto(this.buildingList[0].name);
      });
    },
    goto(buildingName) {
      this.isHide = true;
      console.log(buildingName);
      this.$router.push({
        path: `/economy/building?name=${buildingName}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.building-list {
  pointer-events: auto;
  width: 374px;
  height: 840px;
  background: #00111f;
  border: 1px solid #883e00;
  position: absolute;
  left: 0;
  top: 20px;
  transition: left 0.5s;
  z-index: 99;
  &.hide {
    left: -376px;
  }
  .building-list-btn {
    width: 55px;
    height: 147px;
    position: absolute;
    right: -42px;
    top: -14px;
    cursor: pointer;
  }
}
.search-box {
  display: flex;
  width: 334px;
  height: 30px;
  background: #00111f;
  border: 1px solid #007375;
  margin: 20px;
  position: relative;

  input {
    background: transparent;
    flex-grow: 1;
    border: none;
    color: #fff;
    padding: 0 10px;
  }
  .btn {
    position: absolute;
    right: 0;
    width: 60px;
    height: 30px;
    background: #007375;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: #02a4a7;
    }
  }
}
.build-name-list {
  margin: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100% - 72px);

  &::-webkit-scrollbar {
    visibility: hidden;
    width: 0;
    height: 0;
  }

  .item-box {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 10px;
    cursor: pointer;
    flex-shrink: 0;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .index {
      width: 20px;
      height: 20px;
      background: #00b48f;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #dfe5e8;
      margin-right: 8px;
    }
  }
}
</style>
