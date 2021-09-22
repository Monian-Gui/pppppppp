<template>
  <div class="module-contianer">
    <div class="left-panel">
      <div style="display:flex;justify-content: space-around;align-items: center;">
        <div style="width:45%">
          <GradualBtn
            style="width: 100%;"
            size="mini"
            fontSize="20px"
            color="#235783"
          >
            <!-- {{ item }} -->
            总面积：{{ TotalArea||0 }}万㎡
          </GradualBtn>
        </div>
        <div>
          <div class="jcqk" @click="select('yjc')">
            <div></div>
            已建成
          </div>
          <div class="jcqk" @click="select('wjc')">
            <div class="wjc"></div>
            未建成
          </div>
        </div>
      </div>
      <Title>土地载体总览</Title>
      <div style="display: flex">
        <div style="width: 49%; height: calc((100vh - 352px) / 2)">
          <PieChartg
            id="tudikaifa"
            :radius="['40%', '55%']"
            :radius2="['40%', '38%']"
            :chartData="tudizlData"
            legendType="scroll"
          />
        </div>
        <div style="width: 49%; height: calc((100vh - 352px) / 2)">
          <PieChartg
            id="tudikaifazanbi"
            :radius="['40%', '55%']"
            :radius2="['40%', '38%']"
            :chartData="tudizlData2"
            legendType="scroll"
          />
        </div>
      </div>

      <Title>土地利用</Title>
      <div style="height: calc((100vh - 352px) / 2)">
        <PieChartg
          id="tudiliy"
          :radius="['45%', '60%']"
          :chartData="tudiliyData"
          legendType="scroll"
        />
      </div>
    </div>
    <div class="icon-list-bg"></div>
    <div class="icon-list">
      <div class="title">
        <div></div>
        图例 - - - - - - - - -
      </div>
      <div class="item-list">
        <div
          class="item"
          v-for="item in stops"
          :key="item.name"
          @click="select(item[0])"
        >
          <div
            style="width: 20px; height: 20px"
            :style="{ background: item[1] }"
          ></div>
          {{ item[0] }}
        </div>
        <div
          class="item"
          @click="select('全部',true)"
        >
          <div
            style="width: 20px; height: 20px"
            :style="{ background: '#dddd' }"
          ></div>
          全部
        </div>
      </div>
    </div>
    <DetailModal
      v-if="showModal"
      :name="$store.state.companyName"
      @close="close()"
    ></DetailModal>
  </div>
</template>

