<template>
  <div class="module-contianer">
    <Panel>
      <div class="btn-box">
        <div
          style="margin-right: 20px"
          v-for="item in btnList"
          :key="item"
          @click="butClickHandle(item)"
        >
          <GradualBtn
            size="mini"
            fontSize="15px"
            :shadow="btnActive == item"
            :color="btnActive == item ? '#38a7d1' : '#235783'"
          >
            {{ item }}
          </GradualBtn>
        </div>
      </div>

      <div class="gl-panel-item" v-if="btnActive == '高企概况'">
        <Title>高企概况</Title>
        <Title level="level2">高企总数</Title>
        <div class="gl-chart-box page-chart-box">
          <PoloChart
            :count="count11"
            name="企业数"
            unit="家"
            radius="50"
          ></PoloChart>
        </div>

        <Title level="level2">历年高企数量和增长率</Title>
        <div class="gl-chart-box" style="height: calc((100vh - 279px) / 3 + 30px);">
          <MixBarLineChart :chartData="chart12" :rotate="30"></MixBarLineChart>
        </div>

        <Title level="level2">八大细分领域分布</Title>
        <div class="gl-chart-box" style="height: calc((100vh - 279px) / 3 + 30px);">
          <PieChart
            :chartData="chart13"
            :radius="['0%', '60%']"
            :legendType="null"
            :center="['50%', '50%']"
            unit="家"
            name="高企数"
          />
        </div>
      </div>

      <div class="gl-panel-item" v-if="btnActive == '创新能力'">
        <Title>创新能力</Title>
        <Title level="level2">专利总数</Title>
        <div class="gl-chart-box" style="height: calc((100vh - 279px) / 3 - 60px);">
          <PoloChart :count="count21" id="chart21" name="企业数" unit="个" radius="65" />
        </div>

        <Title level="level2">历年专利数量和增长率</Title>
        <div class="gl-chart-box" style="height: calc((100vh - 279px) / 3 + 30px);">
          <MixBarLineChart :chartData="chart22" id="chart22" :dataZoom="true" :rotate="30" :barWidth="6" />
        </div>

        <Title level="level2">专利所属领域分布</Title>
        <div class="gl-chart-box" style="height: calc((100vh - 279px) / 3 + 30px);">
          <PieChart
            :chartData="chart23"
            id="chart23"
            :radius="['0%', '60%']"
            :legendType="null"
            :center="['50%', '50%']"
            unit="个"
            name="专利数"
          />
        </div>
      </div>

      <div class="gl-panel-item" v-if="btnActive == '融资分析'">
        <Title>融资分析</Title>
        <Title level="level2">融资总指标</Title>
        <div style="display: flex">
          <div class="gl-chart-box page-chart-box" style="width: 30%">
            <PoloChart
              :count="count31[0]"
              id="chart311"
              name="融资企业总数"
              titleShow
              radius="80"
              unit="家"
              :center="['50%', '40%']"
              :deep="[0.5, 0.53]"
            />
          </div>
          <div class="gl-chart-box page-chart-box" style="width: 30%">
            <PoloChart
              :count="count31[1]"
              id="chart312"
              name="融资总次数"
              titleShow
              color="#4bffd1"
              radius="80"
              unit="次"
              :center="['50%', '40%']"
              :deep="[0.6, 0.65]"
            />
          </div>
          <div class="gl-chart-box page-chart-box" style="width: 30%">
            <PoloChart
              :count="count31[2]"
              id="chart313"
              name="融资总金额"
              titleShow
              color="#ffa24b"
              radius="80"
              unit="亿元"
              :center="['50%', '40%']"
              :deep="[0.7, 0.74]"
            />
          </div>
        </div>

        <Title level="level2">融资领域</Title>
        <div class="gl-chart-box " style="height: calc((100vh - 279px) / 3 + 30px);">
          <PieChart
            :chartData="chart32"
            id="chart32"
            :radius="['0%', '60%']"
            :legendType="null"
            :center="['50%', '50%']"
            unit="次"
            name="融资次数"
          />
        </div>

        <Title level="level2">重要资本投资情况</Title>
        <div class="gl-chart-box" style="height: calc((100vh - 279px) / 3 + 30px);">
          <BarHorizChart :chartData="chart33" id="chart33" />
        </div>
      </div>
    </Panel>

    <div class="legend-box" v-show="stops && stops.length > 0">
      <Legend
        :stops="stops"
        label=">="
        type="circle"
        :unit="legendUnit"
      ></Legend>
    </div>

    <LayerControl :style="btnActive == '高企概况' ? '' : 'right:150px'" :showLayer="showLayer" />
  </div>
