import Vue from 'vue'

// 引入echarts
import * as echarts from 'echarts'

// // 按需引入
// import * as echarts from 'echarts/core'

// import { BarChart, LineChart } from 'echarts/charts'
// import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
// // 注意，新的接口中默认不再包含 Canvas 渲染器，需要显示引入，如果需要使用 SVG 渲染模式则使用 SVGRenderer
// import { CanvasRenderer } from 'echarts/renderers'
// echarts.use([BarChart, LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer])

// 引入水位图插件
import 'echarts-liquidfill'

Vue.prototype.$echarts = echarts