<script>
import {
  addFillLayer2,
  flyALittle,
  removeGeneralLayer,
  removeLayerById,
} from "mapfunc";
import api from "@/api/ndApi/serve/land";
import DetailModal from "./components/DetailModal.vue";
export default {
  components: {
    DetailModal,
  },
  data() {
    return {
      UserName: "admin",
      UserPwd: "123",
      redirect: undefined,
      showModal: false,
      identifyCodes: "1234567890",
      identifyCode: "",
      iptIdentify: "",
      tudizlData: [
        { value: 0, name: "已建" },
        { value: 0, name: "待建" },
      ],
      TotalArea:"",
      tudizlData2: [
        { value: 0, name: "总地块商业占比" },
        { value: 0, name: "住宅占比" },
        { value: 0, name: "公共服务占比" },
        { value: 0, name: "其他占比" },
      ],
      tudikaifaData: [],
      tudiliyData: [],
      stops: [],
      newLandData: null,
      selected: "",
    };
  },
  watch: {
    "$store.state.companyName": {
      handler(e) {
        if (e != "") this.openModal();
      },
      deep: true,
    },
  },
  mounted() {
    this.getTotalArea()
    this.loadData();
    this.addPlotLayer();
    flyALittle();
  },
  beforeDestroy() {
    // removeLayerById("plot");
    removeLayerById(["fill_layer_border", "fill_layer_symbol", "fill_layer"]);
    removeGeneralLayer();
  },
  methods: {
    loadData() {
      api.data.getDevelopmentSituation().then((res) => {
        console.log("土地开发情况", res.data.data);
        this.tudizlData = res.data.data.map((el) => {
          return {
            name: el.name,
            value: el.values,
          };
        });
      });
      api.data.getLandResourceLists().then((res) => {
        console.log("总地块商业占比、住宅占比", res.data.data);
        this.tudizlData2 = res.data.data.map((el) => {
          return {
            name: el.name,
            value: el.values,
          };
        });
      });
      api.data.getCategoryOfLand().then((res) => {
        console.log("土地类别统计", res.data.data);
        this.tudiliyData = res.data.data.map((el) => {
          return {
            name: el.name,
            value: el.values,
          };
        });
      });
    },
    // 交子地块图层
    addPlotLayer() {
      api.data.getCategoryOfLandList().then((res) => {
        // console.log("土地类别列表", res.data.data);
        this.stops = res.data.data.map((el) => {
          return [el.name, el.color];
        });
        // this.stops.push(["全部", "#dddd"]);
        // this.stops.push(["未建成", "#4c51ff"]);
        console.log(this.stops);
      });
      api.data.getParcelInfomations().then((res) => {
        // console.log("地块信息", res.data.data);
        let geojsonData = res.data.data;
        this.newLandData = {
          yjc: [],
          wjc: [],
        };

        geojsonData.features.forEach((el) => {
          if (el.geometry.type == "Polygon") {
            el.geometry.coordinates[0].push(el.geometry.coordinates[0][0]);
          }
          if (el.properties.buildFlag == 0) {
            this.newLandData.wjc.push(el);
          } else if (el.properties.buildFlag == 1) {
            this.newLandData.yjc.push(el);
          }
          if (typeof this.newLandData[el.properties.type] == "undefined") {
            this.newLandData[el.properties.type] = [];
          }
          this.newLandData[el.properties.type].push(el);
        });

        console.log(this.newLandData);

        console.log("地块信息", geojsonData);
        let params = {
          // id: layerId,
          data: geojsonData,
          fillColor: {
            property: "type",
            type: "categorical",
            stops: this.stops,
          },
        };
        addFillLayer2(params);
      });
    },
    close() {
      this.showModal = false;
      this.$store.commit("setName", "");
    },
    openModal() {
      this.showModal = true;
    },
    getTotalArea(code=""){
       api.data.getLandAreaWithCode({code}).then((res) => {
        console.log("总面积", res.data.data);
        this.TotalArea = res.data.data.values;
      });
    },
    select(name,all) {
      if(all){
        name =""
        this.selected = ""
      }
      this.getTotalArea(name)
      if (this.selected == name) {
        this.addPlotLayer();
        this.selected = "";
        return;
      }
      this.selected = name;
      let geojsonData = {
        type: "FeatureCollection",
        features: this.newLandData[name],
      };
      let params = {
        data: geojsonData,
        fillColor: {
          property: "type",
          type: "categorical",
          stops: this.stops,
        },
      };
      console.log(name);
      if (name == "yjc") {
        params.fillColor = "#a50609";
        params["color"] = "#a50609";
      } else if (name == "wjc") {
        params.fillColor = "#4c51ff";
        params["color"] = "#4c51ff";
      }
      console.log(params);
      addFillLayer2(params);
    },
    // showLand() {},
    // hideLand() {},
  },
};
</script>


<style scoped lang="scss">
.left-panel {
  position: absolute;
  left: 0;
  width: 580px;
  height: 100%;
  background: rgba(0, 18, 38, 0.84);
  padding: 30px 15px;
  box-sizing: border-box;
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

.icon-list-bg {
  width: 450px;
  height: 400px;
  background: rgba(0, 18, 38, 0.9);
  filter: blur(10px);
  position: fixed;
  bottom: 0;
  right: 0;
}

.icon-list {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 450px;
  height: 400px;
  box-sizing: border-box;
  padding: 35px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .title {
    display: flex;
    align-items: center;
    > div {
      width: 10px;
      height: 10px;
      background: #1890ff;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .item-list {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 345px;
    .item {
      display: flex;
      align-items: center;
      color: #fff;
      margin-left: 18px;
      font-size: 12px;
      margin-top: 5px;
      pointer-events: auto;
      cursor: pointer;
      > div {
        margin-right: 12px;
      }
      img {
        width: 30px;
        margin-right: 10px;
      }
    }
  }
}

.jcqk {
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 10px;
  > div {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    background: #a50609;
    opacity: 0.8;
    border-radius: 5px;
    &.wjc {
      background: #4c51ff;
    }
  }
}
</style>