</template>

<script>
import store from "@/store";
import { addCircleLayer, mapOutParam, getEquivalentStops } from "mapfunc";

export default {
  data() {
    return {
      /* reqData */
      count11: 0,
      chart12: null,
      chart13: null,

      count21: 0,
      chart22: null,
      chart23: null,

      count31: [0, 0, 0],
      chart32: null,
      chart33: null,

      mapPointInitData: null,
      mapPointData: null,

      /* staticData */
      btnActive: "高企概况",
      btnList: ["高企概况", "创新能力", "融资分析"],
      stops: [],
      legendUnit: '',
      showLayer: ['build', 'trips']
    }
  },
  mounted() {
    this.butClickHandle(this.btnActive);
    window.map.on("click", "circle_layer", this.clickHandle);
    window.map.on("click", "circle_layer_symbol", this.clickHandle);
  },
  methods: {
    butClickHandle(act) {
      this.stops = [];
      this.btnActive = act;
      switch (act) {
        case "高企概况":
          this.getChartData1();
          break;
        case "创新能力":
          this.getChartData2();
          break;
        case "融资分析":
          this.getChartData3();
          break;
      }
      this.pointDataHandle();
      if (mapOutParam.popup.popup_div) {
        mapOutParam.popup.popup_div.remove();
      }
    },

    getChartData1() {
      this.chart12 = {
        unit: ["件", "%"],
        value: [
          {
            name: "事件数",
            data: [],
          },

          {
            name: "增长率",
            data: [],
            type: "line",
            yAxisIndex: 1,
          },
        ],
        xAxis: [],
      };
      this.chart13 = [
        { value: 0, name: '' },
        { value: 0, name: '' }
      ]

      this.http.get(this.url + `/api/v1/${store.state.functionId}/development/company/high/num`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        this.count11 = data
      })

      this.http.get(this.url + `/api/v1/${store.state.functionId}/development/company/high/year`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log(data)
        // {year: "2013", num: 27, rate: 10}
        let handleData = {
          unit: ['个', '%'],
          value: [
            {
              name: '企业数',
              data: []
            },

            {
              name: '增长率',
              data: [],
              type: 'line',
              yAxisIndex: 1
            }
          ],
          xAxis: []
        }
        data.increaseInfo.forEach(item => {
          handleData.value[0].data.push(item.num)
          handleData.value[1].data.push(item.rate)
          handleData.xAxis.push(item.year)
        })

        this.chart12 = handleData
      })

      this.http.get(this.url + `/api/v1/${store.state.functionId}/development/company/high/field`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log(data)
        // {field: "工程和技术研究和试验发展", num: 111}
        let handleData = []
        data.forEach(item => {
          handleData.push({ value: item.num, name: item.field })
        })

        this.chart13 = handleData
      })
    },
    getChartData2() {
      this.http.get(this.url + `/api/v1/${store.state.functionId}/development/patent/num`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log('resData', data)
        this.count21 = data
      })

      this.http.get(this.url + `/api/v1/${store.state.functionId}/development/patent/year`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log('resData', data)
        let handleData = {
          unit: ['个', '%'],
          value: [
            {
              name: '专利数',
              data: []
            },

            {
              name: '增长率',
              data: [],
              type: 'line',
              yAxisIndex: 1
            }
          ],
          xAxis: []
        }
        data.increaseInfo.forEach(item => {
          handleData.value[0].data.push(item.num)
          handleData.value[1].data.push(item.rate)
          handleData.xAxis.push(item.year)
        })

        this.chart22 = handleData
      })

      this.http.get(this.url + `/api/v1/${store.state.functionId}/development/patent/field`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log('resData', data)
        let handleData = []
        data.forEach(item => {
          handleData.push({ value: item.num, name: item.field })
        })

        this.chart23 = handleData
      })
    },
    getChartData3() {
      this.http
        .get(
          this.url + `/api/v1/${store.state.functionId}/development/invest/num`,
          {}
        )
        .then((res) => {
          if (!res) {
            return;
          }
          let data = res.data.data;
          // console.log('resData', data)

          this.count31 = [
            data.enterprise_num * 1,
            data.investment_num * 1,
            (data.invsetment_amount / 10000).toFixed(2) * 1,
          ];
        });

      this.http
        .get(
          this.url +
            `/api/v1/${store.state.functionId}/development/invest/field`,
          {}
        )
        .then((res) => {
          if (!res) {
            return;
          }
          let data = res.data.data;
          // console.log('resData', data)
          let handleData = [];
          data.forEach((item) => {
            handleData.push({ value: item.num, name: item.field });
          });

          this.chart32 = handleData;
        });

      this.http
        .get(
          this.url +
            `/api/v1/${store.state.functionId}/development/invest/Investor`,
          {}
        )
        .then((res) => {
          if (!res) {
            return;
          }
          let data = res.data.data;
          // console.log('resData', data)

          let handleData = {
            name: "投资额",
            unit: "亿元",
            value: [],
            yAxis: [],
          };
          data.forEach((item) => {
            handleData.value.push((item.amount / 10000).toFixed(2));
            handleData.yAxis.push(item.investor);
          });
          this.chart33 = handleData;
        });
    },

    async pointDataHandle() {
      let data = null;
      if (this.mapPointInitData) {
        data = this.mapPointInitData;
      } else {
        data = await this.getPointData();
      }
      if (!data) {
        return;
      }
      let layer = {
        type: "FeatureCollection",
        features: [],
      };

      data.forEach((item) => {
        let value = 0,
          color = 0;
        switch (this.btnActive) {
          case "高企概况":
            value = 100;
            color = 100;
            break;
          case "创新能力":
            value = item.patentNum;
            color = item.patentNum;
            break;
          case "融资分析":
            value = item.investedAmount;
            color = item.investedAmount;
            break;
        }
        if (!value) {
          return;
        }

        const oneFeature = {
          type: "Feature",
          geometry: JSON.parse(item.geom),
          properties: {},
        };

        oneFeature.properties.name = item.name;
        oneFeature.properties.patentNum = item.patentNum;
        oneFeature.properties.financeNum = item.investedNum;
        oneFeature.properties.financeAmount = item.investedAmount;

        oneFeature.properties.value = value;
        oneFeature.properties.color = color;

        layer.features.push(oneFeature);
      });
      this.addPointLayer(layer);
    },

    addPointLayer(data) {
      let numArr = [];
      let valueList = [];
      data.features.forEach((item) => {
        numArr.push(item.properties.color);
      });
      switch (this.btnActive) {
        case "高企概况":
          this.legendUnit = "";
          addCircleLayer({ data: data, color: "#00D5FF", value: 5 });
          break;
        case "创新能力":
        case "融资分析":
          this.btnActive == "创新能力"
            ? (this.legendUnit = "个")
            : (this.legendUnit = "万元");
          this.stops = getEquivalentStops({ array: numArr });
          valueList = getEquivalentStops({
            array: numArr,
            colorList: [3, 3.5, 4, 4.5, 5, 6, 7],
          });
          console.log(this.stops, valueList);
          addCircleLayer({ data: data, color: this.stops, value: valueList });
          break;
      }
    },
    clickHandle(e) {
      // eslint-disable-next-line
      const coordinates = turf.center(e.features[0]).geometry.coordinates;
      let { name, patentNum, financeNum, financeAmount } =
        e.features[0].properties;
      console.log("触发点击事件");

      let showInfo = `<div class="makerTop"><h4 class="markerHear" style="text-align: center"> 高企信息 </h4></div>
                            <div class="markerBody" style="font-size:13px">
                            <p>高企名称：${name} </p>
                     `;
      this.btnActive == "创新能力" &&
        (showInfo += `<p>专利数：${patentNum}个 </p>`);
      this.btnActive == "融资分析" &&
        (showInfo += `<p>融资次数：${financeNum}次 </p><p>融资总金额：${financeAmount}万元 </p>`);
      showInfo += "</div>";

      if (mapOutParam.popup.popup_div) {
        mapOutParam.popup.popup_div.remove();
      }
      // eslint-disable-next-line
      mapOutParam.popup.popup_div = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        className: "leftpopup",
        offset: [0, -10],
      })
        .setLngLat(coordinates)
        .setHTML(showInfo)
        .addTo(window.map);
    },

    getPointData() {
      return new Promise((resolve) => {
        this.http
          .get(
            this.url +
              `/api/v1/${store.state.functionId}/development/company/high/loc`,
            {}
          )
          .then((res) => {
            if (!res) {
              return;
            }
            let data = res.data.data;
            this.mapPointInitData = data;
            resolve(data);
          });
      });
    },
  },
  beforeDestroy() {
    if (mapOutParam.popup.popup_div) {
      mapOutParam.popup.popup_div.remove();
    }
    window.map.off("click", "circle_layer", this.clickHandle);
    window.map.off("click", "circle_layer_symbol", this.clickHandle);
  },
};
</script>

<style lang="scss" scoped>
.btn-box {
  margin: 0 0 10px 10px;
  display: flex;
}
.page-chart-box {
  height: calc((100vh - 279px) / 3);
}
.legend-box {
  position: fixed;
  right: 20px;
  top: 90px;
}
</style>
