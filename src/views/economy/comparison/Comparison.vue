<template>
  <div class="module-contianer">
    <div class="mapbox">
      <div class="left-map">
        <Mapbox id="leftMap" @init="initMap"></Mapbox>
      </div>
      <div class="right-map">
        <Mapbox id="rightMap" @init="initMap"></Mapbox>
      </div>
    </div>

    <div class="info-box" v-if="init.length == 2">
      <div class="left">交子公园金融产业商务区</div>
      <div class="right">
        <span>对比区域：</span>
        <el-select
          v-model="functional"
          placeholder="请选择"
          size="mini"
          style="width:150px"
          :disabled="functional != null"
          @change="functionalChange"
        >
          <el-option
            v-for="item in functionalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button size="mini" type="warning" plain @click="reset" :disabled="functional == null">重选</el-button>
      </div>
    </div>

    <div v-if="functional">
      <div class="panel-btn">
        <div v-for="item in typeList" @click="typeActive = item" :key="item">
          <GradualBtn
            size="mini"
            fontSize="14px"
            :shadow="typeActive == item"
            :color="typeActive == item ? '#38a7d1' : '#235783'"
          >
            {{ item }}
          </GradualBtn>
        </div>
      </div>
      <Shop v-if="typeActive == '商业发展对比'" :functional="functional"></Shop>
      <Flow v-if="typeActive == '客流对比'" :functional="functional"></Flow>
      <Radiate v-if="typeActive == '辐射能力对比'" :functional="functional"></Radiate>
    </div>
  </div>
</template>

<script>
import Mapbox from './Mapbox.vue'
import Shop from './Panel/Shop.vue'
import Flow from './Panel/Flow.vue'
import Radiate from './Panel/Radiate.vue'
import { getBorderByType, functionalTable } from 'localData'
import { removeLayerById, getCenterByLayer, mapOutParam } from './mapfunc'
export default {
  components: { Mapbox, Shop, Flow, Radiate },
  data() {
    return {
      init: [],
      functionalOptions: [],
      functional: null,
      typeActive: '商业发展对比',
      typeList: ['商业发展对比', '客流对比', '辐射能力对比']
    }
  },
  beforeDestroy() {
    mapOutParam.center[1] = [104.2, 30.6]
    mapOutParam.zoom[1] = 9.5
  },
  methods: {
    initMap(val) {
      this.init.push(val)
      if (this.init.length == 2) {
        console.log('地图初始化完成')
        for (let key in functionalTable) {
          this.functionalOptions.push({
            value: key,
            label: functionalTable[key]
          })
        }

        window.rightMap.on('click', 'functional_border', this.clickFunctional)
      }
    },
    reset() {
      this.functional = null
      this.typeActive = '商业发展对比'
      removeLayerById('rightMap', 'jiaozi_border2')
      removeLayerById('rightMap', 'jiaozi_border')

      window.rightMap.setLayoutProperty('functional_border', 'visibility', 'visible')
      window.rightMap.setLayoutProperty('functional_border_symbol', 'visibility', 'visible')
      window.rightMap.setLayoutProperty('functional_border_border', 'visibility', 'visible')
      mapOutParam.center[1] = [104.2, 30.6]
      mapOutParam.zoom[1] = 9.5
      setTimeout(() => {
        window.rightMap.flyTo({
          center: mapOutParam.center[1],
          zoom: mapOutParam.zoom[1]
        })
      }, 0)
    },
    functionalChange() {
      this.clickFunctional({ input: true, code: this.functional })
    },
    clickFunctional(e) {
      const Code = e.input ? e.code : e.features[0].properties.Code
      // const Code = e.input ? e.code : e.features[0].properties.Code
      if (Code == 'E17') {
        this.functional = null
        this.$message({
          message: '请选择交子商务区外的其他功能区',
          type: 'warning'
        })
        return
      }
      this.functional = Code
      let layer = {
        type: 'FeatureCollection',
        features: []
      }

      getBorderByType('functional').then(res => {
        res.features.some(item => {
          if (item.properties.Code == Code) layer.features.push(item)
          return item.properties.Code == Code
        })
        window.rightMap.addSource('jiaozi_border', {
          type: 'geojson',
          data: layer
        })
        // 主边界
        window.rightMap.addLayer({
          id: 'jiaozi_border',
          type: 'line',
          source: 'jiaozi_border',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-opacity': 0.8,
            'line-width': 7,
            'line-color': '#007CFF'
          }
        })
        window.rightMap.addLayer({
          id: 'jiaozi_border2',
          type: 'line',
          source: 'jiaozi_border',
          minzoom: 5,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-opacity': 1,
            'line-width': 1,
            'line-color': '#fff'
          }
        })
        const center = getCenterByLayer('rightMap', layer)
        // eslint-disable-next-line
        const area = turf.area(layer)
        const stops = [
          [13, 0],
          [12, 2.5],
          [11.5, 6.8],
          [11, 10],
          [10.5, 26],
          [10, 50],
          [9.5, 100]
        ]
        const zoomIndex = (area / 10000000).toFixed(1)
        let zoom = 0
        stops.some((item, index) => {
          if ((zoomIndex >= item[1] && zoomIndex < stops[index + 1][1]) || index == stops.length - 1) {
            zoom = item[0]
            return true
          }
        })
        mapOutParam.center[1] = center
        mapOutParam.zoom[1] = zoom
        window.rightMap.flyTo({
          center,
          zoom: mapOutParam.zoom[1]
        })
        window.rightMap.setLayoutProperty('functional_border', 'visibility', 'none')
        window.rightMap.setLayoutProperty('functional_border_symbol', 'visibility', 'none')
        window.rightMap.setLayoutProperty('functional_border_border', 'visibility', 'none')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mapbox {
  position: absolute;
  left: 0;
  top: -80px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  pointer-events: auto;
  .left-map {
    position: relative;
    width: 50%;
    height: 100vh;
    border-right: 1px solid #8febf7;
    box-shadow: 2px 0 8px #8febf7;
  }
  .right-map {
    width: 50%;
    height: 100vh;
    border-left: 1px solid #8febf7;
    box-shadow: -2px 0 8px #8febf7;
  }
}
.info-box {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-family: 'ShangShouRuiYuanTi-2';
  .left {
    text-align: right;
    width: 300px;
    padding-right: 10px;
  }
  .right {
    width: 300px;
    padding-left: 10px;
    pointer-events: auto;
    display: flex;
    align-items: center;
  }
}
.panel-btn {
  position: absolute;
  z-index: 2;
  display: flex;
  width: 380px;
  height: fit-content;
  justify-content: space-around;
  top: 23px;
  left: 20px;
  pointer-events: auto;
}
</style>
