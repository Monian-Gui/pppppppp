<template>
  <div class="module-contianer">
    <Panel>
      <div class="gl-panel-item">
        <Title>全区商业服务能力</Title>
        <div style="display: flex;">
          <div class="gl-chart-box" style="width:25%;height:140px">
            <PoloChart
              :count="count[0]"
              id="chart311"
              name="综合评价"
              titleShow
              radius="80"
              :deep="[count[0] * 0.2 - 0.05, count[0] * 0.2]"
            />
          </div>
          <div class="gl-chart-box" style="width:25%;height:140px">
            <PoloChart
              :count="count[1]"
              id="chart312"
              name="环境"
              titleShow
              color="#4bffd1"
              radius="80"
              :deep="[count[1] * 0.2 - 0.05, count[1] * 0.2]"
            />
          </div>
          <div class="gl-chart-box" style="width:25%;height:140px">
            <PoloChart
              :count="count[2]"
              id="chart313"
              name="服务"
              titleShow
              color="#ffa24b"
              radius="80"
              :deep="[count[2] * 0.2 - 0.05, count[2] * 0.2]"
            />
          </div>
          <div class="gl-chart-box" style="width:25%;height:140px">
            <PoloChart
              :count="count[3]"
              id="chart314"
              name="满意度"
              titleShow
              color="#CBEA0F"
              radius="80"
              :deep="[count[3] * 0.2 - 0.05, count[3] * 0.2]"
            />
          </div>
        </div>

        <Title>区域综合商业服务能力</Title>
        <div class="gl-chart-box" style="height:calc(100vh - 331px)">
          <div class="tab-list">
            <dv-scroll-board :config="compreList" style="width:100%;height:100%" />
          </div>
        </div>
      </div>
    </Panel>

    <Panel type="right">
      <div class="gl-panel-item">
        <Title>区域商业环境评价分析</Title>

        <div class="gl-chart-box page-chart-box">
          <div class="tab-list">
            <dv-scroll-board :config="enviroList" style="width:100%;height:100%" />
          </div>
        </div>

        <Title>区域商业服务评价分析</Title>

        <div class="gl-chart-box page-chart-box">
          <div class="tab-list">
            <dv-scroll-board :config="serveList" style="width:100%;height:100%" />
          </div>
        </div>

        <Title>区域商业满意度评价分析</Title>

        <div class="gl-chart-box page-chart-box">
          <div class="tab-list">
            <dv-scroll-board :config="satisList" style="width:100%;height:100%" />
          </div>
        </div>
      </div>
    </Panel>

    <div class="btn-box">
      <div style="margin-bottom:8px" v-for="item in btnList" :key="item" @click="butClickHandle(item)">
        <GradualBtn
          size="mini"
          fontSize="15px"
          :shadow="btnActive == item"
          :color="btnActive == item ? '#38a7d1' : '#235783'"
          style="width: 150px"
        >
          {{ item }}
        </GradualBtn>
      </div>
    </div>

    <LayerControl style="right:410px" :showLayer="showLayer" />
  </div>
</template>

<script>
import store from '@/store'

