<template>
  <div class="module-contianer">
    <Panel>
      <div class="gl-panel-item">
        <Title>项目概览</Title>
        <div class="flex-box">
          <div class="gl-chart-box" style="width:33.3%;" v-for="(value, key) in indexList" :key="key">
            <PoloChart
              :id="'polo' + key"
              :name="key"
              titleShow
              :color="value.color"
              radius="75"
              :count="value.value"
              :unit="value.unit"
              :deep="value.deep"
            ></PoloChart>
          </div>
        </div>
      </div>

      <div class="gl-panel-item">
        <Title>购物中心概况</Title>
        <div class="gl-chart-box">
          <div class="index-list" style="height:100%;padding-left:20px">
            <div class="item" v-for="item in mallIndexList" :key="item.name">
              <div class="label">
                <i :class="'iconfont ' + item.icon"></i>
                <span>{{ item.name }}</span>
              </div>
              <div class="count">
                {{ item.value }}
                <span>{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="gl-panel-item">
        <Title>购物中心发展态势</Title>
        <div class="gl-chart-box">
          <SupperChart id="add" :chartData="chartData.add" barWidth="15" :color="['#4ADBFF', '#ffa24b']" />
        </div>
      </div>
    </Panel>

    <Panel type="right" v-if="!popupShow">
      <div class="gl-panel-item">
        <Title>功能区项目签约业态</Title>
        <div class="gl-chart-box" style="height:25vh">
          <PieChart
            id="type"
            :chartData="chartData.type"
            :radius="['40%', '55%']"
            legendType=""
            name="业态数量"
            unit="家"
          />
        </div>
      </div>
      <div class="gl-panel-item">
        <Title>功能区项目签约品牌</Title>
        <div class="page-chart-box">
          <div style="width:100%;height:100%;padding:8px">
            <dv-scroll-board :config="config" style="width:100%;height:100%" />
          </div>
        </div>
      </div>
    </Panel>

    <div class="btn-box">
      <div style="margin-bottom:8px" v-for="item in btnList" :key="item" @click="btnActive = item">
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

    <div class="legend-box">
      <Legend :stops="stops[btnActive]" type="circle"></Legend>
    </div>

    <div class="pop-up" v-if="popupShow">
      <div class="pop-flag" @click="clickMap">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <ChartItem title="项目详情" level="level2" color2="#06d1db">
        <div class="index-box">
          <div class="name">
            <span>项目名称</span>
            {{ popuInfo.name }}
          </div>
          <div class="list">
            <div class="item">
              <span>经营状态</span>
              {{ popuInfo.state }}
            </div>
            <div class="item">
              <span>项目类型</span>
              {{ popuInfo.type }}
            </div>
            <div class="item">
              <span>开业时长</span>
              {{ popuInfo.opentime }}年
            </div>
            <div class="item">
              <span>商业面积</span>
              {{ popuInfo.commercial }}
            </div>
            <div class="item">
              <span>商业楼层</span>
              {{ popuInfo.floor }}
            </div>
            <div class="item">
              <span>连锁项目</span>
              {{ popuInfo.islineprod }}
            </div>
            <div class="item">
              <span>停车位数</span>
              {{ popuInfo.parking }}
            </div>
            <div class="item">
              <span>所在商圈</span>
              {{ popuInfo.shangquann }}
            </div>
          </div>
        </div>
        <div v-if="popuInfo.type == '购物中心'">
          <Title level="level2">签约业态</Title>
          <div class="gl-chart-box" style="height:25vh">
            <PieChart
              id="infocategory"
              :chartData="chartData.info.category"
              :radius="['40%', '55%']"
              legendType=""
              name="业态数量"
              unit="家"
            />
          </div>
          <Title v-if="config2" level="level2">签约品牌</Title>
          <div class="gl-chart-box" style=" height: calc(75vh - 380px);" v-if="config2">
            <div style="width:100%;height:100%;padding:8px">
              <dv-scroll-board :config="config2" style="width:100%;height:100%" @click="tableClick" />
            </div>
          </div>
        </div>
      </ChartItem>
    </div>

    <div class="floor-box" v-if="floorList.length > 0">
      <div class="btn" @click="changeIndex(-1)">
        <i class="iconfont icon-shang"></i>
      </div>
      <div class="list">
        <div
          class="item"
          :style="floorActive == item ? 'background: #38a7d1;' : ''"
          @click="goFloor(item)"
          v-for="(item, index) in floorForList"
          :key="index"
        >
          {{ item == 'ALL' ? item : item > 0 ? 'L' + item : 'B' + item.slice(1) }}
        </div>
      </div>
      <div class="btn" @click="changeIndex(1)">
        <i class="iconfont icon-xia"></i>
      </div>
    </div>

    <LayerControl style="right:533px" :showLayer="showLayer" />
  </div>
</template>

<script>
import api from '@/api/ndApi/economy/project'
import { addCircleLayer, removeGeneralLayer, removeLayerById } from 'mapfunc'

export default {
  data() {
    return {
      // 按钮选中值
      btnActive: '项目类别',
      // 按钮列表
      btnList: ['项目类别', '开业状态'],
      // 右侧滚动表格配置
      config: {},
      // 地图数据
      mapLayer: {
        point: null
      },
      // 左侧水位图
      indexList: {
        购物中心: {
          value: 0,
          color: '#4ADBFF',
          unit: '个',
          deep: [0.2, 0.25]
        },
        酒店: {
          value: 0,
          color: '#4bffd1',
          unit: '个',
          deep: [0.5, 0.55]
        },
        写字楼: {
          value: 0,
          color: '#ffa24b',
          unit: '个',
          deep: [0.8, 0.85]
        }
      },
      // 左侧购物中心指标
      mallIndexList: [
        {
          name: '已开数量',
          icon: 'icon-shuliang',
          key: 'count_open',
          value: 1234,
          unit: '个'
        },
        {
          name: '已开面积',
          icon: 'icon-mianji1',
          key: 'count_open_area',
          value: 1234,
          unit: '万m²'
        },
        {
          name: '未开数量',
          icon: 'icon-jijianggunqiu',
          key: 'count_not_opened',
          value: 1234,
          unit: '个'
        },
        {
          name: '未开面积',
          icon: 'icon-mianji',
          key: 'count_not_open_area',
          value: 1234,
          unit: '万m²'
        },
        {
          name: '人均数量',
          icon: 'icon-renjun',
          key: 'avg_count',
          value: 1234,
          unit: '个/万人'
        },
        {
          name: '人均面积',
          icon: 'icon-renjunmianji',
          key: 'avg_area',
          value: 1234,
          unit: 'm²/人'
        }
      ],
      // 图例
      stops: {
        项目类别: [],
        开业状态: []
      },
      // 图表数据
      chartData: {
        category: {},
        type: {},
        add: {},
        info: {
          category: {}
        }
      },
      // 详情列表显示
      popupShow: false,
      // 项目详情内容
      popuInfo: {},
      // 详情轮播表
      config2: null,
      // 签约品牌备份
      brandBack: null,
      // 室内图层数据
      floorLayer: null,
      // 室内图层楼层组
      floorList: [],
      // 室内楼层选中楼层
      floorActive: 'ALL',
      // 项目中心点
      projectCenter: null,
      // 图层控制器
      showLayer: []
    }
  },
  computed: {
    floorForList() {
      let resList = []
      const index = this.floorList.indexOf(this.floorActive)

      if (index <= 2) {
        resList = this.floorList.slice(0)
      } else if (index >= this.floorList.length - 2) {
        resList = this.floorList.slice(this.floorList.length - 5)
      } else {
        resList = this.floorList.slice(index - 2)
      }
      return resList
    }
  },
  watch: {
    btnActive: {
      handler(val) {
        this.clickMap()
        removeGeneralLayer()
        this.getPointLayer(val)
      },
      immediate: true
    }
  },
  beforeDestroy() {
    window.map.off('click', 'circle_layer', this.clickHandle)
    window.map.off('click', 'circle_layer_symbol', this.clickHandle)
    removeLayerById(['circle_layer_ripple', 'symbol', 'project_line', 'project_symbol', 'project'])
  },
  mounted() {
    this.getChartData()
    this.getStops()
  },

  methods: {
    // 点击地图事件
    clickMap() {
      this.popupShow = false
      this.floorList = []
      removeLayerById(['circle_layer_ripple', 'symbol', 'project_line', 'project_symbol', 'project'])

      setTimeout(() => {
        this.getStops()
        this.$forceUpdate()
      }, 0)
    },
    // 获取图例
    getStops() {
      this.stops['项目类别'] = [
        ['购物中心', '#00fff7'],
        ['酒店', '#84ff00'],
        ['写字楼', '#ffa24b']
      ]
      this.stops['开业状态'] = [
        ['已开业', '#ffff00'],
        ['未开业', '#888888']
      ]
    },
    // 获取图表数据
    getChartData() {
      api.chart.category().then(res => {
        const data = res.data.data
        data.forEach(item => {
          if (this.indexList[item.type]) {
            this.indexList[item.type].value = item.count
          }
        })
      })

      api.chart.mallIndex().then(res => {
        const data = res.data.data
        this.mallIndexList.forEach(item => {
          item.value = data[item.key]
        })
      })

      api.chart.type().then(res => {
        const data = res.data.data
        let type = []
        data.forEach(item => {
          type.push({
            value: item.count,
            name: item.type == '服装/精品/其它零售' ? '零售' : item.type
          })
        })
        this.chartData.type = type
      })

      api.chart.add().then(res => {
        const data = res.data.data

        let add = {
          name: '项目数量',
          unit: '个',
          value: [
            {
              name: '项目总数',
              data: []
            },
            {
              name: '新增项目数',
              data: []
            }
          ],
          xAxis: []
        }
        for (let key in data.increase) {
          add.xAxis.push(key)
          add.value[0].data.push(data.total[key])
          add.value[1].data.push(data.increase[key])
        }
        this.chartData.add = add
      })

      api.chart.brand().then(res => {
        const data = res.data.data
        console.log(data)
        if (data) {
          let config = {
            data: [],
            oddRowBGC: '#003B5133',
            evenRowBGC: '#0982a655',
            header: ['品牌', '数量'],
            columnWidth: [260, 100],
            headerBGC: '#00BAFF77',
            carousel: 'page',
            waitTime: 5000,
            rowNum: 12
          }
          data.forEach(item => {
            config.data.push([item.brand, item.count])
          })
          this.config = config
          this.$forceUpdate()
        }
      })
    },
    // 获取点图层
    getPointLayer(type) {
      if (this.mapLayer.point) {
        this.addPointLayer(type)
      } else {
        api.map.point().then(res => {
          const data = res.data.data
          let layer = {
            type: 'FeatureCollection',
            features: []
          }
          data.forEach(item => {
            const oneFeature = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)]
              },
              properties: item
            }
            oneFeature.properties.name = item.projectnam
            oneFeature.properties.color = item.type
            oneFeature.properties.value = item.type == '购物中心' ? 9 : 6
            layer.features.push(oneFeature)
          })
          this.mapLayer.point = layer
          this.addPointLayer(type)
        })
      }
    },
    // 添加点图层
    addPointLayer(type) {
      window.map.off('click', 'circle_layer', this.clickHandle)
      window.map.off('click', 'circle_layer_symbol', this.clickHandle)

      if (type == '项目类别') {
        addCircleLayer({
          data: this.mapLayer.point,
          color: this.stops[this.btnActive],
          color_type: 'categorical',
          value: [
            [6, 6],
            [9, 9]
          ]
        })
      } else {
        const layer = JSON.parse(JSON.stringify(this.mapLayer.point))
        layer.features.forEach(item => {
          item.properties.color = item.properties.state
        })
        console.log(layer)
        addCircleLayer({
          data: layer,
          color: this.stops[this.btnActive],
          color_type: 'categorical',
          value: [
            [6, 6],
            [10, 10]
          ]
        })
      }

      setTimeout(() => {
        window.map.on('click', 'circle_layer', this.clickHandle)
        window.map.on('click', 'circle_layer_symbol', this.clickHandle)
      })
    },
    // 获取项目详情图表数据
    getInfoChart() {
      api.chart.contractType({ projectid: this.popuInfo.projectid }).then(res => {
        const data = res.data.data
        this.chartData.info.category = data
      })

      this.config2 = null

      api.chart.contractBrand({ projectid: this.popuInfo.projectid }).then(res => {
        const data = res.data.data
        if (data) {
          this.brandBack = data
          let config = {
            data: [],
            oddRowBGC: '#003B5133',
            evenRowBGC: '#0982a655',
            header: ['品牌', '楼层', '数量'],
            columnWidth: [200, 80, 80],
            headerBGC: '#00BAFF77',
            carousel: 'page',
            waitTime: 5000,
            rowNum: 10
          }
          data.forEach(item => {
            config.data.push([item.brand, item.floor, item.count])
          })
          this.config2 = config
          this.$forceUpdate()
        }
      })
    },
    // 点位点击事件
    clickHandle(e) {
      if (e.defaultPrevented) return

      // eslint-disable-next-line
      this.projectCenter = turf.center(e.features[0]).geometry.coordinates
      removeLayerById(['circle_layer_ripple', 'symbol', 'project_line', 'project_symbol', 'project'])

      if (e) {
        this.popuInfo = JSON.parse(JSON.stringify(e.features[0].properties))
        this.popupShow = true
        this.floorList = []
        this.floorActive = 'ALL'
      }

      if (this.popuInfo.type == '购物中心') this.getInfoChart()

      const flag = this.addShopBuild()

      if (!flag) {
        window.map.hasImage('circle_layer_ripple_image') ? window.map.removeImage('circle_layer_ripple_image') : ''
        const size = 80
        var rippleImage = {
          width: size,
          height: size,
          data: new Uint8Array(size * size * 4),

          onAdd: function() {
            var canvas = document.createElement('canvas')
            canvas.width = this.width
            canvas.height = this.height
            this.context = canvas.getContext('2d')
          },

          render: function() {
            var duration = 1000
            var t = (performance.now() % duration) / duration

            var radius = (size / 2) * 0.3
            var outerRadius = (size / 2) * 0.7 * t + radius
            var context = this.context

            // draw outer circle
            context.clearRect(0, 0, this.width, this.height)
            context.beginPath()
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
            context.fillStyle = `rgba(255,200,200,${1 - t})`
            context.fill()

            // update this image's data with data from the canvas
            this.data = context.getImageData(0, 0, this.width, this.height).data

            // keep the map repainting
            window.map.triggerRepaint()

            // return `true` to let the map know that the image was updated
            return true
          }
        }

        window.map.addImage('circle_layer_ripple_image', rippleImage, { pixelRatio: 2 })

        window.map.addLayer(
          {
            id: 'circle_layer_ripple',
            type: 'symbol',
            source: 'circle_layer',
            layout: {
              'icon-image': 'circle_layer_ripple_image',
              'icon-allow-overlap': true
            },
            filter: ['==', 'name', this.popuInfo.name]
          },
          'circle_layer'
        )

        window.map.addLayer({
          id: 'symbol',
          type: 'symbol',
          source: 'circle_layer',
          layout: {
            'text-field': '{name}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 14,
            'text-allow-overlap': false,
            'text-offset': [0, 1.2]
          },

          paint: {
            'text-color': '#9cffff'
          },
          filter: ['==', 'name', this.popuInfo.name]
        })
      }

      e.preventDefault()
    },
    // 添加室内图层
    addShopBuild() {
      if (!this.floorLayer) {
        const jiaozi_project = require('static/data/layer/jiaozi_project.json')
        this.floorLayer = jiaozi_project
      }
      if (this.floorLayer[this.popuInfo.name]) {
        this.showLayer = []

        window.map.flyTo({
          center: this.projectCenter,
          zoom: 17,
          pitch: 45
        })

        const project = this.getProjectLayer()
        window.map.addSource('project', {
          type: 'geojson',
          data: project
        })

        const line = convertPolygonToPolyline(project)
        let radius = 0.2
        // eslint-disable-next-line
        let lineBuffer = turf.buffer(line, radius, {
          units: 'meters'
        })

        window.map.addSource('project_line', {
          type: 'geojson',
          data: lineBuffer
        })

        window.map.addLayer({
          id: 'project',
          type: 'fill-extrusion',
          source: 'project',
          paint: {
            'fill-extrusion-translate': [0, 0],
            'fill-extrusion-color': {
              property: 'color_type',
              type: 'categorical' /* 函数类型，categorical表示函数的输出的值等于函数的输入 */,
              stops: [
                [10, 'rgb(69, 145, 246)'],
                [7, 'rgb(36, 186, 198)'],
                [3, 'rgb(25, 67, 98)'],
                [18, 'rgb(71, 247, 244)'],
                [6, 'rgb(139, 168, 188)'],
                [8, 'rgb(40, 134, 176)'],
                [2, 'rgb(69, 150, 157)'],
                [14, 'rgb(6, 131, 167)'],
                [12, 'rgb(90, 210, 247)'],
                [17, 'rgb(124, 213, 255)'],
                [15, 'rgb(90, 107, 247)'],
                [5, 'rgb(96, 119, 125)'],
                [4, 'rgb(109, 145, 176)']
              ]
            },
            'fill-extrusion-height': ['get', 'fill_height'],
            'fill-extrusion-base': ['get', 'base'],
            'fill-extrusion-opacity': 0.8
          },
          filter: ['>=', 'floor', 0]
        })

        window.map.addLayer({
          id: 'project_line',
          type: 'fill-extrusion',
          source: 'project_line',
          paint: {
            'fill-extrusion-color': '#000000',
            'fill-extrusion-height': ['get', 'line_height'],
            'fill-extrusion-base': ['get', 'fill_height'],
            'fill-extrusion-opacity': 0.8
          },
          filter: ['>=', 'floor', 0]
        })
        return true
      } else {
        return false
      }

      function convertPolygonToPolyline(geojson) {
        const geo = JSON.parse(JSON.stringify(geojson))
        geo.features.forEach(item => {
          // eslint-disable-next-line
          item.geometry = turf.polygonToLine(item.geometry).geometry
        })
        return geo
      }
    },
    // 添加室内面图层
    addFillLayer(floor) {
      const project = this.getProjectLayer()
      // 定义数据源
      window.map.addSource('project', {
        type: 'geojson',
        data: project
      })
      // 添加面图层
      window.map.addLayer({
        id: 'project',
        type: 'fill',
        source: 'project',
        paint: {
          'fill-color': {
            property: 'color_type',
            type: 'categorical' /* 函数类型，categorical表示函数的输出的值等于函数的输入 */,
            stops: [
              [10, 'rgb(69, 145, 246)'],
              [7, 'rgb(36, 186, 198)'],
              [3, 'rgb(25, 67, 98)'],
              [18, 'rgb(57, 203, 200)'],
              [6, 'rgb(139, 168, 188)'],
              [8, 'rgb(40, 134, 176)'],
              [2, 'rgb(69, 150, 157)'],
              [14, 'rgb(6, 131, 167)'],
              [12, 'rgb(90, 210, 247)'],
              [17, 'rgb(124, 213, 255)'],
              [15, 'rgb(74, 88, 202)'],
              [5, 'rgb(73, 122, 135)'],
              [4, 'rgb(109, 145, 176)']
            ]
          },
          'fill-opacity': 0.8
        },
        filter: ['==', 'floor', floor]
      })
      // 添加面边框
      window.map.addLayer({
        id: 'project_line',
        type: 'line',
        source: 'project',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-opacity': 0.4,
          'line-width': 0.6,
          'line-color': '#000000'
        },
        filter: ['==', 'floor', floor]
      })

      window.map.addLayer({
        id: 'project_symbol',
        type: 'symbol',
        source: 'project',
        layout: {
          'text-field': '{name}',
          'text-size': 12,
          'text-allow-overlap': false,
          'text-offset': [0, 1.2]
        },
        minzoom: 15,
        maxzoom: 24,
        paint: {
          'text-color': '#ffffff'
        },
        filter: ['==', 'floor', floor]
      })
    },
    // 修改楼层
    changeIndex(change) {
      const index = this.floorList.indexOf(this.floorActive)
      if (index + change >= 0 && index + change < this.floorList.length) {
        this.floorActive = this.floorList[index + change]
      }
      this.goFloor(this.floorActive)
    },
    tableClick(e) {
      this.goFloor(e.row[1])
    },
    // 切换楼层
    goFloor(floor, change) {
      if (!change) {
        this.floorActive = floor
      }
      removeLayerById(['project_line', 'project_symbol', 'project'])
      let config = {
        data: [],
        oddRowBGC: '#003B5133',
        evenRowBGC: '#0982a655',
        header: ['品牌', '楼层', '数量'],
        columnWidth: [200, 80, 80],
        headerBGC: '#00BAFF77',
        carousel: 'page',
        waitTime: 5000,
        rowNum: 10
      }
      if (floor == 'ALL') {
        this.brandBack.forEach(item => {
          config.data.push([item.brand, item.floor, item.count])
        })

        window.map.flyTo({
          center: this.projectCenter,
          pitch: 45
        })
        this.addShopBuild()
      } else {
        this.brandBack.forEach(item => {
          if (item.floor == this.floorActive) {
            config.data.push([item.brand, item.floor, item.count])
          }
        })

        window.map.flyTo({
          center: this.projectCenter,
          pitch: 0
        })
        this.addFillLayer(parseInt(floor))
      }
      this.config2 = config
      this.$forceUpdate()
    },
    // 获取室内图层
    getProjectLayer() {
      const project = {
        type: 'FeatureCollection',
        name: 'project',
        features: []
      }
      const height = 2
      const gap = 20
      this.floorList = ['ALL']
      for (let key in this.floorLayer[this.popuInfo.name]) {
        this.floorList.push(key)
        this.floorLayer[this.popuInfo.name][key].forEach(item => {
          item.properties.floor = parseInt(key)
          item.properties.base = (height + gap) * (key - 1)
          item.properties.fill_height = item.properties.base + height
          item.properties.line_height = item.properties.fill_height + 0.2
          item.properties.color_type = item.properties.regiontype[1]
          project.features.push(item)
        })
      }
      this.floorList.sort((a, b) => {
        return b - a
      })

      return project
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
}
.btn-box {
  position: relative;
  left: 460px;
  top: 10px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  align-items: center;
  pointer-events: auto;
}
.pop-up {
  position: fixed;
  right: 10px;
  top: 90px;
  z-index: 2;
  .pop-flag {
    z-index: 3;
    cursor: pointer;
    position: fixed;
    right: 20px;
    top: 100px;
    border-radius: 50%;
    padding: 5px;
    pointer-events: auto;
    &:hover {
      background: #05bbdb88;
      transition: all 0.4s;
    }
  }
  .index-box {
    .name {
      font-size: 14px;
      span {
        background: #027b9f;
        padding: 2px 6px;
        border-radius: 20px;
        font-size: 13px;
      }
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-around;
      margin: 10px 0;

      .item {
        font-size: 13px;
        border: 1px solid #09bec7aa;
        padding: 5px;
        margin-bottom: 5px;
        width: 45%;
        span {
          background: #fcbf08;
          color: #000;
          padding: 2px 4px;
          border-radius: 20px;
          font-size: 12px;
          margin-right: 2px;
        }
      }
    }
  }
}
.index-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .item {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid #ffffff88;
    box-sizing: border-box;
    padding-left: 10px;
    .label {
      i {
        font-size: 24px;
      }
      span {
        padding-left: 5px;
        font-size: 14px;
        font-family: 'ShangShouRuiYuanTi-2';
      }
      margin-bottom: 4px;
    }

    .count {
      padding-left: 5px;
      color: #00ffff;
      font-size: 20px;
      font-weight: bold;
      font-family: 'ledNumber';
      letter-spacing: 2px;
      background: rgb(101 101 101 / 40%);
      margin-right: 10px;
      span {
        font-size: 14px;
        font-family: '';
      }
    }
  }
}
.legend-box {
  position: fixed;
  right: 420px;
  top: 90px;
}
.floor-box {
  position: fixed;
  left: 450px;
  bottom: 90px;
  z-index: 2;
  pointer-events: auto;
  width: 40px;
  max-height: 220px;
  background: rgba(43, 53, 57, 60%);
  color: #fff;
  border-radius: 40px;
  padding: 10px 0;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 0 5px #fff;
  .btn {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    border-radius: 50%;
    &:hover {
      background: #38a7d1;
    }
  }
  .list {
    max-height: 160px;
    overflow: hidden;
    .item {
      font-size: 14px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      &:hover {
        background: #38a7d1;
      }
    }
  }
}
.page-chart-box {
  width: 100%;
  height: calc((75vh - 221px));
}
</style>
