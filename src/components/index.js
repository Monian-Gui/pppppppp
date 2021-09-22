import Title from './Title'
import AdaptLegend from './AdaptLegend.vue'
import Tips from './Tips.vue'
import ChartItem from './ChartItem.vue'
import HourLine from './HourLine.vue'
import Panel from './Panel.vue'
import GradualBtn from './GradualBtn.vue'
import Legend from './Legend.vue'
import LayerControl from './LayerControl.vue'

import charts from './charts'

export default Vue => {
  Vue.component('Title', Title)
  Vue.component('AdaptLegend', AdaptLegend)
  Vue.component('Tips', Tips)
  Vue.component('ChartItem', ChartItem)
  Vue.component('HourLine', HourLine)
  Vue.component('Panel', Panel)
  Vue.component('GradualBtn', GradualBtn)
  Vue.component('Legend', Legend)
  Vue.component('LayerControl', LayerControl)
  charts.forEach(item => {
    Vue.component(item.name, item.value)
  })
}