import { addFillLayer, mapOutParam, getEquivalentStops } from 'mapfunc'
export default {
  data() {
    return {
      /* reqData */

      count: [0, 0, 0, 0],
      compreList: {},
      enviroList: {},
      serveList: {},
      satisList: {},

      layerData: null,

      /* staticData */
      showLayer: ['trips'],
      btnActive: '综合商业服务评价',
      btnList: ['综合商业服务评价', '商业环境评价', '商业服务评价', '商业满意度评价']
    }
  },
  mounted() {
    this.getChartData()
    this.butClickHandle(this.btnActive)
  },
  methods: {
    butClickHandle(act) {
      this.btnActive = act
      this.layerDataHandle()
    },

    getChartData() {
      //左1
      this.http.get(this.url + `/api/v1/${store.state.functionId}/commercial/scores`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        console.log(data)
        let count = [data.averageScore, data.environmentScore, data.serviceScore, data.satisfactionScore]
        this.count = count
      })

      //左2
      this.http.get(this.url + `/api/v1/${store.state.functionId}/commercial/order/average`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        console.log(data)
        let itemList = []
        data.forEach(item => {
          itemList.push([item.id, item.areaName, item.score])
        })
        let handleList = {
          header: ['编号', '名称', '评分'],
          data: itemList,
          headerBGC: '#00BAFF77',
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          columnWidth: [45, 70, 160],
          align: ['center', 'center', 'center', 'center'],
          index: true,
          carousel: 'page',
          waitTime: '5000',
          rowNum: 18
        }

        this.compreList = handleList
      })

      //右1
      this.http.get(this.url + `/api/v1/${store.state.functionId}/commercial/order/environment`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log(data)
        let itemList = []
        data.forEach(item => {
          itemList.push([item.id, item.areaName, item.score])
        })
        let handleList = {
          header: ['编号', '名称', '评分'],
          data: itemList,
          headerBGC: '#00BAFF77',
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          columnWidth: [45, 70, 160],
          align: ['center', 'center', 'center', 'center'],
          index: true,
          carousel: 'page',
          waitTime: '5000',
          rowNum: 6
        }

        this.enviroList = handleList
      })

      //右2
      this.http.get(this.url + `/api/v1/${store.state.functionId}/commercial/order/service`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log(data)
        let itemList = []
        data.forEach(item => {
          itemList.push([item.id, item.areaName, item.score])
        })
        let handleList = {
          header: ['编号', '名称', '评分'],
          data: itemList,
          headerBGC: '#00BAFF77',
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          columnWidth: [45, 70, 160],
          align: ['center', 'center', 'center', 'center'],
          index: true,
          carousel: 'page',
          waitTime: '5000',
          rowNum: 6
        }

        this.serveList = handleList
      })

      //右3
      this.http.get(this.url + `/api/v1/${store.state.functionId}/commercial/order/satisfaction`, {}).then(res => {
        if (!res) {
          return
        }
        let data = res.data.data
        // console.log(data)
        let itemList = []
        data.forEach(item => {
          itemList.push([item.id, item.areaName, item.score])
        })
        let handleList = {
          header: ['编号', '名称', '评分'],
          data: itemList,
          headerBGC: '#00BAFF77',
          oddRowBGC: '#003B5133',
          evenRowBGC: '#0982a655',
          columnWidth: [45, 70, 160],
          align: ['center', 'center', 'center', 'center'],
          index: true,
          carousel: 'page',
          waitTime: '5000',
          rowNum: 6
        }

        this.satisList = handleList
      })
    },

    async layerDataHandle() {
      let data = null
      if (this.layerData) {
        data = this.layerData
      } else {
        data = await this.getLayerData()
      }

      if (!data) {
        return
      }

      let layer = {
        type: 'FeatureCollection',
        features: []
      }

      data.forEach(item => {
        let value = 0,
          color = 0
        switch (this.btnActive) {
          case '综合商业服务评价':
            value = item.avg
            color = item.avg
            break
          case '商业环境评价':
            value = item.env
            color = item.env
            break
          case '商业服务评价':
            value = item.ser
            color = item.ser
            break
          case '商业满意度评价':
            value = item.sat
            color = item.sat
            break
        }

        const oneFeature = {
          type: 'Feature',
          geometry: JSON.parse(item.geom),
          properties: {}
        }

        oneFeature.properties.name = item.id + (item.name ? ' ' + item.name : '')
        oneFeature.properties.type = item.type
        oneFeature.properties.value = value
        oneFeature.properties.color = color

        layer.features.push(oneFeature)
      })
      this.addLayer(layer)
    },

    addLayer(data) {
      console.log('addLayer data', data)
      let numArr = []
      data.features.forEach(item => {
        numArr.push(item.properties.color)
      })

      let stops = getEquivalentStops({ array: numArr })
      console.log(stops)
      addFillLayer({ data: data, color: stops })
      // window.map.on('click', 'circle_layer', this.clickHandle)
      // window.map.on('click', 'circle_layer_symbol', this.clickHandle)
    },
    clickHandle(e) {
      // eslint-disable-next-line
      const coordinates = turf.center(e.features[0]).geometry.coordinates
      let { name, type } = e.features[0].properties
      console.log('触发点击事件')
      type = type && type != 'null' ? type : '--'

      let showInfo = `<div class="makerTop"><h4 class="markerHear" style="text-align: center"> 店铺信息 </h4></div>
                            <div class="markerBody" style="font-size:13px">
                            <p>店铺名称：${name} </p>
                            <p>店铺类型：${type} </p>
                            </div>`

      if (mapOutParam.popup.popup_div) {
        mapOutParam.popup.popup_div.remove()
      }
      // eslint-disable-next-line
      mapOutParam.popup.popup_div = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        className: 'leftpopup',
        offset: [0, -10]
      })
        .setLngLat(coordinates)
        .setHTML(showInfo)
        .addTo(window.map)
    },

    getLayerData() {
      return new Promise(resolve => {
        this.http.get(this.url + `/api/v1/${store.state.functionId}/commercial/regions`, {}).then(res => {
          if (!res) {
            return
          }
          let data = res.data.data
          this.layerData = data
          resolve(data)
        })
      })
    }
  },
  beforeDestroy() {
    // window.map.off('click', 'circle_layer', this.clickHandle)
    // window.map.off('click', 'circle_layer_symbol', this.clickHandle)
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  position: relative;
  left: 460px;
  top: 10px;
  width: 150px;
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  align-items: center;
  pointer-events: auto;
}
.tab-list {
  width: 100%;
  height: 100%;
  padding: 8px;
}
.page-chart-box {
  padding-bottom: 20px;
  height: calc((100vh - 279px) / 3);
}
</style>
